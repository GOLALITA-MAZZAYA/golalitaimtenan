import React from 'react';
import { Linking, View } from 'react-native';
import {
  mainStyles,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../styles/mainStyles';
import PhoneSvg from '../../assets/app_update.svg';
import { sized } from '../../Svg';
import { colors } from '../colors';
import { BALOO_REGULAR, BALOO_SEMIBOLD } from '../../redux/types';
import { TypographyText } from '../Typography';
import { useTranslation } from 'react-i18next';
import CommonButton from '../CommonButton/CommonButton';
import useAppUpdateCheck from '../../hooks/useAppUpdateCheck';
import { getStorePlatformKey } from '../../utils/storePlatform';
import { ANDROID_PACKAGE_NAME } from '../../constants';

const PhoneIcon = sized(PhoneSvg, 120, 160);

const STORE_URLS = {
  ios: 'https://apps.apple.com/us/app/etizaz-اعزاز/id6758722117',
  android: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`,
  huawei: `appmarket://details?id=${ANDROID_PACKAGE_NAME}`,
};

const HUAWEI_WEB_FALLBACK = `https://appgallery.huawei.com/search/${encodeURIComponent(
  'Etizaz',
)}`;

const UpdateModal = () => {
  const { t } = useTranslation();
  const { updateModal, setUpdateModal, latestVersion, storePlatform } =
    useAppUpdateCheck();

  if (!updateModal) {
    return null;
  }


  const handleLinkPress = async () => {
    const platform = storePlatform || getStorePlatformKey();
    const url = STORE_URLS[platform] || STORE_URLS.android;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        return;
      }
    } catch (e) {
      // Fall through to web fallbacks below.
    }

    if (platform === 'huawei') {
      await Linking.openURL(HUAWEI_WEB_FALLBACK);
      return;
    }

    await Linking.openURL(STORE_URLS.android);
  };

  return (
    <View
      style={[
        mainStyles.overlay,
        { alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <View
        style={[
          {
            padding: 20,
            justifyContent: 'space-between',
            minHeight: SCREEN_HEIGHT / 1.9,
            width: (SCREEN_WIDTH / 100) * 90,
            backgroundColor: colors.white,
            borderRadius: 8,
            position: 'relative',
            zIndex: 1000,
          },
        ]}
      >
        <View style={mainStyles.centeredRow}>
          <PhoneIcon />
        </View>
        <TypographyText
          textColor={colors.black}
          size={26}
          font={BALOO_SEMIBOLD}
          title={
            updateModal === 'easy'
              ? t('Profile.updateApp')
              : t('Profile.outdatedApp')
          }
          style={[mainStyles.centeredText, { marginTop: 30 }]}
        />
        <TypographyText
          textColor={colors.black}
          size={20}
          font={BALOO_REGULAR}
          title={t('Profile.updateAppDescription')}
          style={[mainStyles.centeredText, { marginTop: 30 }]}
        />
        {!!latestVersion && (
          <TypographyText
            textColor={colors.black}
            size={20}
            font={BALOO_REGULAR}
            title={`v${latestVersion}`}
            style={mainStyles.centeredText}
          />
        )}
        {updateModal === 'hard' ? (
          <CommonButton
            onPress={handleLinkPress}
            label={'Update'}
            style={{ marginTop: 30 }}
          />
        ) : (
          <View style={[mainStyles.betweenRow, { marginTop: 30 }]}>
            <CommonButton
              style={{ backgroundColor: colors.grey, width: '47%' }}
              label={t('Drawer.cancel')}
              onPress={() => setUpdateModal(null)}
            />
            <CommonButton
              onPress={handleLinkPress}
              label={'Update'}
              style={{ width: '47%' }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default UpdateModal;
