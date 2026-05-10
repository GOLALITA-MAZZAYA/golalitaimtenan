import {
  SafeAreaView,
  StyleSheet,
  View,
  Linking,
  Image,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../../components/ThemeProvider';
import { colors } from '../../../components/colors';
import CommonHeader from '../../../components/CommonHeader/CommonHeader';
import { TypographyText } from '../../../components/Typography';
import { BALOO_REGULAR, BALOO_SEMIBOLD } from '../../../redux/types';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LocationSvg from '../../../assets/location.svg';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { createGiftCardOrder } from '../../../api/giftCard';
import FullScreenLoader from '../../../components/Loaders/FullScreenLoader';
import { useTranslation } from 'react-i18next';
import Amount from '../components/Amount';
import Total from '../components/Total';
import RewardsPoints from '../components/RewardsPoints';
import { getCommission } from '../helpers';
import ImageViwerModal from '../../../components/ImageViwer';
import InfoBlock from '../../../components/InfoBlock';
import HTMLRenderer from '../../../components/HTMLRenderer';
import GiftInfoCard from '../components/GiftInfoCard';
import { setPaymentDataGlobal } from '../../../redux/giftCards/giftcards-actions';

const { width } = Dimensions.get('screen');

const cardWidth = width - 32;

const GiftCard = (props) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { giftCard, filtersData } = props.route.params;
  const user = useSelector((state) => state.authReducer.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(0);
  const [amount_org, setAmount_org] = useState(0);

  const handleLocationPress = () => {
    Linking.openURL(giftCard.locations_url);
  };

  const handlePaymentPress = async () => {
    setLoading(true);

    let tAmount = amount + getCommission(amount);

    const data = {
      reference_id: new Date().getTime(),
      brand_code: giftCard.brand_code,
      currency: 'QAR',
      amount: tAmount.toFixed(2),
      country: filtersData.country_code,
      receiver_name: user.name,
      receiver_email: user.email,
      receiver_phone: user.phone,
      customer_id: user.partner_id,
      return_url: 'https://qcbpaystatus.com/',
      currency_org: giftCard.brand_accepted_currency,
      amount_org: amount_org,
    };

    try {
      const res = await createGiftCardOrder(data);

      const paymentLink = res.payment_web_link;

      dispatch(setPaymentDataGlobal(res));

      props.navigation.navigate('Website', {
        url: paymentLink,
        title: 'Order details',
      });
    } catch (err) {
      alert('Sorry, something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onSlidingComplete = (value) => {
    setAmount_org(value);
    setAmount(value * giftCard.x_rate);
  };
  const onIncrement = (value) => {
    setAmount_org(value);
    setAmount(value * giftCard.x_rate);
  };
  const onDecrement = (value) => {
    setAmount_org(value);
    setAmount(value * giftCard.x_rate);
  };

  return (
    <View
      style={[
        {
          backgroundColor: isDark ? colors.darkBlue : colors.white,
        },
        styles.safeAreaWrapper,
      ]}
    >
      <SafeAreaView style={styles.safeAreaWrapper}>
        <CommonHeader
          isWhite={isDark}
          label={giftCard.name}
          style={{ backgroundColor: isDark ? colors.darkBlue : undefined }}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <ImageViwerModal images={[{ url: giftCard.product_image }]}>
            {(showImage) => (
              <TouchableOpacity
                onPress={() => showImage(true)}
                style={styles.imageWrapper}
              >
                <Image
                  source={{ uri: giftCard.product_image }}
                  style={styles.image}
                  resizeMode="stretch"
                />
              </TouchableOpacity>
            )}
          </ImageViwerModal>

          <GiftInfoCard giftCard={giftCard} />

          <Amount
            onSlidingComplete={onSlidingComplete}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            giftCardId={giftCard.id}
          />

          {giftCard.locations_url && giftCard.locations_url !== 'None' && (
            <InfoBlock title={t('Vouchers.location')}>
              <TouchableOpacity
                style={styles.locationBtn}
                onPress={handleLocationPress}
              >
                <LocationSvg color={colors.darkBlue} height={18} width={18} />
                <TypographyText
                  title={giftCard.locations_url}
                  textColor={isDark ? colors.white : colors.darkBlue}
                  size={15}
                  font={BALOO_REGULAR}
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            </InfoBlock>
          )}

          {!!giftCard?.redemption_instructions && (
            <InfoBlock title={t('Vouchers.terms')}>
              <HTMLRenderer value={giftCard?.redemption_instructions} />
            </InfoBlock>
          )}

          {/* <RewardsPoints
            style={styles.rewardsPoints}
            points={user.available_points}
          /> */}

          <Total
            style={styles.total}
            price={amount}
            discount={0}
            commission={getCommission(amount)}
            total={amount + getCommission(amount)}
          />

          <TouchableOpacity
            onPress={handlePaymentPress}
            style={[
              styles.paymentBtn,
              {
                backgroundColor: isDark ? colors.mainDarkMode : colors.darkBlue,
              },
            ]}
          >
            <TypographyText
              textColor={isDark ? colors.mainDarkModeText : colors.white}
              size={15}
              font={BALOO_SEMIBOLD}
              title={t('Vouchers.createOrderBtn')}
              numberOfLines={2}
            />
          </TouchableOpacity>
        </ScrollView>
        {loading && <FullScreenLoader absolutePosition />}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaWrapper: {
    flex: 1,
  },
  paymentBtn: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  contentContainerStyle: {
    paddingBottom: 30,
  },
  validityTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  total: {
    marginTop: 16,
  },
  rewardsPoints: {
    marginTop: 16,
  },
  locationBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    borderRadius: 8,
  },
  image: {
    width: cardWidth,
    height: cardWidth - 130,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.lightGrey,
    alignSelf: 'center',
  },
});

export default GiftCard;
