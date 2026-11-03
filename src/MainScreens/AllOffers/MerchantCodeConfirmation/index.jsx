import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Image from "../../../components/AppImage";
import MainLayout from '../../../components/MainLayout';
import Header from '../../../components/Header';
import { SCREEN_HEIGHT } from '../../../styles/mainStyles';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { TypographyText } from '../../../components/Typography';
import { useTheme } from '../../../components/ThemeProvider';
import { colors } from '../../../components/colors';
import CommonButton from '../../../components/CommonButton/CommonButton';
import QRCode from 'react-native-qrcode-svg';
import { useState } from 'react';
import { BALOO_2 } from '../../../redux/types';
import FullScreenLoader from '../../../components/Loaders/FullScreenLoader';
import Clipboard from '@react-native-clipboard/clipboard';
import { showMessage } from 'react-native-flash-message';
import trackActivity from '../../../api/activityTracker';

const MerchantCodeConfirmation = ({ navigation }) => {
  const route = useRoute();
  const { t } = useTranslation();
  const params = route.params;

  const merchantName = params?.merchantName;
  const confirmationNumber = params?.confirmationNumber;

  const isSupportQrPromo = params?.x_is_support_qr_promo !== false;
  const qrCodeImageLink = params?.qr_code_image_link;
  const promoCodeDescription = params?.promo_code_description;
  const storeWebsite = params?.store_website;
  const merchantId = params?.merchant_id;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isDark } = useTheme();

  const textColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const bgColor = isDark ? colors.darkBlue : colors.white;

  const handleSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      navigation.navigate("Main");
    }, 1000);
  };

  return (
    <>
      <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={t('AllOffers.confirmation')} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={{
          height: SCREEN_HEIGHT - 120,
          paddingHorizontal: 20,
        }}
      >
        <ScrollView contentContainerStyle={styles.wrapper} bounces={false} showsVerticalScrollIndicator={false}>

          <TypographyText
            title={t('PremiumPartner.redeemAt', { merchantName })}
            textColor={textColor}
            size={22}
            style={styles.title}
            font={BALOO_2}
          />

          <TypographyText
            title={promoCodeDescription || t('PremiumPartner.promocodeInstruction1')}
            textColor={textColor}
            size={16}
            style={styles.instruction}
          />

          {isSupportQrPromo && !!confirmationNumber && (
            <View style={[styles.qrContainer, { backgroundColor: bgColor }]}>
              {qrCodeImageLink ? (
                <Image
                  source={{ uri: qrCodeImageLink }}
                  style={{ width: 180, height: 180 }}
                  contentFit="contain"
                />
              ) : (
                <QRCode
                  value={String(confirmationNumber)}
                  size={180}
                />
              )}
            </View>
          )}

          <TypographyText
            title={t('PremiumPartner.manualCode')}
            textColor={colors.gray}
            size={12}
            style={styles.manualLabel}
            font={BALOO_2}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (confirmationNumber) {
                Clipboard.setString(String(confirmationNumber));
                showMessage({
                  type: 'success',
                  message: t('General.copied'),
                });
              }
            }}
            style={styles.codeWrapper}
          >
            <TypographyText
              title={confirmationNumber}
              textColor={textColor}
              size={20}
              font={BALOO_2}
            />
          </TouchableOpacity>

          <TypographyText
            title={t('PremiumPartner.tapToCopy')}
            textColor={colors.gray}
            size={11}
            style={styles.tapToCopy}
            font={BALOO_2}
          />

          {isSupportQrPromo && (
            <TypographyText
              title={t('PremiumPartner.promocodeInstruction2')}
              textColor={textColor}
              size={14}
              style={styles.secondaryText}
              font={BALOO_2}
            />
          )}

          {isSupportQrPromo && (
            <TypographyText
              title={t('PremiumPartner.promocodeInstruction3')}
              textColor={colors.gray}
              size={12}
              style={styles.tip}
              font={BALOO_2}
            />
          )}


          {!!storeWebsite && (
            <CommonButton
              onPress={() => {
                trackActivity('page_visit', {
                  merchant_id: merchantId,
                  page_name: 'merchant_website',
                  metadata: { link_type: 'website', link_value: storeWebsite, source: 'merchant_code_confirmation' },
                });
                Linking.openURL(storeWebsite);
              }}
              label={t('PremiumPartner.openOnlineStore')}
              style={styles.button}
              textColor={isDark ? colors.black : colors.white}
            />
          )}

          <CommonButton
            onPress={handleSubmit}
            label={t('PremiumPartner.confirmRedemption')}
            style={styles.button}
            textColor={isDark ? colors.black : colors.white}
            disabled={isSubmitting}
          />


        </ScrollView>
      </MainLayout>
      {isSubmitting && <FullScreenLoader absolutePosition style={styles.loader} />}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },

  title: {
    textAlign: 'center',
    fontWeight: '800',
    marginTop: 10,
  },

  instruction: {
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 10,
  },

  qrContainer: {
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
  },

  manualLabel: {
    marginTop: 20,
  },

  codeWrapper: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.gray,
  },

  tapToCopy: {
    marginTop: 6,
  },

  secondaryText: {
    marginTop: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  tip: {
    marginTop: 10,
    textAlign: 'center',
  },

  button: {
    marginTop: 30,
    width: '100%',
  },

  loader: {
    paddingBottom: 180
  }
});

export default MerchantCodeConfirmation;