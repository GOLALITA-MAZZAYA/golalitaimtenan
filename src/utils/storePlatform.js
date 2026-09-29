import { Platform } from 'react-native';

/**
 * Resolves which store platform this install should compare against:
 * - ios → Apple App Store
 * - huawei → Huawei AppGallery (Huawei / Honor devices)
 * - android → Google Play Store
 */
export const getStorePlatformKey = () => {
  if (Platform.OS === 'ios') {
    return 'ios';
  }

  const brand = String(Platform.constants?.Brand || '').toUpperCase();
  const manufacturer = String(
    Platform.constants?.Manufacturer || '',
  ).toUpperCase();

  const isAppGalleryDevice =
    brand.includes('HUAWEI') ||
    manufacturer.includes('HUAWEI') ||
    brand.includes('HONOR') ||
    manufacturer.includes('HONOR');

  return isAppGalleryDevice ? 'huawei' : 'android';
};

export default getStorePlatformKey;
