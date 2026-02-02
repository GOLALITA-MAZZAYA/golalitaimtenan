import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from "../redux/instance";
import { BASE_URL } from "../constants";

export const getTransactionsPoints = async (filters = {}) => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post(
    `https://${BASE_URL}/go/user/api/loyalty/transactions`,
    {
      params: {
        token,
        catgeory_id: filters.categoryId,
        date_to: filters?.toDate,
        date_from: filters.fromDate,
        sort_amount: "desc",
      },
    }
  );

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const sharePoints = async (points, phone) => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("/user/transfer/points", {
    params: {
      token,
      points,
      phone,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};
