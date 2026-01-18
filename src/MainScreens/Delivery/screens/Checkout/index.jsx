import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  getDeliveryInformationColor,
  getDeliveryInformationTextColor,
} from "../../../../styles/colors";
import { DeliveryTimeIcon } from "../../../../assets/delivery_assets";
import BottomSheet from "../BottommSheet/BottomSheet";
import { SizedBox } from "../_shared/componenets/SizedBox";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../../../components/ThemeProvider";
import DeliveryTabs from "./DeliveryTabs";
import { colors } from "../../../../components/colors";
import CheckoutHeader from "./CheckoutHeader";
import ChangeLocation from "./ChangeLocation";
import DeliveryLocation from "../RestaurantList/components/DeliveryLocation";
import { setDeliveryLocation } from "../../../../redux/delivery/delivery-actions";
import { createOrder, initiatePaymentSkipCash } from "../../../../api/delivery";
import { userSelector } from "../../../../redux/auth/auth-selectors";
import { showMessage } from "react-native-flash-message";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { useTranslation } from "react-i18next";
import { BALOO_REGULAR } from "../../../../redux/types";
import Summary from "./Summary";
import {
  clearProductCart,
  setActiveTab,
} from "../../../../redux/cart/cart-actions";
import { CONSTANTS } from "../RestaurantList/components/DeliveryTabs/config";

