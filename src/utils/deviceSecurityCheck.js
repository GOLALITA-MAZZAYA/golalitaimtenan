import { useEffect } from 'react';
import { Platform, Alert, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFreeRasp } from 'freerasp-react-native';
import RNExitApp from 'react-native-exit-app';
import {
  ENFORCE_CODE_OBFUSCATION,
  FREERASP_MALWARE_CONFIG,
  IS_PRODUCTION,
} from '../constants';
import { org } from '../org/config';
import { removeToken } from './secureStorage';
import logger from './logger';
import { getStorePlatformKey } from './storePlatform';

// Once set, the block persists until the app's data is cleared or the app is
// reinstalled — and a fresh install still has to pass detection again. There
// is deliberately no time-based auto-clear: freeRasp gives no "all clear"
// signal, so the absence of a callback on a given launch proves nothing.
const SECURITY_BLOCK_KEY = 'securityBlockedIssues';

let triggeredIssues = new Set();
let persistedIssues = new Set();
let alertVisible = false;
let alertScheduled = false;
// Warnings the user chose to continue past; not shown again this session.
const dismissedIssues = new Set();

// Huawei AppGallery reviewers install builds with their own tool, which
// freeRASP reports as an unrecognized source. On Huawei/Honor devices that
// one warning can be dismissed, does not log the user out and is not saved
// as a permanent block.
const isHuaweiDevice = getStorePlatformKey() === 'huawei';

const securityMessages = {
  privilegedAccess: 'Root or elevated privileges were detected.',
  debug: 'Debugging tools are enabled.',
  simulator: 'The app is running on an emulator or simulator.',
  unofficialStore: 'The app was installed from an unrecognized source.',
  hooks: 'Security hooking was detected.',
  secureHardwareNotAvailable: 'Secure hardware is unavailable on this device.',
  systemVPN: 'VPN usage is detected.',
  passcode: 'Device passcode or screen lock is not set.',
  devMode: 'Developer mode is enabled.',
  adbEnabled: 'USB debugging (ADB) is enabled.',
  screenRecording: 'Screen recording was detected.',
  multiInstance: 'App cloning or multi-instance was detected.',
};

const obfuscationMessage = 'Application code is not properly obfuscated.';

const genericBlockMessage =
  'Security issues were previously detected on this device.';

// Continue is offered when the screen-lock warning is shown alone or only
// alongside the unknown-source warning. On Huawei/Honor the unknown-source
// warning on its own can also be dismissed.
const canContinue = issues => {
  const issueList = Array.from(issues);
  const onlyAllowed = issueList.every(
    issue =>
      issue === securityMessages.passcode ||
      issue === securityMessages.unofficialStore,
  );

  if (!onlyAllowed) {
    return false;
  }

  return issues.has(securityMessages.passcode) || isHuaweiDevice;
};

// Hard threats mean the device or app is compromised/tampered: the session is
// revoked and the block survives relaunches. Soft signals (VPN, no passcode,
// dev mode, screenshots, ...) keep the existing alert-only behavior so a
// screenshot or an active VPN never logs a legitimate user out.
const hardThreatMessages = new Set([
  securityMessages.privilegedAccess,
  securityMessages.debug,
  securityMessages.simulator,
  securityMessages.unofficialStore,
  securityMessages.hooks,
  securityMessages.multiInstance,
  obfuscationMessage,
]);

