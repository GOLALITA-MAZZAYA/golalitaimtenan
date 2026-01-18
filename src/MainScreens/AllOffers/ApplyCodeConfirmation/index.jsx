import { Image, StyleSheet } from 'react-native';
import MainLayout from '../../../components/MainLayout';
import Header from '../../../components/Header';
import { SCREEN_HEIGHT } from '../../../styles/mainStyles';
import { useRoute } from '@react-navigation/native';
import { View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { userSelector } from '../../../redux/auth/auth-selectors';
import { getMerchantDetails } from '../../../api/merchants';
import { getOfferById, sendRedemptionEmail } from '../../../api/offers';
import FullScreenLoader from '../../../components/Loaders/FullScreenLoader';
import { HEADER_HEIGHT } from '../../../constants';
import { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';
import { TypographyText } from '../../../components/Typography';
import { useTheme } from '../../../components/ThemeProvider';
import { colors } from '../../../components/colors';
import CommonButton from '../../../components/CommonButton/CommonButton';
import { isRTL } from '../../../../utils';

const getDateString = date => {
  if (!date.getFullYear) return '';

  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

const ApplyCodeConfirmation = ({ navigation }) => {
  const route = useRoute();
  const { t } = useTranslation();
  const params = route.params;
  const user = useSelector(userSelector);
  const { isDark } = useTheme();
  const merchantDataRef = useRef(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);
      const merchant = await getMerchantDetails({
        merchant_id: params.merchant_id,
      });

      merchantDataRef.current = merchant;

      if (!merchant) {
        throw 'err';
      }

      const offer = await getOfferById(params.product_id);

      if (!offer) {
        throw 'err';
      }

      const currentDate = new Date();
      const date = getDateString(currentDate);
      const time = currentDate.toTimeString().slice(0, 8);

      setData({
        merchant_name: merchant.merchant_name,
        merchant_email: merchant.email,
        offer_type: 'B1G1',
        product_name: offer.name,
        date,
        time,
        location_name: merchant.address,
        product_id: offer.product_id,
        confirmation_number: Date.now().toString(),
        customer_id: user.partner_id,
      });
    } catch (err) {
      showMessage({
        message: t('General.error'),
        type: 'danger',
      });
      console.log(err, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPress = async () => {
    try {
      setLoading(true);

      const res = await sendRedemptionEmail(data);

      if (res?.status !== 'success') {
        throw 'err';
      }

      showMessage({
        type: 'success',
        message: t('General.success'),
      });

      setTimeout(() => {
        navigation.navigate('Main');
      }, 3000);
    } catch (err) {
      console.log(err, 'sendRedemptionEmail error');
      showMessage({
        message: t('General.error'),
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getAddress = merchant => {
    if (!merchant) {
      return '';
    }

    if (!isRTL()) {
      return merchant.address;
    }

    let address = '';

    if (merchant.x_street_ar) {
      address = address + merchant.x_street_ar + '\n';
    }

    if (merchant.x_city_ar) {
      address = address + merchant.x_city_ar + '\n';
    }

    if (merchant.x_country_ar) {
      address = address + merchant.x_country_ar + ' ';
    }

    return address;
  };

  const address = getAddress(merchantDataRef.current);

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={
        <Header label={t('AllOffers.confirmation')} btns={['back']} />
      }
      headerHeight={50}
      contentStyle={{ height: SCREEN_HEIGHT - 120, paddingHorizontal: 20 }}
    >
      {loading && (
        <FullScreenLoader absolutePosition style={{ top: -HEADER_HEIGHT }} />
      )}
      {!loading && (
        <View style={styles.wrapper}>
          <Image
            source={require('../../../assets/logo.png')}
            style={[
              styles.logo,
              { tintColor: isDark ? colors.mainDarkMode : colors.darkBlue },
            ]}
          />

          <TypographyText
            title={
              isRTL()
                ? merchantDataRef.current.merchant_name_arabic
                : merchantDataRef.current.merchant_name
            }
            textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
            size={22}
            style={styles.name}
          />
          <TypographyText
            title={address}
            textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
            size={16}
            style={styles.address}
          />

          <TypographyText
            title={t('AllOffers.codeSuccess')}
            textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
            size={20}
            style={styles.confirmationText}
          />

          <TypographyText
            title={t('AllOffers.codeConfirmation')}
            textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
            size={16}
            style={{ marginTop: 10 }}
          />

          <View style={styles.codeWrapper}>
            <TypographyText
              title={data.confirmation_number}
              textColor={'black'}
              size={18}
            />
          </View>

          <CommonButton
            onPress={handleSubmitPress}
            label={t('AllOffers.agree')}
            style={{ marginTop: 26 }}
            textColor={isDark ? colors.black : colors.white}
          />
        </View>
      )}
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 90,
  },
  name: {
    textAlign: 'center',
    fontWeight: '800',
    marginTop: 30,
  },
  address: {
    textAlign: 'center',
    marginTop: 20,
  },
  codeWrapper: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 20,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  confirmationText: {
    marginTop: 40,
  },
});

export default ApplyCodeConfirmation;
