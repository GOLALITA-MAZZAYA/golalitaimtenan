import { getAuthToken } from '../utils/tokenStorage';
import instance from "../redux/instance";

export const MARKETING_POPUP_PLACEMENT = "Hotels_home";

export const getMarketingPopup = async ({ country } = {}) => {
  const token = await getAuthToken();
  const res = await instance.post("/v5/marketing/get_popup", {
    params: {
      token,
      placement_code: MARKETING_POPUP_PLACEMENT,
      ...(country ? { country } : {}),
    },
  });

  if (!res.data?.result || res.data.result.success === false) {
    throw new Error(res.data?.result?.error);
  }

  return res.data.result;
};