// A debug build always has a debugger attached, usually runs on a simulator
// or a phone with developer mode / USB debugging on, and is never obfuscated,
// so these can never be enforced there.
const devBuildSignals = new Set([
  securityMessages.debug,
  securityMessages.simulator,
  securityMessages.devMode,
  securityMessages.adbEnabled,
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

  const buttons = [
    {
      text: 'Exit',
      onPress: () => RNExitApp.exitApp(),
    },
  ];

  if (canContinue(triggeredIssues)) {
    buttons.unshift({
      text: 'Continue',
      onPress: () => {
        triggeredIssues.forEach(issue => dismissedIssues.add(issue));
        triggeredIssues.clear();
        alertVisible = false;
      },
    });
  }

  Alert.alert('Security Issues Detected', message, buttons, {
    cancelable: false,
  });
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
    // Clears the Keychain entry (and its in-memory cache), not just the
    // logged-out flag — on iOS the Keychain survives a reinstall, so leaving
    // the token behind would let a reinstall auto-login again.
    await removeToken();
    await AsyncStorage.setItem('isUserLoggedOut', 'true');
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
const applyStoredIssues = issues => {
  issues.forEach(issue => {
    // Older installs may have this persisted; it's no longer enforced.
    if (issue === 'App integrity check failed.') {
      return;
    }
    // Drop AppGallery install-source warnings saved by older builds.
    if (isHuaweiDevice && issue === securityMessages.unofficialStore) {
      return;
    }
    persistedIssues.add(issue);
    triggeredIssues.add(issue);
  });

  const remaining = Array.from(persistedIssues);
  if (remaining.length === 0) {
    AsyncStorage.removeItem(SECURITY_BLOCK_KEY).catch(() => {});
    return false;
  }

  AsyncStorage.setItem(SECURITY_BLOCK_KEY, JSON.stringify(remaining)).catch(
    () => logger.error('Failed to persist security block'),
  );
  return true;
};

export const isDeviceBlocked = async () => {
  if (__DEV__ || !IS_PRODUCTION) {
    return false;
  }

  if (triggeredIssues.size > 0) {
    return true;
  }

  try {
    const stored = await AsyncStorage.getItem(SECURITY_BLOCK_KEY);

    if (!stored) {
      return false;
    }

    let issues;
    try {
      issues = JSON.parse(stored);
    } catch (error) {
      issues = [genericBlockMessage];
    }

    return applyStoredIssues(issues);
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
  const isHuaweiStoreWarning =
    isHuaweiDevice && message === securityMessages.unofficialStore;

  if (dismissedIssues.has(message)) {
    return;
  }

  if (__DEV__ && devBuildSignals.has(message)) {
    logger.warn(`[Security] ${message} Ignored in development build`);
    return;
  }

  if (
    !IS_PRODUCTION &&
    (devBuildSignals.has(message) ||
      message === securityMessages.unofficialStore)
  ) {
    logger.warn(`[Security] ${message} Ignored in direct device testing build`);
    return;
  }

  triggeredIssues.add(message);

  if (isHuaweiStoreWarning) {
    logger.warn('Unrecognized install source on Huawei device; session kept');
  } else if (hardThreatMessages.has(message)) {
    if (IS_PRODUCTION && !__DEV__) {
      blockDevice(message);
    } else {
      logger.warn(
        'Hard security threat detected; session kept in non-production build',
      );
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
      // A block left on a dev/test device by an earlier production-flagged install
      // would otherwise survive forever — drop it.
      if (__DEV__ || !IS_PRODUCTION) {
        AsyncStorage.removeItem(SECURITY_BLOCK_KEY).catch(() => {});
        return;
      }

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

      applyStoredIssues(issues);
      if (triggeredIssues.size === 0) {
        return;
      }

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
    unofficialStore: handleThreat(securityMessages.unofficialStore),
    hooks: handleThreat(securityMessages.hooks),
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

  return useFreeRasp(
    {
      // Debug builds must stay in Talsec's dev mode even when the app points
      // at the production backend.
      isProd: IS_PRODUCTION && !__DEV__,
      // Everything above reacts in JS, which Frida can hook to swallow the
      // threat callbacks. This makes the native SDK kill the app when it sees
      // its callbacks being suppressed (Android only).
      killOnBypass: IS_PRODUCTION && !__DEV__,
      androidConfig: {
        packageName: org.androidPackage,
        certificateHashes:
          !IS_PRODUCTION || __DEV__
            ? [...org.signInCertHashes, org.debugSignInCertHash]
            : org.signInCertHashes,
        malwareConfig: FREERASP_MALWARE_CONFIG,
      },
      iosConfig: {
        appBundleId: org.iosBundleId,
        appTeamId: org.iosTeamId,
      },
      watcherMail: org.supportEmail,
    },
    actions,
  );
};
