import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { BALOO_MEDIUM } from "../../../../../../redux/types";
import { colors } from "../../../../../../components/colors";
import { ForwardArrowIcon } from "../../../../../../assets/delivery_assets";
import OrderHistoryItem from "../../../_shared/componenets/OrderHistoryItem";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getOrderHistory } from "../../../../../../redux/orderHistory/order-history-thunks";
import { useTranslation } from "react-i18next";
import {
  concatStrings,
  getDeliveryTypeDisplayValue,
} from "../../../OrderHistoryList/helpers";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../../../../components/ThemeProvider";
import OrderModal from "../../../_shared/componenets/OrderModal";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orderHistory, orderHistoryLoading } = useSelector(
    (state) => state.orderHistoryReducer
  );
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { isDark } = useTheme();

  useEffect(() => {
    dispatch(getOrderHistory());
  }, []);

  const handleReorderPress = (item, btnType) => {
    if (btnType === "reordeer") {
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

  const handleItemPress = (orderId) => {
    navigation.navigate("orderHistoryView", { orderId });
  };

  const handleViewAllPress = () => {
    navigation.navigate("orderHistoryList");
  };

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: isDark ? colors.secBlue : "#F3F3F3" },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[styles.title, { color: isDark ? colors.white : colors.grey }]}
        >
          {t("RestaurantList.lastOrder")}
        </Text>

        {!!orderHistory.length && (
          <TouchableOpacity
            style={styles.viewAllWrapper}
            onPress={handleViewAllPress}
          >
            <Text
              style={[
                styles.viewAll,
                { color: isDark ? colors.white : colors.darkBlue },
              ]}
            >
              {t("RestaurantList.viewAll")}
            </Text>
            <ForwardArrowIcon color={isDark ? colors.white : colors.darkBlue} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        data={orderHistory}
        style={styles.list}
        renderItem={({ item }) => (
          <OrderHistoryItem
            logoUrl={item.merchant_logo}
            name={item.merchant_name}
            description={concatStrings(item.lines, "product_name")}
            date={item.order_create_date.split(" ")[0]}
            deliveryType={getDeliveryTypeDisplayValue(item.delivery_type)}
            price={item.lines.reduce((a, b) => a + b.price_subtotal, 0)}
            quantity={item.lines.reduce((a, b) => a + b.quantity, 0)}
            t={t}
            onItemPress={() => handleItemPress(item.order_id)}
            onActionBtnPress={(btnType) => handleReorderPress(item, btnType)}
            isDark={isDark}
            orderStatus={item.order_status}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyWrapper}>
            {orderHistoryLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.emptyText}>
                {t("RestaurantList.notFound")}
              </Text>
            )}
          </View>
        )}
      />
      <OrderModal
        onClose={() => setSelectedOrderStatus(null)}
        orderStatus={selectedOrderStatus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingVertical: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 14,
    fontFamily: BALOO_MEDIUM,
  },
  viewAll: {
    fontSize: 14,
    fontFamily: BALOO_MEDIUM,
    color: colors.darkBlue,
    marginRight: 6,
  },
  viewAllWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    marginLeft: 20,
    marginTop: 10,
  },
  emptyWrapper: {
    height: 112,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
  emptyText: {
    fontFamily: BALOO_MEDIUM,
    fontSize: 14,
  },
  historyItem: {
    marginRight: 10,
  },
});

export default OrderHistory;
