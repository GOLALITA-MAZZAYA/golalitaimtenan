import { useEffect } from 'react';
import { Platform, Alert, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFreeRasp } from 'freerasp-react-native';
import RNExitApp from 'react-native-exit-app';
import {
  ANDROID_PACKAGE_NAME,
  ENFORCE_CODE_OBFUSCATION,
  FREERASP_MALWARE_CONFIG,
  IOS_PACKAGE_NAME,
  IOS_TEAM_ID,
  IS_PRODUCTION,
  SIGN_IN_CERTIFICATE_HASHES,
  SUPPORTMAIL,
} from '../constants';
import store from '../redux/store';
import {
  setIsAuthorized,
  setToken,
  setUser,
  setUserId,
  setIsGuest,
  setIsUserJustLogOut,
} from '../redux/auth/auth-actions';
import logger from './logger';

// Once set, the block persists until the app's data is cleared or the app is
// reinstalled — and a fresh install still has to pass detection again. There
// is deliberately no time-based auto-clear: freeRasp gives no "all clear"
// signal, so the absence of a callback on a given launch proves nothing.
const SECURITY_BLOCK_KEY = 'securityBlockedIssues';

let triggeredIssues = new Set();
let persistedIssues = new Set();
let alertVisible = false;
let alertScheduled = false;

const securityMessages = {
  privilegedAccess: 'Root or elevated privileges were detected.',
  debug: 'Debugging tools are enabled.',
  simulator: 'The app is running on an emulator or simulator.',
  appIntegrity: 'App integrity check failed.',
  unofficialStore: 'The app was installed from an unrecognized source.',
  hooks: 'Security hooking was detected.',
  deviceBinding: 'Device binding mismatch was detected.',
  secureHardwareNotAvailable: 'Secure hardware is unavailable on this device.',
  systemVPN: 'VPN usage is detected.',
  passcode: 'Device passcode or screen lock is not set.',
  deviceID: 'Device identity mismatch was detected.',
  devMode: 'Developer mode is enabled.',
  adbEnabled: 'USB debugging (ADB) is enabled.',
  screenRecording: 'Screen recording was detected.',
  multiInstance: 'App cloning or multi-instance was detected.',
};

const obfuscationMessage = 'Application code is not properly obfuscated.';
const genericBlockMessage =
  'Security issues were previously detected on this device.';

// Hard threats mean the device or app is compromised/tampered: the session is
// revoked and the block survives relaunches. Soft signals (VPN, no passcode,
// dev mode, screenshots, ...) keep the existing alert-only behavior so a
// screenshot or an active VPN never logs a legitimate user out.
const hardThreatMessages = new Set([
  securityMessages.privilegedAccess,
  securityMessages.debug,
  securityMessages.simulator,
  securityMessages.appIntegrity,
  securityMessages.unofficialStore,
  securityMessages.hooks,
  securityMessages.deviceBinding,
  securityMessages.deviceID,
  securityMessages.multiInstance,
  obfuscationMessage,
]);

const showAlert = () => {
  if (alertVisible || triggeredIssues.size === 0) {
    return;
  }

  alertVisible = true;

  const message = Array.from(triggeredIssues)
    .map(issue => `• ${issue}`)
    .join('\n');

  Alert.alert(
    'Security Issues Detected',
    message,
    [
      {
        text: 'Exit',
        onPress: () => RNExitApp.exitApp(),
      },
    ],
    { cancelable: false },
  );
};

const scheduleAlertOnce = () => {
  if (alertScheduled) {
    return;
  }

  alertScheduled = true;

  setTimeout(() => {
    alertScheduled = false;
    showAlert();
  }, 800);
};

const revokeSession = async () => {
  try {
    await AsyncStorage.setItem('token', '');
    await AsyncStorage.setItem('isUserLoggedOut', 'true');
    await AsyncStorage.setItem('lastLogoutTimestamp', Date.now().toString());

    store.dispatch(setIsUserJustLogOut(true));
    store.dispatch(setToken(null));
    store.dispatch(setUserId(null));
    store.dispatch(setUser(null));
    store.dispatch(setIsAuthorized(false));
    store.dispatch(setIsGuest(false));
  } catch (error) {
    logger.error('Failed to revoke session after security threat');
  }
};

const blockDevice = message => {
  persistedIssues.add(message);
  AsyncStorage.setItem(
    SECURITY_BLOCK_KEY,
    JSON.stringify(Array.from(persistedIssues)),
  ).catch(() => logger.error('Failed to persist security block'));
  revokeSession();
};

// Enforcement point for the login flow: the alert alone is not a gate — on
// iOS it can silently fail to present when triggered over a modal (splash /
// onboarding), leaving the app usable. Callers must treat `true` as "refuse
// to authenticate".
export const isDeviceBlocked = async () => {
  if (triggeredIssues.size > 0) {
    return true;
  }

  try {
    const stored = await AsyncStorage.getItem(SECURITY_BLOCK_KEY);

    if (!stored) {
      return false;
    }

    // Seed the issue list so the alert has content even when this runs
    // before the mount effect has loaded the persisted issues.
    let issues;
    try {
      issues = JSON.parse(stored);
    } catch (error) {
      issues = [genericBlockMessage];
    }

    issues.forEach(issue => {
      persistedIssues.add(issue);
      triggeredIssues.add(issue);
    });

    return true;
  } catch (error) {
    logger.error('Failed to read security block flag');
    return false;
  }
};

