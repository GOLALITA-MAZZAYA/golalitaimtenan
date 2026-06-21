import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from "../redux/instance";

export const getMarketingPopup = async () => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("/marketing/get_popup", {
    params: {
      token,
      "placement_code": "Hotels_home"
    },
  });
  console.log(JSON.stringify(res.data.result), 'res getMarketingPopup')
  if (!res.data?.result) {
    throw new Error();
  }

  return res.data.result;
};
