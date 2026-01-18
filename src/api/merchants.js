import AsyncStorage from '@react-native-async-storage/async-storage';
import instance from '../redux/instance';

export const getMerchants = async (params = {}) => {
  const token = await AsyncStorage.getItem('token');

  console.log(params, 'params');
  const res = await instance.post('/user/category/merchant/lists', {
    params: { token, ...params, x_org_linked: 'golalita' },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result.sort((a, b) => (a.x_sequence > b.x_sequence ? 1 : -1));
};

export const getMerchantById = async merchant_id => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/user/merchant/lists', {
    params: { token, merchant_id },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getOffers = async merchant_id => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/user/offers/golalita/v3', {
    params: { token, merchant_id },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getAllOffersByMeerchantId = async merchant_id => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/user/offers/v3', {
    params: { token, merchant_id },
  });

  const offers = res?.data?.result;

  if (!offers) {
    throw new Error();
  }

  const transformedOffers = offers?.map(offer => ({
    ...offer,
    value: offer.list_price,
    name: offer.name,
    uri: offer.image_url,
  }));

  return transformedOffers;
};

export const getMerchantDetails = async merchant_id => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/user/merchant/details', {
    params: {
      token,
      merchant_id: merchant_id.merchant_id,
      x_for_employee_type: merchant_id.x_for_employee_type,
    },
  });

  return res.data.result;
};

export const getPasscard = async (userName, expDate, barcode) => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/golalta/passcard/v2', {
    params: {
      token,
      key_label1: userName,
      key_label2: expDate,
      barcode,
    },
  });

  return res.data.result;
};

export const getAllMerchants = async (otherParams = {}) => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/user/category/merchant/lists', {
    params: {
      token,
      ...otherParams,
    },
  });

  return res.data.result;
};

export const getAllMerchantsForScan = async (otherParams = {}) => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/scan/merchant/list', {
    params: {
      token,
      ...otherParams,
    },
  });

  return res.data.result?.merchants || [];
};

export const getLocalClients = async () => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/category/new/merchant/lists', {
    params: {
      token,
    },
  });

  return res.data.result;
};

export const getBranchesById = async merchant_id => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/user/merchant/branch/list', {
    params: {
      token,
      merchant_id,
    },
  });

  return res.data.result;
};

export const getMerchantDisscountForOffers = async merchant_id => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/user/offers-discount-tag', {
    params: {
      token,
      merchant_id,
    },
  });

  const result = res.data.result?.[0];

  return {
    ribbon_text: result?.ribbon_text || '',
    x_ribbon_text_arabic: result?.x_discount_tag_arabic || '',
  };
};

export const getFavouriteMerchants = async customer_id => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/get/favourite/merchants', {
    params: {
      token,
      customer_id,
    },
  });

  return res.data.result;
};

export const saveBill = async params => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/scan/merchant/list', {
    params: {
      token,
      ...params,
    },
  });

  return res.data.result;
};

export const getPremiumMerchants = async () => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/user/merchant/lists/premium', {
    params: {
      token,
    },
  });

  return res.data.result;
};

export const getGoPointsMerchants = async () => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/user/category/merchant/lists/', {
    params: {
      token,
      gpoint: true,
      offset: 0,
      category_id: [],
    },
  });

  return res.data.result;
};

export const getNearbyMerchants = async ({ latitude, longitude }) => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/user/category/merchant/list/nearby', {
    params: {
      token,
      latitude,
      longitude,
    },
  });

  return res.data.result?.merchants || [];
};

export const getTemsAndConditions = async merchant_id => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/user/terms-conditions', {
    params: {
      token,
      merchant_id,
    },
  });

  return res.data.result;
};

export const getContracts = async merchant_id => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/user/contracts', {
    params: {
      token,
      merchant_id,
    },
  });

  return res.data.result;
};

export const getPremiumMerchantsCount = async () => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/user/merchant/count/premium', {
    params: {
      token,
    },
  });

  return res.data.result;
};

export const getGoPointMerchatnsCount = async () => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/user/merchant/count/gpoint', {
    params: {
      token,
    },
  });

  return res.data.result;
};

export const verifyEmail = async () => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/user/verify/email', {
    params: {
      token,
    },
  });

  return res.data.result;
};

export const verifyPhone = async () => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/user/verify/phone', {
    params: {
      token,
    },
  });

  return res.data.result;
};

export const submitComplaint = async complaintData => {
  const token = await AsyncStorage.getItem('token');

  console.log('Submitting complaint:', complaintData);

  const res = await instance.post('/user/complaints/create', {
    params: {
      token,
      merchant_id: complaintData.merchant_id,
      merchant_name: complaintData.merchant_name,
      date: complaintData.date,
      time: complaintData.time,
      subject: complaintData.subject,
      description: complaintData.description,
      rating: complaintData.rating,
      communication_type: complaintData.communication_type,
      customer_email: complaintData.email,
      customer_phone: complaintData.phone,
    },
  });

  console.log('Complaint submission response:', res.data);

  // Check if the response has the expected structure
  if (!res.data.result) {
    throw new Error('Invalid response format');
  }

  // Check if the result indicates success or error
  if (res.data.result.status === 'error') {
    throw new Error(res.data.result.message || 'Failed to submit complaint');
  }

  if (res.data.result.status !== 'success') {
    throw new Error(res.data.result.message || 'Failed to submit complaint');
  }

  return res.data.result;
};

export const getMerchantsByCoordinates = async (
  latitude,
  longitude,
  category_id,
  radius = 5,
) => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/user/category/merchant/list/nearby', {
    params: {
      token,
      latitude,
      longitude,
      category_id,
      limit: 20,
      x_org_linked: 1651,
      radius,
    },
  });

  return res.data.result?.merchants;
};

export const trackMerchantOpensCount = async (merchant_id) => {
  const token = await AsyncStorage.getItem('token');

  const res = await instance.post('/merchant/mobile/count/add', {
    params: {
      token,
      merchant_id
    },
  });

  return res.data.result?.merchants;
}





