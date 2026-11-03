import { Platform } from 'react-native';
import { blockScreenCapture } from 'freerasp-react-native';

let PrivacySnapshot = require('react-native-privacy-snapshot');

const enableIosPrivacySnapshot = enabled => {
  PrivacySnapshot?.enabled(enabled);
};

const applyScreenCaptureBlock = async enabled => {
  await blockScreenCapture(enabled);
};

export const enableScreenshotProtection = async () => {
  try {
    await applyScreenCaptureBlock(true);
  } finally {
    // freerasp's native block requires Talsec to be running; the blur
    // fallback below still applies on iOS regardless of whether the
    // native block above succeeded. The `finally` (not `catch`) lets a
    // failure above still propagate to the caller — useScreenSecurity's
    // retry-on-boot-race logic depends on this rejection to know to retry.
    if (Platform.OS === 'ios') {
      enableIosPrivacySnapshot(true);
    }
  }
};

export const disableScreenshotProtection = async () => {
  try {
    await applyScreenCaptureBlock(false);
  } catch (error) {
    // Swallowed deliberately: unlike enable, nothing retries a failed
    // disable, and both call sites in useScreenSecurity.js call this
    // without a .catch(), so letting it reject would be an unhandled
    // rejection for no benefit — a failed disable just leaves protection
    // on, which is the safe-side outcome anyway.
  }

  if (Platform.OS === 'ios') {
    enableIosPrivacySnapshot(false);
  }
};
