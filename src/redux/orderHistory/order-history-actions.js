import {
  SET_ORDER_HISTORY,
  SET_ORDER_HISTORY_LOADING,
} from "./order-history-types";

export const setOrderHistoryLoading = (loading) => ({
  type: SET_ORDER_HISTORY_LOADING,
  loading,
});

export const setOrderHistory = (orderHistory) => ({
  type: SET_ORDER_HISTORY,
  orderHistory,
});
