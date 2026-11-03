import { getToken } from '../utils/secureStorage';
import instance from "../redux/instance";
import axios from "axios";
import store from "../redux/store";
import { org } from "../org/config";

export const CARDMOOLA_BASE_URL = "https://api.business.cardmoola.com";

export const getGiftCardCountries = async () => {
  const token = await getToken();
  let a = {
    params: {
      token,
      fields:
        "['id','name','code','currency_name','x_arabic_name','x_flag_image','currency_code','timezone','mobile_number_formats','mobile_number_regex','detail_url','is_ugo2gift_currency','forex_conversion_rate','forex_rate_updated_at','forex_currency_id']",
    },
  }
  console.log("getGiftCardCountries params:", JSON.stringify(a))
  const res = await instance.post("/ugo2gift.country/search", a);
  console.log(JSON.stringify(res.data), "getGiftCardCountries stringify res:")

  console.log(res.data, "getGiftCardCountries res:")
  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getGiftCardById = async (reference_id, orgType = org.code) => {
  const token = await getToken();

  const res = await instance.post("user/ugo2gift/search/id", {
    params: {
      token,
      reference_id,
      x_org_type: orgType,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getGiftCardCategories = async (orgType = org.code) => {
  const token = await getToken();
  let body = {
    params: {
      token,
      domain: `[('x_org_type', 'in', ['${orgType}', False])]`,
      fields: "['id', 'name', 'category_id', 'x_sequence', 'x_org_type','image']",
    },
  }
  console.log("getGiftCardCategories body:", JSON.stringify(body))
  const res = await instance.post("ugo2gift.category/search", body);
  console.log("getGiftCardCategories res:", res.data)
  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const createGiftCardOrder = async (body) => {
  const token = await getToken();

  const params = {
    token,
    ...body,
    message: "Well Done!,\nI thought you would like this gift!",
    delivery_language: "en",
    notify: 1,
  };

  const res = await instance.post("/user/ugo2gift/create", {
    params: params,
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getGiftCardAmount = async (giftCardId) => {
  const token = await getToken();

  const res = await instance.post("ugo2gift.denomination/search", {
    params: {
      token,
      domain: `[ ['brand_id', '=', ${giftCardId}],['is_active','=',True]]`,
      fields: "['amount','min_amount', 'max_amount', 'currency', 'brand_id']",
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getGiftCards = async (body) => {
  const token = await getToken();
  let a = {
    params: {
      token,
      ...body,
    },
  }
  console.log("getGiftCards params a:", JSON.stringify(a))
  const res = await instance.post("/ugo2gift.brand/search", a);
  console.log("getGiftCards res:", JSON.stringify(res.data))
  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getPurchasedGiftCards = async (customer_id, orgType = org.code) => {
  const token = await getToken();

  const res = await instance.post("user/ugo2gift/bought/list", {
    params: {
      token,
      customer_id,
      x_org_type: orgType,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getPurchasedGiftCardCode = async (reference_id) => {
  const res = await instance.get(
    `https://sandbox.yougotagift.com/barcode/generate/${reference_id}/`
  );

  return res.data;
};

// card mola gift cards

export const getCardmolaToken = async () => {
  const res = await axios.post(`${CARDMOOLA_BASE_URL}/auth/token`, {
    apiKey: "EToStwO_",
    apiSecret: "GfTqmproCkR9aUSS7jRx9",
  });

  const token = res.data?.data?.accessToken?.token;

  if (!token) {
    throw "Error, Can not get cardmola token";
  }

  return token;
};

export const getCardmolaGiftCards = async (country) => {
  const token = await getCardmolaToken();

  const res = await axios.get(`${CARDMOOLA_BASE_URL}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      cultureCode: country,
    },
  });

  if (!res.data.data) {
    throw new Error();
  }

  return { token, data: res.data.data };
};

export const getCardmolaGiftCardById = async (encodedId, token) => {
  const { selectedCardmolaCountry } = store.getState().giftcardsReducer;

  let a =
    selectedCardmolaCountry === "undefined-undefined" ||
      selectedCardmolaCountry === null
      ? `${CARDMOOLA_BASE_URL}/products/${encodedId}`
      : `${CARDMOOLA_BASE_URL}/products/${encodedId}?cultureCode=${selectedCardmolaCountry}`;

  const res = await axios.get(`${CARDMOOLA_BASE_URL}/products/${encodedId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.data.data) {
    throw new Error();
  }

  return res.data.data;
};

export const requestGiftCardPayment = async (data) => {
  const token = await getToken();

  const res = await instance.post(
    `https://${org.baseUrl}/cardmola/payment/request`,
    {
      params: {
        ...data,
        token,
      },
    }
  );

  if (!res.data?.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getCardmolaCountries = async () => {
  const { cardmolaToken } = store.getState().giftcardsReducer;

  const res = await axios.get(`${CARDMOOLA_BASE_URL}/countries`, {
    headers: {
      Authorization: `Bearer ${cardmolaToken}`,
    },
  });

  if (!res.data.data) {
    throw new Error();
  }

  return res.data.data;
};

export const checkCardmolaPaymentById = async (encodedId) => {
  const token = await getToken();

  const res = await instance.post(
    `https://${org.baseUrl}/go/api/user/cardmoola/search/id`,
    {
      params: {
        token,
        reference_id: encodedId,
      },
    }
  );

  if (!res.data.result?.[0]) {
    throw new Error("check cardmola payent error");
  }

  return res.data.result?.[0];
};

export const checkGlobalTixPaymentStatus = async (recordRefNumber, referenceNumber) => {
  const token = await getToken();

  console.log('[GlobalTix][checkGlobalTixPaymentStatus] POST /go/api/globaltix/payment/status params:', {
    record_ref_number: referenceNumber,
  });

  const res = await instance.post(
    `https://${org.baseUrl}/go/api/globaltix/payment/status`,
    {
      params: {
        token,
        record_ref_number: referenceNumber,
        // referenceNumber: referenceNumber,
      },
    }
  );
  console.log('[GlobalTix][checkGlobalTixPaymentStatus] response:', JSON.stringify(res.data, null, 2));
  if (!res.data?.result) {
    throw new Error("check globaltix payment error");
  }

  return res.data.result;
};

export const getCardmoolaCategories = async (country) => {
  const { cardmolaToken } = store.getState().giftcardsReducer;

  const res = await axios.get(`${CARDMOOLA_BASE_URL}/products/get-categories`, {
    headers: {
      Authorization: `Bearer ${cardmolaToken}`,
    },
    params: {
      countryCode: country,
    },
  });

  console.log(country, "country");
  console.log(res?.data?.data, "categories");
  if (!res.data.data) {
    throw new Error();
  }

  return res.data.data;
};

export const getCardmolaCurrencies = async () => {
  const token = await getToken();

  const res = await instance.post(
    `https://${org.baseUrl}/go/api/res.currency/search`,
    {
      params: {
        token,
        fields: "['name', 'rate', 'symbol']",
        domain: "[['active', '!=', False]]",
      },
    }
  );

  if (!res.data.result) {
    throw new Error("get currencies error error");
  }

  return res.data.result;
};

export const getForexCurrencies = async () => {
  const token = await getToken();
  let payload = {
    params: {
      token,
      domain: "[]",
      fields:
        "['id','name','code','is_ugo2gift_currency','forex_conversion_rate','base_currency','rate_updated_at','active']",
    },
  }
  const res = await instance.post(
    `https://${org.baseUrl}/go/api/go.forex.currency/search`,
    payload
  );

  console.log(res.data, "getForexCurrencies res:", res.data)
  if (!res.data.result) {
    throw new Error("get forex currencies error");
  }

  return res.data.result;
};
