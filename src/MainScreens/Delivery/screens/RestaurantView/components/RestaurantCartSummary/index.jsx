import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  DeliveryIcon,
  ForwardArrowIcon,
} from "../../../../../../assets/delivery_assets";
import { SizedBox } from "../../../_shared/componenets/SizedBox";
import { useSelector } from "react-redux";
import { colors } from "../../../../../../components/colors";
import { BALOO_BOLD } from "../../../../../../redux/types";

const RestaurantCartSummary = ({ isDark, t }) => {
  const navigation = useNavigation();
  const { totalPrice, totalQuantity } = useSelector(
    (state) => state.cartReducer
  );

  return (
    <TouchableOpacity
      style={[
        styles.wrapper,
        { backgroundColor: isDark ? "#0B177E" : colors.darkBlue },
      ]}
      onPress={() => navigation.navigate("cartSummary")}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <DeliveryIcon color={colors.white} height={15} width={15} />
          <SizedBox size={8} />
          <Text style={{ color: "white", fontSize: 14 }}>
            {t("RestaurantView.deliveryCartTitle")}
          </Text>
        </View>

        <ForwardArrowIcon color={colors.white} />
      </View>
      <SizedBox size={20} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 24,
              height: 24,
              backgroundColor: "white",
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#08003B",
                alignSelf: "center",
                textAlign: "center",
              }}
            >
              {totalQuantity}
            </Text>
          </View>
          <SizedBox size={8} />
          <Text style={styles.text}>{t("RestaurantView.items")}</Text>
        </View>
        <Text style={styles.text}>{`${totalPrice} QR`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 180,
    padding: 16,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontFamily: BALOO_BOLD,
  },
});

export default RestaurantCartSummary;
