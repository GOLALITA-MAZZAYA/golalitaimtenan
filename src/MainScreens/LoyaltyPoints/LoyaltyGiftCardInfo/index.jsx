import {
  SafeAreaView,
  StyleSheet,
  View,
  Linking,
  Image,
  Dimensions,
} from "react-native";
import { useTheme } from "../../../components/ThemeProvider";
import { colors } from "../../../components/colors";
import { TypographyText } from "../../../components/Typography";
import { BALOO_REGULAR } from "../../../redux/types";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import LocationSvg from "../../../assets/location.svg";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createGiftCardOrder } from "../../../api/giftCard";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { useTranslation } from "react-i18next";
import Amount from "./Amount";
import Total from "./Total";
import { getCommission } from "./helpers";
import ImageViwerModal from "../../../components/ImageViwer";
import InfoBlock from "../../../components/InfoBlock";
import HTMLRenderer from "../../../components/HTMLRenderer";
import GiftInfoCard from "./GiftInfoCard";
import { setPaymentDataGlobal } from "../../../redux/giftCards/giftcards-actions";
import CommonButton from "../../../components/CommonButton/CommonButton";
import Header from "../../../components/Header";
import RewardsPointsToggle from "../common/RewardPointsToggle";
import PointsTotal from "../common/PointsTotal";
import useUserLoyaltyPoints from "../../../hooks/useUserLoyaltyPoints";


const { width } = Dimensions.get("screen");

const cardWidth = width - 32;

const LoyaltyGiftCardInfo = (props) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { giftCard, filtersData } = props.route.params;
  const user = useSelector((state) => state.authReducer.user);
  const [loading, setLoading] = useState(false);
  const [isPointsActivated, toggleRewardsPoints] = useState(false);
  const { points} = useUserLoyaltyPoints();
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
      currency: "QAR",
      amount: tAmount.toFixed(2),
      country: filtersData.country_code,
      receiver_name: user.name,
      receiver_email: user.email,
      receiver_phone: user.phone,
      customer_id: user.partner_id,
      return_url: "golalita://giftcards?id=",
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
      //console.log(err.message, "err");
      alert("Sorry, something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemPress = () => {


     props.navigation.navigate('loyaltyPoints-giftCard-redeem',{
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

  console.log(giftCard,'gift')
  

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

          {giftCard.locations_url && giftCard.locations_url !== "None" && (
            <InfoBlock title={t("Vouchers.location")}>
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
            <InfoBlock title={t("Vouchers.terms")}>
              <HTMLRenderer value={giftCard?.redemption_instructions} />
            </InfoBlock>
          )}

          <RewardsPointsToggle
            style={styles.rewardsPoints}
            isChecked={isPointsActivated}
            onToggleSwitch={toggleRewardsPoints}
          />

          {!isPointsActivated &&  (
            <>
          
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

          </>
           )}

          {isPointsActivated && (
            <>
            <PointsTotal priceInPoints={giftCard.x_minimum_point} availablePoints={points}  style={styles.total} />

            <CommonButton
               onPress={handleRedeemPress}
               label={t("Vouchers.redeem")}
               style={styles.paymentBtn}
            />
           </>
          )}


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
});

export default LoyaltyGiftCardInfo;
