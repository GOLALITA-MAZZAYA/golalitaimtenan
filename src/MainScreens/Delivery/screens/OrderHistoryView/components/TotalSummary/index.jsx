import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text } from "react-native";
import { BALOO_SEMIBOLD } from "../../../../../../redux/types";
import { colors } from "../../../../../../components/colors";
import { SizedBox } from "../../../_shared/componenets/SizedBox";

const TotalSummary = (props) => {
  const {
    totalDiscount,
    voucherDiscount,
    totalPrice,
    deliveryFee,
    subtotal,
    isDark,
  } = props;
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <View style={{ marginHorizontal: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: BALOO_SEMIBOLD,
            color: isDark ? colors.white : colors.grey,
          }}
        >
          {t("OrderHistoryView.totalSummaryTitle")}
        </Text>
        <SizedBox size={8} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: BALOO_SEMIBOLD,
              color: isDark ? colors.white : colors.darkBlue,
            }}
          >
            {t("OrderHistoryView.subtotal")}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: BALOO_SEMIBOLD,
              color: isDark ? colors.white : colors.darkBlue,
            }}
          >
            {`${subtotal} QR`}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: BALOO_SEMIBOLD,
              color: isDark ? colors.white : colors.darkBlue,
            }}
          >
            {t("OrderHistoryView.deliveryFee")}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: BALOO_SEMIBOLD,
              color: isDark ? colors.white : colors.darkBlue,
            }}
          >
            {`${deliveryFee} QR`}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: BALOO_SEMIBOLD,
              color: isDark ? colors.white : colors.darkBlue,
            }}
          >
            {t("OrderHistoryView.discount")}
          </Text>
          <Text
            style={{ fontSize: 14, fontFamily: BALOO_SEMIBOLD, color: "red" }}
          >
            {`- ${totalDiscount} QR`}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: BALOO_SEMIBOLD,
              color: isDark ? colors.white : colors.darkBlue,
            }}
          >
            {t("OrderHistoryView.voucherDiscount")}
          </Text>
          <Text
            style={{ fontSize: 14, fontFamily: BALOO_SEMIBOLD, color: "red" }}
          >
            {`- ${voucherDiscount || 0} QR`}
          </Text>
        </View>

        <SizedBox size={20} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#08003B" }}>
            {t("OrderHistoryView.totalAmount")}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#08003B" }}>
            {`${totalPrice} QR`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 30,
  },
});

export default TotalSummary;
