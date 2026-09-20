import instance from "../redux/instance";
import { getAuthToken } from '../utils/tokenStorage';

export const getMarketingPopup = async () => {
  const token = await getAuthToken();

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
