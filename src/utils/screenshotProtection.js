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
  } catch (error) {
    // freerasp's native block requires Talsec to be running; the blur
    // fallback below still applies on iOS regardless.
  }

  if (Platform.OS === 'ios') {
    enableIosPrivacySnapshot(true);
  }
};

export const disableScreenshotProtection = async () => {
  try {
    await applyScreenCaptureBlock(false);
  } catch (error) {
    // ignore, see enableScreenshotProtection
  }

  if (Platform.OS === 'ios') {
    enableIosPrivacySnapshot(false);
  }
};
