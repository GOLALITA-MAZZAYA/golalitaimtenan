import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken } from '../utils/secureStorage';
import instance from "../redux/instance";
import store from "../redux/store";
import { org } from "../org/config";

export const getLoyaltyTransactionHistory = async ({ pageParam = 0 }) => {
  const token = await getToken();

  const limit = 50;
  const offset = pageParam * limit;

  const res = await instance.post(
    "loyalty/points/transaction/history",
    {
      params: {
        token,
        limit,
        offset
      }
    }
  );


  if (!res.data.result?.transactions) {
    throw new Error("Error fetching loyalty history");
  }

  return {
    data: res.data.result.transactions,
    nextPage: res.data.result.transactions.length === limit ? pageParam + 1 : null
  };
};

export const getUserPoints = async () => {
  const token = await getToken();

  const res = await instance.post("user/points", {
    params: {
      token,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result.available_points;
};

export const getLoyaltyCategories = async () => {
  const res = await instance.post("/public/app/loyalty_categories", {
    jsonrpc: "2.0",
    method: "call",
    params: {
      app: org.code,
    },
  });
  console.log('getLoyaltyCategories ress', res.data);
  if (!res.data?.result?.success) {
    throw new Error("Failed to fetch loyalty categories");
  }

  return res.data.result.categories || [];
};

export const getLoyaltyProductList = async () => {
  const token = await getToken();

  const res = await instance.post("loyalty/product/list", {
    params: {
      token,
      x_org_linked: org.code,
    },
  });

  if (!res.data.result?.products) {
    throw new Error();
  }

  return res.data.result.products;
};

export const getLoyaltyProductDetails = async (product_id) => {
  const token = await getToken();


  const res = await instance.post("loyalty/product/details", {
    params: {
      token,
      product_id
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getLoyaltyProductsHistory = async () => {
  const token = await getToken();

  const res = await instance.post("loyalty/product/user/history", {
    params: {
      token,
    },
  });

  if (!res.data.result?.history) {
    throw new Error();
  }

  return res.data.result.history;
};


export const getLoyaltyVouchersList = async ({ category_id, country, x_org_type } = {}) => {
  const token = await getToken();


  const res = await instance.post("user/voucher/list", {
    params: {
      token,
      category_id,
      country,
      x_org_type,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getLoyaltyVouchersHistory = async () => {
  const token = await getToken();

  const res = await instance.post("user/voucher/purchase/list", {
    params: {
      token,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const loyaltyPurchaseVoucher = async (code, amount_after_discount) => {
  const token = await getToken();

  console.log(amount_after_discount, 'amount_after_discount')


  const res = await instance.post("user/voucher/purchase", {
    params: {
      token,
      code,
      quantity: 1,
      amount_after_discount
    },
  });


  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const loyaltyRedeemVoucher = async (code, points) => {
  const token = await getToken();
  let body = {
    params: {
      token,
      reference: code,
      points,
      action: 'redeem'
    },
  }
  const res = await instance.post("user/voucher/points/redeem_reward", body);

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};


export const redeemLoyaltyProduct = async (product_id) => {
  const token = await getToken();

  const res = await instance.post("loyalty/product/redeem", {
    params: {
      token,
      product_id
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getLoyaltyPartners = async ({ pageParam = 0 }) => {
  const token = await getToken();

  const limit = 50;
  const offset = pageParam * limit;


  const res = await instance.post(
    "user/category/merchant/lists",
    {
      params: {
        token,
        category_id: 192,
        x_org_linked: org.code,
        gpartners: true,
        limit,
        offset,
        is_website: true,
        is_online_store: true
      }
    }
  );


  if (!res.data.result) {
    throw new Error("Error fetching loyalty partners");
  }

  return {
    data: res.data.result,
    nextPage: res.data.result.length === limit ? pageParam + 1 : null
  };
};

export const getLoyaltyTransferPartners = async ({ pageParam = 0 }) => {
  const token = await getToken();

  const limit = 50;
  const offset = pageParam * limit;

  const res = await instance.post(
    "user/category/merchant/lists",
    {
      params: {
        token,
        x_org_linked: org.code,
        limit,
        offset,
        gpartners: true,
      }
    }
  );

  console.log(res.data?.result, 'partners')


  if (!res.data.result) {
    throw new Error("Error fetching loyalty partners");
  }

  return {
    data: res.data.result,
    nextPage: res.data.result.length === limit ? pageParam + 1 : null
  };
};

export const getLoyaltyGoods = async ({ pageParam = 0 }) => {
  const token = await getToken();

  const limit = 50;
  const offset = pageParam * limit;

  const res = await instance.post(
    "user/category/merchant/lists",
    {
      params: {
        token,
        x_org_linked: org.code,
        limit,
        offset,
        gshops: true
      }
    }
  );


  if (!res.data.result) {
    throw new Error("Error fetching loyalty partners");
  }

  return {
    data: res.data.result,
    nextPage: res.data.result.length === limit ? pageParam + 1 : null
  };
};

export const getLoyaltyTavel = async ({ pageParam = 0 }) => {
  const token = await getToken();

  const limit = 50;
  const offset = pageParam * limit;

  const res = await instance.post(
    "user/category/merchant/lists",
    {
      params: {
        token,
        x_org_linked: org.code,
        gtravel: true,
        limit,
        offset,
      }
    }
  );


  if (!res.data.result) {
    throw new Error("Error fetching loyalty partners");
  }

  return {
    data: res.data.result,
    nextPage: res.data.result.length === limit ? pageParam + 1 : null
  };
};


export const trackProduct = async (product_id, track_type) => {
  const { token, user } = store.getState().authReducer;
  const userId = await AsyncStorage.getItem('tracking_partner_id');


  const body = {
    params: {
      token,
      customer_id: userId,
      customer_name: user.name,
      customer_phone: user.phone,
      customer_email: user.email,
      track_type,
      product_id,
      track_date_time: new Date(),
    },
  };

  await instance.post('/merchant/track/v2', body);

};

export const sendProductEmail = async (product_id, track_type) => {
  const { token, user } = store.getState().authReducer;
  const userId = await AsyncStorage.getItem('tracking_partner_id');


  const body = {
    params: {
      token,
      customer_id: userId,
      customer_name: user.name,
      customer_phone: user.phone,
      customer_email: user.email,
      track_type,
      product_id,
      track_date_time: new Date(),
    },
  };

  await instance.post('/send/mail/v2', body);

};


export const redeemLoyaltyGiftCard = async (gift_id) => {
  const token = await getToken();

  console.log({
    token,
    gift_id
  })

  const res = await instance.post("loyalty/giftcard/redeem", {
    params: {
      token,
      gift_id
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};



export const getPointsRate = async () => {
  const token = await getToken();

  const res = await instance.post("/points/calculate", {
    params: {
      token,
      transaction_type: "redeem"
    },
  });

  if (!res.data.result?.data) {
    throw new Error();
  }

  return res.data.result?.data;
}

export const executePoints = async (merchant_id, points) => {
  const token = await getToken();

  const res = await instance.post("/points/execute", {
    params: {
      token,
      transaction_type: "redeem",
      merchant_id,
      points

    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
}

export const executeRewardPoints = async (merchant_id, amount) => {
  const token = await getToken();

  const res = await instance.post("/points/execute", {
    params: {
      token,
      transaction_type: "reward",
      merchant_id,
      amount
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
}






