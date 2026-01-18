import React, { useEffect } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';
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
import { useDispatch } from 'react-redux';
import { setIsSplashScreenVisible } from '../../redux/auth/auth-actions';

const PhoneIcon = sized(PhoneSvg, 120, 160);

export const STORES_CONFIG = [
  {
    name: 'Gulf Exchange',
    android:
      'https://play.google.com/store/apps/details?id=com.golalitagulfexchange',
    ios: 'https://apps.apple.com/qa/app/golalita-gulf-exchange/id6449490331?platform=ipad',
  },
  {
    name: 'Qatar Insurance Brokers',
    android: 'https://play.google.com/store/apps/details?id=com.golalitaqib',
    ios: 'https://apps.apple.com/qa/app/golalita-qinsurance/id6449935206',
  },
];

const RedirectToStoresModal = ({ organization }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const url = STORES_CONFIG.find(item => item.name === organization)[
    Platform.OS
  ];

  useEffect(() => {
    setTimeout(() => {
      dispatch(setIsSplashScreenVisible(false));
    }, 3000);
  }, []);

  return (
    <View style={[mainStyles.overlay, styles.flexCenter]}>
      <View style={styles.contentWrapper}>
        <View style={mainStyles.centeredRow}>
          <PhoneIcon />
        </View>
        <TypographyText
          textColor={colors.black}
          size={26}
          font={BALOO_SEMIBOLD}
          title={t('MainScreen.redirectModalTitle')}
          style={[mainStyles.centeredText, styles.topSpace]}
        />
        <TypographyText
          textColor={colors.black}
          size={20}
          font={BALOO_REGULAR}
          title={t('MainScreen.redirectModalDescription')}
          style={[mainStyles.centeredText, styles.topSpace]}
        />

        <CommonButton
          onPress={() => {
            Linking.openURL(url);
          }}
          label={t('MainScreen.downloadApp')}
          style={styles.topSpace}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentWrapper: {
    padding: 20,
    justifyContent: 'space-between',
    minHeight: SCREEN_HEIGHT / 1.9,
    width: (SCREEN_WIDTH / 100) * 90,
    backgroundColor: colors.white,
    borderRadius: 8,
    position: 'relative',
    zIndex: 1000,
  },
  flexCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topSpace: {
    marginTop: 30,
  },
});

export default RedirectToStoresModal;
