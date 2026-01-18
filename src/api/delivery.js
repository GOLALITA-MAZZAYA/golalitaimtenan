import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from "../redux/instance";

export const getRestaurantProductsByCategory = async (
  merchant_id,
  category_id
) => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("/user/restaurant/product/lists/new", {
    params: {
      token,
      restaurant_category_ids: category_id ? [category_id] : [],
      merchant_id: merchant_id,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const createOrder = async (data) => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("/user/restaurant/create/order", {
    params: {
      token,
      ...data,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getDiscountFromVouchercode = async (data) => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("/user/voucher/code/search", {
    params: {
      token,
      ...data,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const initiatePaymentSkipCash = async (order_id) => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("/user/restaurant/order/payment/start", {
    params: {
      token,
      order_id,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result?.[0];
};

export const checkSkipCashPaymentStatus = async (order_id) => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("/user/restaurant/order/payment/validate", {
    params: {
      token,
      order_id,
      //   payment_reference: "GHHJJKAIU8898",
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

//www.golalita.com/go/user/api/user/restro/order/detail/id

export const getOrderDetailById = async (order_id) => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("user/restro/order/detail/id", {
    params: {
      token,
      order_id,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result[0];
};
