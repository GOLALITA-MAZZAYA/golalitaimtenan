import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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
import {BALOO_2} from '../../../redux/types';
import Clipboard from '@react-native-clipboard/clipboard';
import { showMessage } from 'react-native-flash-message';

const MerchantCodeConfirmation = ({ navigation }) => {
  const route = useRoute();
  const { t } = useTranslation();
  const params = route.params;

  const merchantName = params?.merchantName;
  const confirmationNumber = params?.confirmationNumber;

  const { isDark } = useTheme();

  const textColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const bgColor = isDark ? colors.darkBlue : colors.white;

  const handleSubmit = () => {
      navigation.navigate("Main");
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
          title={params.offerName}
          textColor={textColor}
          size={16}
          style={styles.offerName}
        />

        <TypographyText
          title={t('PremiumPartner.promocodeInstruction1')}
          textColor={textColor}
          size={16}
          style={styles.instruction}
        />

        {!!confirmationNumber && (
          <View style={[styles.qrContainer, { backgroundColor: bgColor }]}>
            <QRCode
              value={String(confirmationNumber)}
              size={180}
            />
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
                message: t('General.copied') || 'Copied to clipboard',
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
          title={t('PremiumPartner.promocodeInstruction2')}
          textColor={textColor}
          size={14}
          style={styles.secondaryText}
          font={BALOO_2}
        />

        <TypographyText
          title={t('PremiumPartner.promocodeInstruction3')}
          textColor={colors.gray}
          size={12}
          style={styles.tip}
          font={BALOO_2}
        />

        {params.store_website && <CommonButton
          onPress={() => Linking.openURL(params.store_website)}
          label={t('PremiumPartner.openOnlineStore')}
          style={styles.button}
          textColor={isDark ? colors.black : colors.white}
        />}
        

        <CommonButton
          onPress={handleSubmit}
          label={t('PremiumPartner.confirmRedemption')}
          style={styles.button}
          textColor={isDark ? colors.black : colors.white}
        />

      </ScrollView>
    </MainLayout>
      </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 40,
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

  secondaryText: {
    marginTop: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  tip: {
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 20
  },

  button: {
    marginTop: 10,
    width: '100%',
  },
  loader: {
    paddingBottom: 180
  },
  offerName: {
    marginTop: 5
  }
});

export default MerchantCodeConfirmation;
