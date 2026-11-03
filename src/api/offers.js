import { getToken } from '../utils/secureStorage';
import instance from "../redux/instance";
import i18next from "i18next";
import axios from "axios";

export const getNewOffers = async (reqParams) => {
  const token = await getToken();

  const res = await instance.post("/user/offers/v3", {
    params: {
      token,
      ...reqParams,
    },
  });
  console.log("user/offers/v3 res:", res)
  return Array.isArray(res?.data?.result) ? res.data.result : [];
};

export const getProductCategoryTypes = async () => {
  try {
    const token = await getToken();
    const res = await instance.post("/product/category_type/list", {
      params: { token },
    });
    return Array.isArray(res?.data?.result) ? res.data.result : [];
  } catch (e) {
    console.log("getProductCategoryTypes error:", e);
    return [];
  }
};

export const getOfferById = async (product_id) => {
  const token = await getToken();

  const res = await instance.post("/user/offer/details", {
    params: {
      token,
      product_id,
    },
  });

  return res.data.result;
};

export const sendRedemptionEmail = async (body) => {
  const token = await getToken();

  const res = await instance.post("/send_redemption_email", {
    params: {
      token,
      ...body,
    },
  });

  return res.data.result;
};


export const bookHotel = async (body) => {


  const token = await getToken();

  const res = await axios.post(
    'https://golalitatwffer.com/api/go/sendinblue_email/V2',
    {
      params: {
        ...body,
        token,
      },
    },
  );


  return res?.data?.result
}
