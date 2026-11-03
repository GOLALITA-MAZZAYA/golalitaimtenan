import {
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import { useTheme } from "../../../components/ThemeProvider";
import { colors } from "../../../components/colors";
import { ScrollView } from "react-native-gesture-handler";
import LocationSvg from "../../../assets/location.svg";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState } from "react";
import { checkCardmolaPaymentById, createGiftCardOrder } from "../../../api/giftCard";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { useTranslation } from "react-i18next";
import Amount from "./Amount";
import Total from "./Total";
import { getCommission } from "./helpers";
import GiftInfoCard from "./GiftInfoCard";
import { setPaymentDataGlobal } from "../../../redux/giftCards/giftcards-actions";
import { org } from "../../../org/config";
import CommonButton from "../../../components/CommonButton/CommonButton";
import Header from "../../../components/Header";
import LoyaltyGiftCardSwiper from "./LoyaltyGiftCardSwiper";
import DescriptionSvg from '../../../assets/loyaltyPoints/description.svg';
import InfoWithTitleBlock from "../../../components/InfoWithTitleBlock";
import { useFocusEffect } from "@react-navigation/native";
import store from "../../../redux/store";
import { showMessage } from "react-native-flash-message";


const { width } = Dimensions.get("screen");

const cardWidth = width - 32;

const LoyaltyGiftCardInfo = (props) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { giftCard, filtersData } = props.route.params;
  const user = useSelector((state) => state.authReducer.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(0);

  const [amount_org, setAmount_org] = useState(0);


  const handlePaymentPress = async () => {
    setLoading(true);

    let tAmount = amount + getCommission(amount);

    const data = {
      reference_id: new Date().getTime(),
      brand_code: giftCard.brand_code,
      currency: "QAR",
      amount: tAmount.toFixed(2),
      country: filtersData.country_code,
      receiver_name: user.name,
      receiver_email: user.email,
      receiver_phone: user.phone,
      customer_id: user.partner_id,
      return_url: `${org.urlScheme}giftcards?id=`,
      currency_org: giftCard.brand_accepted_currency,
      amount_org: amount_org,
    };

    try {
      const res = await createGiftCardOrder(data);

      const paymentLink = res.payment_web_link;

      dispatch(setPaymentDataGlobal(res));

      props.navigation.navigate("Website", {
        url: paymentLink,
        title: "Order details",
      });
    } catch (err) {
      showMessage({
        message: t('General.error'),
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemPress = () => {


    props.navigation.navigate('loyaltyPoints-giftCard-redeem', {
      title: giftCard.name,
      subTitle: '',
      id: giftCard.id,
      price: giftCard.x_minimum_point,
      code: giftCard.brandCode
    })
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


  useFocusEffect(
    useCallback(() => {
      console.log('us callback')
      const { paymentDataGlobal } = store.getState().giftcardsReducer;
      console.log(paymentDataGlobal, 'paymentDataGlobal')

      async function checkPaymentStatus() {
        if (paymentDataGlobal) {
          try {
            const data = await checkCardmolaPaymentById(
              paymentDataGlobal.reference_id,
            );


            if (data.payment_status === 'Paid') {
              showMessage({
                message: t('Vouchers.giftCardPaymentSuccess'),
                type: 'success',
              });
            } else {
              showMessage({
                message: t('Vouchers.giftCardPaymentFailure'),
                type: 'danger',
              });
            }

            dispatch(setPaymentDataGlobal(null));
          } catch (err) {
            showMessage({
              message: t('Vouchers.giftCardPaymentFailure'),
              type: 'danger',
            });
            console.log(err.message, 'dsadaerr');
          }
        }
      }

      checkPaymentStatus();
    }, []),
  );

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
        <Header
          label={giftCard.name}
          btns={['back']}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainerStyle}
        >

          <LoyaltyGiftCardSwiper url={giftCard.product_image} onImagePress={() => showImage(true)} />

          <GiftInfoCard giftCard={giftCard} name={giftCard.name} validity={giftCard.validity_in_months} />

          <Amount
            onSlidingComplete={onSlidingComplete}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            giftCardId={giftCard.id}
          />

          {giftCard.locations_url && <InfoWithTitleBlock
            style={styles.termsBlock}
            title={t("Vouchers.location")}
            description={giftCard.locations_url}
            icon={<LocationSvg color={colors.loyaltyPrimary} />}
          />}

          <InfoWithTitleBlock
            style={styles.termsBlock}
            title={t("Vouchers.terms")}
            description={giftCard?.redemption_instructions}
            html
            icon={<DescriptionSvg color={colors.loyaltyPrimary} />}
          />


          <Total
                style={styles.total}
                price={amount}
                discount={0}
                commission={getCommission(amount)}
                total={amount + getCommission(amount)}
              />

              <CommonButton
                onPress={handlePaymentPress}
                label={t("Vouchers.createOrderBtn")}
                style={styles.paymentBtn}
              />


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
  card: {
    marginTop: 16,
  },

  paymentBtn: {
    marginTop: 16,
  },
  description: {
    marginTop: 24,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  contentContainerStyle: {
    paddingBottom: 30,
  },
  validityTime: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  total: {
    marginTop: 16,
  },
  rewardsPoints: {
    marginTop: 16,
  },
  infoBtns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    borderRadius: 8,
  },
  image: {
    width: cardWidth,
    height: cardWidth - 130,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.lightGrey,
    alignSelf: "center",
  },
  name: {
    marginTop: 10,
    alignSelf: "center",
  },
  termsBlock: {
    marginTop: 20
  }
});

export default LoyaltyGiftCardInfo;
