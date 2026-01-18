import AsyncStorage from "@react-native-async-storage/async-storage";
import instance from "../redux/instance";
import store from "../redux/store";

export const getLoyaltyTransactionHistory = async ({ pageParam = 0 }) => {
  const token = await AsyncStorage.getItem("token");
  
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
    nextPage: res.data.result.length === limit ? pageParam + 1 : null
  };
};

export const getUserPoints = async () => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("user/points", {
    params: {
      token,
    },
  });

  if (!res.data.result?.available_points) {
    throw new Error();
  }

  return res.data.result.available_points;
};

export const getLoyaltyProductList = async () => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("loyalty/product/list", {
    params: {
      token,
      x_org_linked: 'golalita',
    },
  });

  if (!res.data.result?.products) {
    throw new Error();
  }

  return res.data.result.products;
};

export const getLoyaltyProductDetails = async (product_id) => {
  const token = await AsyncStorage.getItem("token");


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

export const getLoyaltyProductsHistory= async () => {
  const token = await AsyncStorage.getItem("token");

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


export const getLoyaltyVouchersList = async () => {
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("user/voucher/list", {
    params: {
      token,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getLoyaltyVouchersHistory = async () => {
  const token = await AsyncStorage.getItem("token");

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
  const token = await AsyncStorage.getItem("token");

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
  const token = await AsyncStorage.getItem("token");

  const res = await instance.post("user/voucher/points/redeem_reward", {
    params: {
      token,
      reference: code,
      points,
      action: 'redeem'
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};


export const redeemLoyaltyProduct = async (product_id) => {
  const token = await AsyncStorage.getItem("token");

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

export const getLoyaltyPartners= async ({ pageParam = 0 }) => {
  const token = await AsyncStorage.getItem("token");
  
  const limit = 50;
  const offset = pageParam * limit;

  const res = await instance.post(
    "user/category/merchant/lists",
    { 
      params: {
        token,
        category_id: 192,
        x_org_linked: 'golalita',
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

export const getLoyaltyTransferPartners= async ({ pageParam = 0 }) => {
  const token = await AsyncStorage.getItem("token");
  
  const limit = 50;
  const offset = pageParam * limit;

  const res = await instance.post(
    "user/category/merchant/lists",
    { 
      params: {
        token,
        category_id: 245,
        x_org_linked: 'golalita',
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

export const getLoyaltyGoods = async ({ pageParam = 0 }) => {
  const token = await AsyncStorage.getItem("token");
  
  const limit = 50;
  const offset = pageParam * limit;

  const res = await instance.post(
    "user/category/merchant/lists",
    { 
      params: {
        token,
        category_id: 671,
        x_org_linked: 'golalita',
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

export const getLoyaltyTavel = async ({ pageParam = 0 }) => {
  const token = await AsyncStorage.getItem("token");
  
  const limit = 50;
  const offset = pageParam * limit;

  const res = await instance.post(
    "user/category/merchant/lists",
    { 
      params: {
        token,
        category_id: 682,
        x_org_linked: 'golalita',
        limit,
        offset,
        is_website: true
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


export const verifyProductCode =  async (code, product_id, track_type) => {
  const {  user } = store.getState().authReducer;
  const token = await AsyncStorage.getItem("token");
  const userId = await AsyncStorage.getItem('userId');

  const res = await instance.post("merchant/redeem/v2", {
    params: {
        token,
        customer_name: user.name,
        customer_phone: user.phone,
        customer_email: user.email,
        track_type,
        track_value: code,
        product_id,
        track_date_time: new Date(),
        customer_id: userId,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;

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

      const res = await instance.post('/merchant/track/v2',body);

      console.log(res,'track produck response')

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

      const res = await instance.post('/send/mail/v2',body);

      console.log(res,'send email response')

};


export const redeemLoyaltyGiftCard = async (gift_id) => {
  const token = await AsyncStorage.getItem("token");

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




