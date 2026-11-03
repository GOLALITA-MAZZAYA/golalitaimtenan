import { useEffect } from 'react';
import { Platform, Alert, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFreeRasp } from 'freerasp-react-native';
import RNExitApp from 'react-native-exit-app';
import { IS_PRODUCTION } from '../constants';
import { org } from '../org/config';
import { removeToken } from './secureStorage';
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
  //  appIntegrity: 'App integrity check failed.',
  unofficialStore: 'The app was installed from an unrecognized source.',
  hooks: 'Security hooking was detected.',
  systemVPN: 'VPN usage is detected.',
  multiInstance: 'App cloning or multi-instance was detected.',
};

const genericBlockMessage =
  'Security issues were previously detected on this device.';

// Hard threats mean the device or app is compromised/tampered: the session is
// revoked and the block survives relaunches. Soft signals (VPN, no passcode,
// dev mode, screenshots, ...) keep the existing alert-only behavior so a
// screenshot or an active VPN never logs a legitimate user out.
//
// appIntegrity is deliberately NOT here: it alerts and refuses login for the
// current launch, but is never persisted. A signing-cert mismatch (new Play
// key, store re-signing) would otherwise lock real users out until they
// reinstall; this way a fixed release recovers them on the next launch.
const hardThreatMessages = new Set([
  securityMessages.privilegedAccess,
  securityMessages.debug,
  securityMessages.simulator,
  securityMessages.unofficialStore,
  securityMessages.hooks,
  securityMessages.multiInstance,
]);

// A debug build always has a debugger attached and usually runs on a
// simulator, so these two can never be enforced there.
const devBuildSignals = new Set([
  securityMessages.debug,
  securityMessages.simulator,
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
    if (issue === securityMessages.appIntegrity) {
      return;
    }
    persistedIssues.add(issue);
    triggeredIssues.add(issue);
  });

  const remaining = Array.from(persistedIssues);
  if (remaining.length === 0) {
    AsyncStorage.removeItem(SECURITY_BLOCK_KEY).catch(() => { });
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
  if (__DEV__ && devBuildSignals.has(message)) {
    logger.warn(`[Security] ${message} Ignored in development build`);
    return;
  }

  if (
    !IS_PRODUCTION &&
    (devBuildSignals.has(message) ||
      message === securityMessages.unofficialStore ||
      message === securityMessages.appIntegrity)
  ) {
    logger.warn(`[Security] ${message} Ignored in direct device testing build`);
    return;
  }

  triggeredIssues.add(message);

  if (hardThreatMessages.has(message)) {
    if (IS_PRODUCTION && !__DEV__) {
      blockDevice(message);
    } else {
      logger.warn('Hard security threat detected; session kept in non-production build');
    }
  }

  scheduleAlertOnce();
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
        AsyncStorage.removeItem(SECURITY_BLOCK_KEY).catch(() => { });
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
    //appIntegrity: handleThreat(securityMessages.appIntegrity),
    // unofficialStore: handleThreat(securityMessages.unofficialStore),
    hooks: handleThreat(securityMessages.hooks),
    systemVPN: handleThreat(securityMessages.systemVPN),
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
        certificateHashes: (!IS_PRODUCTION || __DEV__)
          ? [...org.signInCertHashes, org.debugSignInCertHash]
          : org.signInCertHashes,
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
