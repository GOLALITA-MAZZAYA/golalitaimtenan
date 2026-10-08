import { NativeModules, Platform } from 'react-native';

const { RNWindowSecurity } = NativeModules;

export const setSecureWindow = enabled => {
  if (Platform.OS !== 'android' || !RNWindowSecurity?.setSecureWindow) {
    return;
  }

  RNWindowSecurity.setSecureWindow(enabled);
};

/** Off while AR camera is shown — SurfaceView marks overlay taps as obscured. */
export const setTapjackingProtection = enabled => {
  if (Platform.OS !== 'android' || !RNWindowSecurity?.setTapjackingProtection) {
    return;
  }

  RNWindowSecurity.setTapjackingProtection(enabled);
};
