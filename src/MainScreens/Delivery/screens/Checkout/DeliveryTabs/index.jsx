import React from "react";
import { StyleSheet, View } from "react-native";
import Toggle from "react-native-toggle-element";
import {
  DeliveryIcon,
  TakeawayIcon,
} from "../../../../../assets/delivery_assets";
import { TypographyText } from "../../../../../components/Typography";
import { BALOO_SEMIBOLD } from "../../../../../redux/types";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../../components/colors";
import { CONSTANTS } from "../../RestaurantList/components/DeliveryTabs/config";

const DeliveryTabs = ({
  onChange,
  value = CONSTANTS.TAKEAWAY,
  isDark,
  acceptDelivery,
}) => {
  const { t } = useTranslation();
  const deliveryColor =
    value === CONSTANTS.DELIVERY
      ? colors.white
      : isDark
      ? colors.white
      : colors.grey;
  const takeawayColor =
    value === CONSTANTS.TAKEAWAY
      ? colors.white
      : isDark
      ? colors.white
      : colors.grey;

  const leftComponent = (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <DeliveryIcon color={deliveryColor} height={18} width={18} />
      <TypographyText
        title={t("Checkout.delivery")}
        textColor={deliveryColor}
        size={14}
        font={BALOO_SEMIBOLD}
        style={{ marginLeft: 6 }}
      />
    </View>
  );

  const rightComponent = (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TakeawayIcon color={takeawayColor} height={18} width={18} />
      <TypographyText
        title={t("Checkout.takeaway")}
        textColor={takeawayColor}
        size={14}
        font={BALOO_SEMIBOLD}
        style={{ marginLeft: 6 }}
      />
    </View>
  );

  return (
    <Toggle
      value={value === CONSTANTS.DELIVERY ? false : true}
      disabled={!acceptDelivery}
      onPress={(val) => onChange(val ? CONSTANTS.TAKEAWAY : CONSTANTS.DELIVERY)}
      trackBar={{
        ...styles.trackBar,
        inActiveBackgroundColor: isDark ? colors.darkBlue : colors.white,
        activeBackgroundColor: isDark ? colors.darkBlue : colors.white,
      }}
      thumbButton={{
        ...styles.thumbBtn,

        activeBackgroundColor: isDark ? "#0B177E" : colors.darkBlue,
        inActiveBackgroundColor: isDark ? "#0B177E" : colors.darkBlue,
      }}
      leftComponent={leftComponent}
      rightComponent={rightComponent}
    />
  );
};

const styles = StyleSheet.create({
  trackBar: {
    borderActiveColor: colors.darkBlue,
    borderInActiveColor: colors.darkBlue,
    borderWidth: 2,
    radius: 20,
    height: 40,
    width: 200,
  },
  thumbBtn: {
    height: 40,
    width: 100,
    padding: 5,
    radius: 20,
  },
});

export default DeliveryTabs;
