import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from "../redux/instance";

export const charityAmountInitiate = async (data) => {
  const token = await AsyncStorage.getItem("token");

  const params = {
    token,
    ...data,
    "currency": "QAR",
    "description": "Charity donation for Ramadan campaign",
    "callback_url": "https://www.golalita.com/payment/callback",
    "return_url": "golalita://charities",
    "cancel_url": "golalita://charities"
  };

  const res = await instance.post("/user/amount/charity/initiate", {
    params: params,
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const charityVerify = async (transaction_id) => {
  const token = await AsyncStorage.getItem("token");

  const params = {
    token,
    transaction_id
  };

  const res = await instance.post("/user/amount/charity/verify", {
    params: params,
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};