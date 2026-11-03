import { getToken } from '../utils/secureStorage';
import instance from "../redux/instance";
import { org } from "../org/config";

export const getVouchers = async (orgType = org.code) => {
  const token = await getToken();

  const res = await instance.post("user/voucher/list", {
    params: {
      token,
      x_org_type: orgType,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getVoucherCategoriesList = async (country, x_org_type) => {
  const token = await getToken();

  const res = await instance.post("voucher/category/list", {
    params: {
      token,
      country,
      x_org_type,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result.categories;
};


export const getFavouriteVouchers = async () => {
  const token = await getToken();

  const res = await instance.post("user/voucher/save/list", {
    params: {
      token,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const saveVoucher = async (code) => {
  const token = await getToken();

  const res = await instance.post("user/voucher/save", {
    params: {
      token,
      code,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const unsaveVoucher = async (code) => {
  const token = await getToken();

  const res = await instance.post("user/voucher/unsave", {
    params: {
      token,
      code,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};



export const applyVoucher = async (code) => {
  const token = await getToken();

  const res = await instance.post("user/voucher/apply", {
    params: {
      token,
      code,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const purchaseVoucher = async (code, quantity, priceWithDiscount) => {
  const token = await getToken();

  const res = await instance.post("user/voucher/purchase", {
    params: {
      token,
      code,
      quantity,
      amount_after_discount: priceWithDiscount,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};
