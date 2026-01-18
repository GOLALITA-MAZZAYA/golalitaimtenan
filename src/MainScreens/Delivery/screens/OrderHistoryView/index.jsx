import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import CustomHeader from "../../../../components/CustomHeader";
import { useTheme } from "../../../../components/ThemeProvider";
import { colors } from "../../../../components/colors";
import { useTranslation } from "react-i18next";
import TotalSummary from "./components/TotalSummary";
import OrderSummary from "./components/OrderSummary";
import DeliveryAddress from "./components/DeliveryAddress";
import OrderStatus from "./components/OrderStatus";
import TopInfo from "./components/TopInfo";
import { useRoute } from "@react-navigation/native";
import { getDeliveryTypeDisplayValue } from "../OrderHistoryList/helpers";
import { useEffect, useState } from "react";
import { getMerchantById } from "../../../../api/merchants";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { getOrderDetailById } from "../../../../api/delivery";
import { ORDER_STATUSES_CONFIG } from "../OrderHistoryList/config";

const getTimeDisplayValue = (date) => {
  const time = date.split(" ")[1].split(":");

  return `${time[0]}:${time[1]}`;
};

const getDateDisplayValue = (date) => {
  return date.split(" ")[0].split("-").reverse().join("/");
};

const OrderHistoryView = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { params } = useRoute();
  const orderId = params.orderId;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    getOrderDetailById(orderId)
      .then(setOrder)
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderInfo = () => (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <TopInfo
        style={styles.topInfo}
        logoUrl={order.merchant_logo}
        name={order.merchant_name}
        deliveryType={getDeliveryTypeDisplayValue(order.delivery_type)}
        id={order.order_id}
        time={getTimeDisplayValue(order.order_create_date)}
        date={getDateDisplayValue(order.order_create_date)}
        phone={order.merchant_phone}
        isDark={isDark}
      />

      <OrderStatus
        deliveryTime={order.delivery_preparation_time}
        deliveryType={order.deliveryType}
        orderStatus={order.order_status}
      />

      <DeliveryAddress
        name={order.delivery_address?.short}
        description={order.delivery_address?.long}
        isDark={isDark}
      />

      <OrderSummary orderItems={order.products} isDark={isDark} />

      <TotalSummary
        totalDiscount={order.products.reduce((a, b) => a + b.discount, 0)}
        voucherDiscount={order.voucher_discount}
        deliveryFee={order.delivery_fee}
        totalPrice={order.total_amount}
        subtotal={order.products.reduce((a, b) => a + b.price_subtotal, 0)}
        isDark={isDark}
      />
    </ScrollView>
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: isDark ? colors.darkBlue : colors.white,
        flex: 1,
      }}
    >
      <CustomHeader
        title={t("OrderHistoryView.title")}
        onLeftBtnPress={handleBackPress}
        isDark={isDark}
      />

      {loading || !order ? <FullScreenLoader /> : renderInfo()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topInfo: {
    paddingHorizontal: 20,
  },
});

export default OrderHistoryView;
