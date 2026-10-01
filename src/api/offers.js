import instance from "../redux/instance";
import { getAuthToken } from '../utils/tokenStorage';

export const getNewOffers = async (reqParams) => {
  const token = await getAuthToken();

  const res = await instance.post("/user/offers/v3", {
    params: {
      token,
      ...reqParams,
    },
  });

  return res.data.result;
};

export const getProductCategoryTypes = async () => {
  try {
    const token = await getAuthToken();
    const res = await instance.post("/product/category_type/list", {
      params: { token },
    });
    return Array.isArray(res?.data?.result) ? res.data.result : [];
  } catch (e) {
    console.log("getProductCategoryTypes error:", e);
    return [];
  }
};

export const getB1G1Offers = async ({ params = {} }) => {
  const token = await getAuthToken();

  const res = await instance.post("/user/offers/v3", {
    params: {
      token,
      x_offer_type: "b1g1",
      ...params
    },
  });

  return res.data.result;
};

export const getOfferById = async (product_id) => {
  const token = await getAuthToken();

  const res = await instance.post("/user/offer/details", {
    params: {
      token,
      product_id,
    },
  });

  return res.data.result;
};

export const sendRedemptionEmail = async (body) => {
  const token = await getAuthToken();

  const res = await instance.post("/send_redemption_email", {
    params: {
      token,
      ...body,
    },
  });

  return res.data.result;
};
