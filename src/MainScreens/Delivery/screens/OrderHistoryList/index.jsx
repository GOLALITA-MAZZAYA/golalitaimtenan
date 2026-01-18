import { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import CustomHeader from "../../../../components/CustomHeader";
import { useTheme } from "../../../../components/ThemeProvider";
import { colors } from "../../../../components/colors";
import { useSelector } from "react-redux";
import { FlatList } from "react-native";
import OrderHistoryItem from "../_shared/componenets/OrderHistoryItem";
import {
  concatStrings,
  getDeliveryTypeDisplayValue,
  transformDateFormat,
} from "./helpers";
import { BALOO_MEDIUM, BALOO_SEMIBOLD } from "../../../../redux/types";
import { useTranslation } from "react-i18next";
import { ORDER_STATUSES_CONFIG } from "./config";
import OrderModal from "../_shared/componenets/OrderModal";

const OrderHistoryList = ({ navigation }) => {
  const { isDark } = useTheme();
  const { orderHistory } = useSelector((state) => state.orderHistoryReducer);
  const { t } = useTranslation();
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleItemPress = (orderId) => {
    navigation.navigate("orderHistoryView", { orderId });
  };

  const handleActionBtnPress = (item, btnType) => {
    if (btnType === "reorder") {
      navigation.navigate("cartSummary", {
        reorderData: {
          merchant_id: item.merchant_id,
          products: item.lines.map((item) => ({
            quantity: item.quantity,
            product_id: item.product_id,
          })),
        },
      });
    } else {
      setSelectedOrderStatus(item.order_status);
    }
  };

  const currentOrders =
    orderHistory.filter(
      (item) => ORDER_STATUSES_CONFIG[item.order_status].is_current_order
    ) || [];
  const otherOrders =
    orderHistory.filter(
      (item) => !ORDER_STATUSES_CONFIG[item.order_status].is_current_order
    ) || [];

  return (
    <SafeAreaView
      style={{ backgroundColor: isDark ? colors.darkBlue : colors.white }}
    >
      <CustomHeader
        title={t("OrderHistoryList.title")}
        onLeftBtnPress={handleBackPress}
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        data={otherOrders}
        ListHeaderComponent={() =>
          !!currentOrders.length && (
            <View
              style={[
                styles.listItemHeader,
                { backgroundColor: isDark ? colors.secBlue : colors.grey },
              ]}
            >
              <Text style={styles.dateText}>
                {t("OrderHistoryList.activeOrders")}
              </Text>

              {currentOrders.map((item) => (
                <OrderHistoryItem
                  isDark={isDark}
                  key={item.order_create_date}
                  style={styles.headerListItem}
                  logoUrl={item.merchant_logo}
                  name={item.merchant_name}
                  description={concatStrings(item.lines, "product_name")}
                  date={item.order_create_date.split(" ")[1]}
                  deliveryType={getDeliveryTypeDisplayValue(item.delivery_type)}
                  price={item.lines.reduce((a, b) => a + b.price_subtotal, 0)}
                  quantity={item.lines.reduce((a, b) => a + b.quantity, 0)}
                  t={t}
                  onItemPress={(btnType) =>
                    handleItemPress(item.order_id, btnType)
                  }
                  onActionBtnPress={(btnType) =>
                    handleActionBtnPress(item, btnType)
                  }
                  orderStatus={item.order_status}
                />
              ))}
            </View>
          )
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.listItemWrapper,
              { backgroundColor: isDark ? colors.darkBlue : colors.white },
            ]}
          >
            <Text style={styles.dateText}>
              {transformDateFormat(item.order_create_date)}
            </Text>
            <OrderHistoryItem
              style={[
                styles.listItem,
                {
                  backgroundColor: isDark ? colors.secBlue : colors.white,
                },
              ]}
              isDark={isDark}
              logoUrl={item.merchant_logo}
              name={item.merchant_name}
              description={concatStrings(item.lines, "product_name")}
              date={item.order_create_date.split(" ")[1]}
              deliveryType={getDeliveryTypeDisplayValue(item.delivery_type)}
              price={item.lines.reduce((a, b) => a + b.price_subtotal, 0)}
              quantity={item.lines.reduce((a, b) => a + b.quantity, 0)}
              t={t}
              onItemPress={handleItemPress}
              onActionBtnPress={(btnType) =>
                handleActionBtnPress(item, btnType)
              }
              orderStatus={item.order_status}
            />
          </View>
        )}
      />
      <OrderModal
        onClose={() => setSelectedOrderStatus(null)}
        orderStatus={selectedOrderStatus}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  emptyWrapper: {
    height: 112,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 75,
  },
  emptyText: {
    fontFamily: BALOO_MEDIUM,
    fontSize: 14,
  },
  listItemWrapper: {
    marginTop: 30,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  listItemHeader: {
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  listItem: {
    width: "100%",
  },
  headerListItem: {
    marginBottom: 30,
    width: "100%",
  },
  list: { paddingHorizontal: 20 },
  dateText: {
    fontSize: 14,
    fontFamily: BALOO_SEMIBOLD,
    color: colors.grey,
  },
  showBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  showText: {
    color: colors.darkBlue,
    fontSize: 12,
    fontFamily: BALOO_SEMIBOLD,
    marginLeft: 4,
  },
});

export default OrderHistoryList;
