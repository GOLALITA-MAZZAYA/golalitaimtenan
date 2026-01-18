import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from "../redux/instance";

export const getVouchers = async () => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("user/voucher/list", {
    params: {
      token,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getVoucherStatus = async (code) => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("user/voucher/payment_status", {
    params: {
      token,
      code,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getPurchasedVouchers = async () => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("user/voucher/purchase/list", {
    params: {
      token,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getFavouriteVouchers = async () => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("user/voucher/save/list", {
    params: {
      token,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const saveVoucher = async (code) => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("user/voucher/save", {
    params: {
      token,
      code,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const unsaveVoucher = async (code) => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("user/voucher/unsave", {
    params: {
      token,
      code,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getVoucher = async (code) => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("user/voucher/details", {
    params: {
      token,
      code,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const applyVoucher = async (code) => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("user/voucher/apply", {
    params: {
      token,
      code,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const purchaseVoucher = async (code, quantity, priceWithDiscount) => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("user/voucher/purchase", {
    params: {
      token,
      code,
      quantity,
      amount_after_discount: priceWithDiscount,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};
