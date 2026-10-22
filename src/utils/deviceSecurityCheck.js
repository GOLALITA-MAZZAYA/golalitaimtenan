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
import { clearAuthToken } from './tokenStorage';
import logger from './logger';

// Legacy key from builds that persisted threats across updates.
const SECURITY_BLOCK_KEY = 'securityBlockedIssues';

let triggeredIssues = new Set();
let alertVisible = false;
let alertScheduled = false;
let raspInitialized = false;

const ignoreThreat = message => () =>
  logger.warn(`[Security] ${message} detected; ignored`);

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

const hardThreatMessages = new Set([
  securityMessages.privilegedAccess,
  securityMessages.debug,
  securityMessages.simulator,
  securityMessages.appIntegrity,
  securityMessages.unofficialStore,
  securityMessages.hooks,
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
  } catch (error) {
    logger.error('Failed to revoke session after security threat');
  }
};

export const isDeviceBlocked = async () => {
  if (!raspInitialized) {
    triggeredIssues.clear();
    alertVisible = false;
    alertScheduled = false;
    return false;
  }

  return triggeredIssues.size > 0;
};

export const showSecurityAlert = () => {
  if (!raspInitialized) {
    return;
  }

  alertVisible = false;
  showAlert();
};

const handleThreat = message => () => {
  triggeredIssues.add(message);

  if (hardThreatMessages.has(message) && IS_PRODUCTION) {
    revokeSession();
  } else if (hardThreatMessages.has(message)) {
    logger.warn(
      'Hard security threat detected; session kept in non-production build',
    );
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
  logger.warn('Malware scan flagged apps');
};

export const useSecurityCheck = () => {
  raspInitialized = true;

  // Drop any leftover block from older builds that persisted threats.
  useEffect(() => {
    AsyncStorage.removeItem(SECURITY_BLOCK_KEY).catch(() => {
      logger.error('Failed to clear legacy security block');
    });
  }, []);

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
    deviceBinding: ignoreThreat(securityMessages.deviceBinding),
    secureHardwareNotAvailable: handleThreat(
      securityMessages.secureHardwareNotAvailable,
    ),
    systemVPN: handleThreat(securityMessages.systemVPN),
    passcode: handleThreat(securityMessages.passcode),
    screenshot: () => logger.warn('Screenshot detected'),
    screenRecording: handleThreat(securityMessages.screenRecording),
    obfuscationIssues: handleObfuscationIssue,
    devMode: handleThreat(securityMessages.devMode),
    adbEnabled: handleThreat(securityMessages.adbEnabled),
    malware: handleMalware,
    multiInstance: handleThreat(securityMessages.multiInstance),
  };

  if (Platform.OS === 'ios') {
    actions.deviceID = ignoreThreat(securityMessages.deviceID);
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
