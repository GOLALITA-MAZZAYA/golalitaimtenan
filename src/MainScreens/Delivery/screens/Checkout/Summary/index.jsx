import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import PriceItem from "./PriceItem";
import { useTranslation } from "react-i18next";
import { BALOO_SEMIBOLD } from "../../../../../redux/types";
import { colors } from "../../../../../components/colors";

const Summary = ({
  price,
  discount,
  onCreateOrder,
  isDark,
  subtotal,
  deliveryCost,
  voucherDiscount = 0,
}) => {
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: isDark ? "#0B177E" : colors.darkBlue },
      ]}
    >
      <View style={{ marginHorizontal: 16 }}>
        <Text
          style={{ fontSize: 16, fontFamily: BALOO_SEMIBOLD, color: "#FFFFFF" }}
        >
          {t("Checkout.totalSummary")}
        </Text>

        <PriceItem
          title={t("Checkout.subtotal")}
          value={subtotal}
          style={{ marginTop: 10 }}
        />

        {deliveryCost && (
          <PriceItem
            title={t("Checkout.deliveryCost")}
            value={deliveryCost}
            style={{ marginTop: 10 }}
          />
        )}

        <PriceItem
          minus
          title={t("Checkout.discount")}
          value={discount}
          style={{ marginTop: 10 }}
        />

        <PriceItem
          minus
          title={t("Checkout.voucherDiscount")}
          value={voucherDiscount}
          style={{ marginTop: 10 }}
        />

        <TouchableOpacity
          onPress={onCreateOrder}
          style={[
            styles.submitBtn,
            { backgroundColor: isDark ? colors.darkBlue : "#0B177E" },
          ]}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", color: "white" }}>
            {t("Checkout.placeOrder")}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "white" }}>
            {`${price} QR`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#08003B",
    paddingVertical: 16,
    marginTop: 20,
  },
  submitBtn: {
    backgroundColor: "#0B177E",
    flexDirection: "row",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
});

export default Summary;
