import { useTranslation } from "react-i18next";
import { View, StyleSheet, Text } from "react-native";
import { colors } from "../../../../../../components/colors";
import { DeliveryTimeIcon } from "../../../../../../assets/delivery_assets";
import { SizedBox } from "../../../_shared/componenets/SizedBox";
import { BALOO_SEMIBOLD } from "../../../../../../redux/types";
import { ORDER_STATUSES_CONFIG } from "../../../OrderHistoryList/config";

const OrderStatus = ({ deliveryTime, deliveryType, orderStatus }) => {
  const { t } = useTranslation();

  const orderStatusText = t(ORDER_STATUSES_CONFIG[orderStatus].translation);
  const orderStatusColor = ORDER_STATUSES_CONFIG[orderStatus].color;

  return (
    <View style={styles.wrapper}>
      <View style={styles.orderStatusWrapper}>
        <Text style={styles.orderStatusText}>{`${t(
          "OrderHistoryView.status"
        )}:  `}</Text>
        <Text style={[styles.orderStatusText, { color: orderStatusColor }]}>
          {orderStatusText}
        </Text>
      </View>
      {deliveryType === "delivery" && (
        <View
          style={{
            borderColor: "#8286B1",
            borderWidth: 1,
            borderRadius: 10,
            flexDirection: "row",
            paddingVertical: 7,
            paddingHorizontal: 12,
            marginTop: 5,
          }}
        >
          <DeliveryTimeIcon color={"#8286B1"} />
          <SizedBox size={20} />
          <Text style={{ color: "#8286B1", fontSize: 18, fontWeight: "400" }}>
            {t("OrderHistoryView.deliveryTime")}
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={{ color: "#8286B1", fontSize: 18, fontWeight: "600" }}>
            {deliveryTime}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 30,
  },
  orderStatusText: {
    fontSize: 16,
    fontFamily: BALOO_SEMIBOLD,
    color: colors.grey,
  },
  orderStatusWrapper: {
    flexDirection: "row",
  },
});

export default OrderStatus;
