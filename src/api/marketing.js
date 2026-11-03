import { getToken } from '../utils/secureStorage';
import instance from "../redux/instance";

// The only placement the backend has configured today; v5 rejects the
// request without one, so every screen sends it and targets by `country`.
export const MARKETING_POPUP_PLACEMENT = "Hotels_home";

export const getMarketingPopup = async ({ country } = {}) => {
  const token = await getToken();
  const res = await instance.post("/v5/marketing/get_popup", {
    params: {
      token,
      "placement_code": MARKETING_POPUP_PLACEMENT,
      ...(country ? { country } : {}),
    },
  });
  if (!res.data?.result || res.data.result.success === false) {
    throw new Error(res.data?.result?.error);
  }

  return res.data.result;
};
