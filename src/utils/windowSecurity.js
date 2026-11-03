import { NativeModules, Platform } from 'react-native';

const { RNWindowSecurity } = NativeModules;

export const setSecureWindow = enabled => {
  if (Platform.OS !== 'android' || !RNWindowSecurity?.setSecureWindow) {
    return;
  }

  RNWindowSecurity.setSecureWindow(enabled);
};
