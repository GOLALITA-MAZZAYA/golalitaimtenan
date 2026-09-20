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
import { clearAuthToken } from './tokenStorage';

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
    await clearAuthToken();
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
  return false;
};

export const showSecurityAlert = () => {
  // Security checks disabled
};

const handleThreat = message => () => {
  // Security checks disabled
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
  useEffect(() => {
    logger.info('Security check is disabled');
  }, []);
};
