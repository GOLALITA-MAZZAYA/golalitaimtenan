import { useFreeRasp } from 'freerasp-react-native';
import { Alert } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import {
  ANDROID_PACKAGE_NAME,
  IOS_PACKAGE_NAME,
  IOS_TEAM_ID,
  IS_PRODUCTION,
  SIGN_IN_CERTIFICATE_HASHES,
  SUPPORTMAIL,
} from '../constants';

let triggeredIssues = new Set();
let alertScheduled = false;

const securityMessages = {
  privilegedAccess: 'Root or elevated privileges were detected.',
  debug: 'Debugging tools are enabled.',
  simulator: 'The app is running on an emulator/simulator.',
  appIntegrity: 'App integrity check failed.',
  unofficialStore: 'Installed from an unofficial store.',
  hooks: 'Security hooking detected.',
  deviceBinding: 'Device mismatch detected.',
  // secureHardwareNotAvailable: "Secure hardware is unavailable.",
  systemVPN: 'VPN usage is detected.',
  // passcode: "Device passcode is not set.",
  // deviceID: "Device ID mismatch.",
  obfuscationIssues: 'Obfuscation verification failed.',
  devMode: 'Developer mode is enabled.',
};

const scheduleAlertOnce = () => {
  if (!alertScheduled) {
    alertScheduled = true;

    setTimeout(() => {
      if (triggeredIssues.size > 0) {
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
      }
    }, 800);
  }
};

export const useSecurityCheck = () => {
  const actions = {};

  for (const [key, message] of Object.entries(securityMessages)) {
    actions[key] = () => {
      triggeredIssues.add(message);
      scheduleAlertOnce();
    };
  }

  return useFreeRasp(
    {
      isProd: IS_PRODUCTION,
      androidConfig: {
        packageName: ANDROID_PACKAGE_NAME,
        certificateHashes: SIGN_IN_CERTIFICATE_HASHES,
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
