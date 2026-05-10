import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../../components/ThemeProvider';
import { colors } from '../../../components/colors';
import CommonHeader from '../../../components/CommonHeader/CommonHeader';
import { TypographyText } from '../../../components/Typography';
import { BALOO_SEMIBOLD } from '../../../redux/types';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import {
  checkCardmolaPaymentById,
  requestGiftCardPayment,
} from '../../../api/giftCard';
import FullScreenLoader from '../../../components/Loaders/FullScreenLoader';
import { useTranslation } from 'react-i18next';
import Total from '../components/Total';
import RewardsPoints from '../components/RewardsPoints';
import { getCommission } from '../helpers';
import ImageViwerModal from '../../../components/ImageViwer';
import InfoBlock from '../../../components/InfoBlock';
import HTMLRenderer from '../../../components/HTMLRenderer';
import { getCardmolaGiftCardById } from '../../../redux/giftCards/giftcards-thunks';
import { getDescription } from './helpers';
import CardmolaGiftCardAmount from './CardmolaGiftCardAmount';
import {
  setPaymentDataGlobal,
  setSelecteedCardmolaGiftCardLoading,
} from '../../../redux/giftCards/giftcards-actions';
import { useFocusEffect } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

const { width } = Dimensions.get('screen');

const cardWidth = width - 32;

const CardmolaGiftCard = (props) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { id, encodedId } = props.route.params;
  const user = useSelector((state) => state.authReducer.user);
  const [paymentData, setPaymentData] = useState(null);
  const giftCard = useSelector(
    (state) => state.giftcardsReducer.selectedCardmolaGiftCard,
  );
  const loading = useSelector(
    (state) => state.giftcardsReducer.selectedCardmolaGiftCardLoading,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCardmolaGiftCardById(encodedId));
  }, []);

  const [amount, setAmount] = useState(0);
  const [amount_org, setAmount_org] = useState(0);

  useFocusEffect(
    useCallback(() => {
      async function checkPaymentStatus() {
        if (paymentData) {
          try {
            const data = await checkCardmolaPaymentById(
              paymentData.reference_id,
            );

            if (data.payment_status === 'Paid') {
              showMessage({
                message: t('Vouchers.giftCardPaymentSuccess'),
                type: 'success',
              });
            }
          } catch (err) {
            console.log(err.message, 'dsadaerr');
          }
        }
      }

      checkPaymentStatus();
    }, []),
  );

  const handlePaymentPress = async () => {
    if (amount <= 5) {
      alert(t('Vouchers.limitMessage'));
      throw 'err';
    }

    dispatch(setSelecteedCardmolaGiftCardLoading(true));

    const data = {
      product_id: id,
      customer_id: user.partner_id,
      customer_name: user.name + ' ' + (user.x_moi_last_name ?? ' '),
      customer_phone: user.phone,
      customer_email: user.email,
      quantity: giftCard.denominationType === 'Variable' ? 1 : amount,
      amount: amount + getCommission(amount),
      bank_charge: getCommission(amount),
      cultureCode: giftCard?.cultureCodes[0],
      return_url: 'https://qcbpaystatus.com/',
      currency_org: giftCard.currencyCode,
      amount_org: amount_org,
    };

    try {
      const res = await requestGiftCardPayment(data);

      dispatch(setPaymentDataGlobal(res));

      const paymentLink = res.payment_web_link;

      setPaymentData(res);

      props.navigation.navigate('Website', {
        url: paymentLink,
        title: 'Order details',
      });
    } catch (err) {
      console.log(err.message, 'err');
    } finally {
      dispatch(setSelecteedCardmolaGiftCardLoading(false));
    }
  };

  const onSlidingComplete = async (value) => {
    let index = giftCard?.denominations.indexOf(value);

    giftCard?.denominationType == 'Variable'
      ? setAmount_org(value / giftCard?.rate)
      : setAmount_org(giftCard?.denominations_org[index]);

    let truncatedNum = Number(value.toFixed(2));

    setAmount(truncatedNum);
  };

  const terms = getDescription(giftCard?.translations);

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
          label={giftCard?.name}
          style={{ backgroundColor: isDark ? colors.darkBlue : undefined }}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <ImageViwerModal images={[{ url: giftCard?.media?.photo }]}>
            {(showImage) => (
              <TouchableOpacity
                onPress={() => showImage(true)}
                style={styles.imageWrapper}
              >
                <Image
                  source={{ uri: giftCard?.media?.photo }}
                  style={styles.image}
                  resizeMode="stretch"
                />
              </TouchableOpacity>
            )}
          </ImageViwerModal>

          <CardmolaGiftCardAmount
            onSlidingComplete={onSlidingComplete}
            denominationType={giftCard?.denominationType}
            denominations={giftCard?.denominations}
            currencyCode={giftCard?.currencyCode}
          />

          {!!terms && (
            <InfoBlock title={t('Vouchers.terms')}>
              <HTMLRenderer value={terms} />
            </InfoBlock>
          )}

          <RewardsPoints
            style={styles.rewardsPoints}
            points={user.available_points}
          />

          <Total
            style={styles.total}
            price={amount}
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
  total: {
    marginTop: 16,
  },
  rewardsPoints: {
    marginTop: 16,
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

export default CardmolaGiftCard;
