import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text } from "react-native";
import {
  BALOO_BOLD,
  BALOO_REGULAR,
  BALOO_SEMIBOLD,
} from "../../../../../../redux/types";
import { colors } from "../../../../../../components/colors";

const OrderSummary = (props) => {
  const { orderItems, isDark } = props;
  const { t } = useTranslation();

  const textStyles = [
    styles.titleText,
    { color: isDark ? colors.white : colors.darkBlue },
  ];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{t("OrderHistoryView.summaryTitle")}</Text>

      {orderItems.map((item) => (
        <View style={styles.block}>
          <View style={styles.amount}>
            <Text style={textStyles}>{`${item.quantity} x`}</Text>
          </View>
          <View style={styles.description}>
            <Text style={textStyles}>{item.product_name}</Text>
          </View>
          <View style={styles.price}>
            <Text style={textStyles}>{`${item.price_subtotal} QR`}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 30,
  },
  title: {
    fontSize: 16,
    fontFamily: BALOO_SEMIBOLD,
    color: colors.grey,
  },
  block: {
    flexDirection: "row",
    marginTop: 16,
  },
  amount: {
    paddingRight: 35,
  },
  description: {
    flex: 1,
  },
  price: {
    paddingLeft: 35,
  },
  titleText: {
    fontSize: 14,
    fontFamily: BALOO_BOLD,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: BALOO_REGULAR,
    color: colors.grey,
  },
});

export default OrderSummary;
