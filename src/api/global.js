import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from "../redux/instance";

export const getAllCountries = async () => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("/res.country/search", {
    params: {
      token,
      fields: "['id','name', 'code', 'image_url', 'x_arabic_name' ]",
    },
  });

  if (!res.data?.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getAllLocations = async () => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("/user/get/locations", {
    params: {
      token,
    },
  });
  if (!res.data?.result) {
    throw new Error();
  }

  return res.data.result;
};