const Checkout = ({ navigation }) => {
  const locationRef = useRef(null);
  const { deliveryLocation, selectedMerchant } = useSelector(
    (state) => state.restaurantReducer
  );

  const dispatch = useDispatch();
  const {
    cartProducts,
    voucher,
    totalPrice,
    totalDiscount,
    subtotal,
    activeTab,
  } = useSelector((state) => state.cartReducer);
  const userData = useSelector(userSelector);
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showLocationWarning, setShowLocationWarning] = useState(false);
  const isDelivery = activeTab === CONSTANTS.DELIVERY;

  const { t } = useTranslation();

  const handleTabChange = (activeTab) => {
    dispatch(setActiveTab(activeTab));
  };

  const navigateToPrivacyPolicy = () => {
    navigation.navigate("PrivacyPolicy");
  };

  const handleApplyLocation = (location) => {
    if (showLocationWarning) {
      setShowLocationWarning(false);
    }
    dispatch(setDeliveryLocation(location));
    locationRef?.current?.scrollTo(0);
  };

  const handleCloseSheet = () => {
    locationRef?.current?.scrollTo(0);
  };

  const handleChangeLocation = () => {
    locationRef?.current?.scrollTo(-400);
  };

  const handleCreateOrder = async () => {
    if (isDelivery && !deliveryLocation?.id) {
      setShowLocationWarning(true);
    }
    locationRef?.current?.scrollTo(0);

    const body = {
      delivery_type: activeTab,
      merchant_id: selectedMerchant.merchant_id,
      customer_id: userData.partner_id,
      customer_phone: userData.phone,
      customer_address_id: isDelivery ? deliveryLocation.id : undefined,
      total_amount: 11,
      promo_discount: voucher.discount,
      voucher_applied: voucher?.value ? "True" : "False",
      voucher_value: voucher?.value,
      order_line: JSON.stringify(
        Object.values(cartProducts).map(
          ({ product_id, quantity, price, product }) => {
            const discountQr = product.discount
              ? quantity * product.discount
              : 0;

            return {
              product_id,
              quantity,
              price,
              product_name: product.name,
              discount: discountQr,
            };
          }
        )
      ),
    };

    try {
      setLoading(true);

      const order_res = await createOrder(body);

      const initiation_res = await initiatePaymentSkipCash(order_res.id);

      if (order_res.error || initiation_res.error) {
        throw new Error("err");
      }

      dispatch(clearProductCart());

      navigation.navigate("Website", {
        title: t("Checkout.paymentTitle"),
        url: initiation_res.payUrl,
      });
    } catch (err) {
      console.log(err.message, "err");
      let msg =
        "Sorry, something went wrong. Please try to create order a bit later.";

      if (err.message) {
        msg = err.message;
      }

      showMessage({
        message: msg,
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: isDark ? colors.darkBlue : colors, flex: 1 }}
    >
      <CheckoutHeader title={selectedMerchant.merchant_name} isDark={isDark} />
      <ScrollView style={{ marginVertical: 16 }}>
        <View style={styles.tabsWrapper}>
          <Text
            style={{
              color: isDark ? colors.white : colors.darkBlue,
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            {t("Checkout.title")}
          </Text>
          <DeliveryTabs
            value={activeTab}
            onChange={handleTabChange}
            isDark={isDark}
            acceptDelivery={selectedMerchant.accept_delivery}
          />
        </View>
        <SizedBox size={16} />
        {isDelivery && (
          <ChangeLocation
            address={deliveryLocation?.formatted_address}
            onPress={handleChangeLocation}
            isDark={isDark}
          />
        )}

        {showLocationWarning && isDelivery && (
          <Text style={styles.warningText}>
            {t("Checkout.locationWarning")}
          </Text>
        )}
        <SizedBox size={24} />
        {isDelivery && (
          <>
            <View
              style={{
                borderColor: colors.grey,
                borderWidth: 1,
                borderRadius: 16,
                flexDirection: "row",
                padding: 16,
                marginHorizontal: 16,
              }}
            >
              <DeliveryTimeIcon color={colors.grey} />
              <SizedBox size={20} />
              <Text
                style={{ color: colors.grey, fontSize: 18, fontWeight: "400" }}
              >
                {t("Checkout.expectedDeliveryTime")}
              </Text>
              <View style={{ flex: 1 }} />
              <Text
                style={{ color: colors.grey, fontSize: 18, fontWeight: "600" }}
              >
                {selectedMerchant.time_for_order_prepration}
              </Text>
            </View>

            <SizedBox size={24} />
          </>
        )}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginHorizontal: 16,
          }}
        >
          <Text
            style={{
              color: colors.grey,
              fontSize: 14,
              fontFamily: BALOO_REGULAR,
            }}
          >
            {t("Checkout.termsDescription")}
          </Text>
          <TouchableOpacity onPress={navigateToPrivacyPolicy}>
            <Text
              style={{
                color: isDark ? colors.white : "#0B177E",
                fontSize: 14,
                fontFamily: BALOO_REGULAR,
                marginLeft: 4,
              }}
            >
              {t("Checkout.termsTitle")}
            </Text>
          </TouchableOpacity>
        </View>

        <Summary
          deliveryCost={
            activeTab === CONSTANTS.DELIVERY && selectedMerchant.delivery_cost
          }
          subtotal={subtotal}
          price={
            activeTab === CONSTANTS.DELIVERY
              ? totalPrice + (selectedMerchant.delivery_cost || 0)
              : totalPrice
          }
          discount={totalDiscount}
          voucherDiscount={voucher?.discount}
          onCreateOrder={handleCreateOrder}
        />
      </ScrollView>

      <BottomSheet ref={locationRef}>
        <DeliveryLocation
          onCloseSheet={handleCloseSheet}
          onApplyLocation={handleApplyLocation}
          userLocation={deliveryLocation}
          isDark={isDark}
          navigatedFrom={["Checkout"]}
        />
      </BottomSheet>

      {loading && <FullScreenLoader absolutePosition />}
    </SafeAreaView>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  row: {
    marginHorizontal: 16,
    flexDirection: "row",
  },
  container: {
    flexDirection: "row",
    borderRadius: 16,
    borderColor: getDeliveryInformationColor(),
    marginHorizontal: 8,
    borderWidth: 1,
    padding: 8,
    alignItems: "center",
  },
  unActiveHalfContainer: {
    flexDirection: "row",
    borderColor: getDeliveryInformationColor(),
    borderWidth: 1,
    padding: 8,
    alignItems: "center",
    borderBottomEndRadius: 16,
    borderTopEndRadius: 16,
  },
  activeHalfContainer: {
    flexDirection: "row",
    borderTopStartRadius: 16,
    borderBottomStartRadius: 16,

    color: getDeliveryInformationColor(),
    backgroundColor: getDeliveryInformationColor(),
    borderWidth: 1,
    padding: 8,
    alignItems: "center",
  },
  title: {
    fontWeight: "600",
    fontSize: 14,
    color: getDeliveryInformationTextColor(),
  },
  activeTitle: {
    fontWeight: "600",
    fontSize: 14,
    color: "white",
  },
  tabsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
  },
  warningText: {
    color: "red",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: BALOO_REGULAR,
    paddingHorizontal: 20,
    marginTop: 10,
  },
});
