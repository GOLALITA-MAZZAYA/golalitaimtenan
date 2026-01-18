import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setOrderHistory,
  setOrderHistoryLoading,
} from "./order-history-actions";
import { orderHistoryApi } from "./order-history-api";
import axios from "axios";

export const getOrderHistory = () => async (dispatch, getState) => {
  try {
    dispatch(setOrderHistoryLoading(true));
    const token = await AsyncStorage.getItem("token");
    const { user } = getState().authReducer;

    const res = await axios.post(
      "https://www.golalita.com/go/user/api/user/restro/order/list",
      {
        params: {
          token,
          customer_id: user.partner_id,
        },
      }
    );

    dispatch(setOrderHistory(res.data.result));
  } catch (err) {
    console.log("get order history err", err);
  } finally {
    dispatch(setOrderHistoryLoading(false));
  }
};