export const showSecurityAlert = () => {
  // A failed iOS presentation leaves alertVisible stuck true — reset it so an
  // explicit enforcement point always gets a fresh attempt.
  alertVisible = false;
  showAlert();
};

const handleThreat = message => () => {
  // Gracefully bypass developer/simulator threats in non-production builds
  if (!IS_PRODUCTION && (
    message === securityMessages.simulator ||
    message === securityMessages.debug ||
    message === securityMessages.devMode ||
    message === securityMessages.adbEnabled
  )) {
    logger.warn(`[Security] ${message} detected; bypassing alert in non-production build`);
    return;
  }

  triggeredIssues.add(message);

  if (hardThreatMessages.has(message)) {
    if (IS_PRODUCTION) {
      blockDevice(message);
    } else {
      logger.warn(`[Security] Hard security threat detected: ${message}; session kept in non-production build`);
    }
  }

  scheduleAlertOnce();
};

const handleObfuscationIssue = () => {
  if (!ENFORCE_CODE_OBFUSCATION) {
    logger.warn('Obfuscation is not enabled for this build');
    return;
  }

  handleThreat(obfuscationMessage)();
};

const handleMalware = () => {
  // Not surfaced to the user or blocked on — flagged solely for diagnostics.
  logger.warn('Malware scan flagged apps');
};

export const useSecurityCheck = () => {
  // A device flagged on a previous launch is confronted with the alert again
  // right away, instead of racing freeRasp's async detection against startup.
  // The session was already revoked when the threat fired, so even if the
  // alert is dismissed by killing the app, there is nothing to resume into.
  useEffect(() => {
    (async () => {
      let stored = null;

      try {
        stored = await AsyncStorage.getItem(SECURITY_BLOCK_KEY);
      } catch (error) {
        logger.error('Failed to read persisted security issues');
      }

      if (!stored) {
        return;
      }

      let issues;
      try {
        issues = JSON.parse(stored);
      } catch (error) {
        issues = [genericBlockMessage];
      }

      issues.forEach(issue => {
        persistedIssues.add(issue);
        triggeredIssues.add(issue);
      });

      scheduleAlertOnce();

      // On iOS the first presentation can silently fail while the splash
      // modal is animating, leaving alertVisible stuck true. Force one more
      // attempt after startup has settled.
      if (Platform.OS === 'ios') {
        setTimeout(() => {
          if (triggeredIssues.size > 0) {
            showSecurityAlert();
          }
        }, 4000);
      }
    })();
  }, []);

  // Backgrounding the app can dismiss the alert (Android) or the alert can
  // fail to present when triggered too early in launch (iOS) — either way the
  // app behind it stays fully usable. Re-show it on every return to the
  // foreground while issues are present.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active' && triggeredIssues.size > 0) {
        alertVisible = false;
        showAlert();
      }
    });

    return () => subscription.remove();
  }, []);

  const actions = {
    privilegedAccess: handleThreat(securityMessages.privilegedAccess),
    debug: handleThreat(securityMessages.debug),
    simulator: handleThreat(securityMessages.simulator),
    appIntegrity: handleThreat(securityMessages.appIntegrity),
    unofficialStore: handleThreat(securityMessages.unofficialStore),
    hooks: handleThreat(securityMessages.hooks),
    deviceBinding: handleThreat(securityMessages.deviceBinding),
    secureHardwareNotAvailable: handleThreat(
      securityMessages.secureHardwareNotAvailable,
    ),
    systemVPN: handleThreat(securityMessages.systemVPN),
    passcode: handleThreat(securityMessages.passcode),
    // Screenshots are the user capturing their own screen — FLAG_SECURE
    // (useScreenSecurity) already blocks them where it matters, so just log.
    screenshot: () => logger.warn('Screenshot detected'),
    screenRecording: handleThreat(securityMessages.screenRecording),
    obfuscationIssues: handleObfuscationIssue,
    devMode: handleThreat(securityMessages.devMode),
    adbEnabled: handleThreat(securityMessages.adbEnabled),
    malware: handleMalware,
    multiInstance: handleThreat(securityMessages.multiInstance),
  };

  if (Platform.OS === 'ios') {
    actions.deviceID = handleThreat(securityMessages.deviceID);
  }

  return useFreeRasp(
    {
      isProd: IS_PRODUCTION,
      androidConfig: {
        packageName: ANDROID_PACKAGE_NAME,
        certificateHashes: SIGN_IN_CERTIFICATE_HASHES,
        malwareConfig: FREERASP_MALWARE_CONFIG,
      },
      iosConfig: {
        appBundleId: IOS_PACKAGE_NAME,
        appTeamId: IOS_TEAM_ID,
      },
      watcherMail: SUPPORTMAIL,
    },
    actions,
  );
};
