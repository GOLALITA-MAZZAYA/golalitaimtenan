import { getToken } from '../utils/secureStorage';
import instance from "../redux/instance";
import { org } from '../org/config';

export const charityAmountInitiate = async (data) => {
  const token = await getToken();

  const params = {
    token,
    ...data,
    "currency": "QAR",
    "description": "Charity donation for Ramadan campaign",
    "callback_url": "https://www.golalita.com/payment/callback",
    "return_url": `${org.urlScheme}charities`,
    "cancel_url": `${org.urlScheme}charities`
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
  const token = await getToken();

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