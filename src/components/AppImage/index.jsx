import { memo } from 'react';
import { Image as RNImage, Platform } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { toImageSource } from '../../utils/imageSource';

const FIT_TO_RESIZE = {
  cover: 'cover',
  contain: 'contain',
  fill: 'stretch',
  none: 'center',
  scaleDown: 'contain',
};

const AppImage = memo(function AppImage({
  contentFit = 'cover',
  transition = 200,
  source,
  recyclingKey,
  ...props
}) {
  const resolved = toImageSource(source);
  const uri = resolved?.uri;
  const isDataUri = typeof uri === 'string' && uri.startsWith('data:');

  // expo-image/Glide often drops data URIs on Android, especially Odoo JPEGs
  // labeled as PNG. RN Image decodes those reliably.
  if (Platform.OS === 'android' && isDataUri) {
    return (
      <RNImage
        {...props}
        source={resolved}
        resizeMode={FIT_TO_RESIZE[contentFit] || 'cover'}
      />
    );
  }

  return (
    <ExpoImage
      contentFit={contentFit}
      transition={transition}
      source={resolved}
      recyclingKey={recyclingKey || uri}
      {...props}
    />
  );
});

AppImage.prefetch = ExpoImage.prefetch;
AppImage.clearMemoryCache = ExpoImage.clearMemoryCache;
AppImage.clearDiskCache = ExpoImage.clearDiskCache;

export default AppImage;
