import { getToken } from '../utils/secureStorage';
import instance from '../redux/instance';
import { org } from '../org/config';

const logOfferFieldCheck = (endpoint, result) => {
  const list = Array.isArray(result) ? result : [];
  console.log(
    `[OffersTab] ${endpoint} FIELD CHECK (${list.length} offers):`,
    JSON.stringify(
      list.map(o => ({
        id: o?.id,
        name: o?.name,
        has_x_home_offer: o != null && 'x_home_offer' in o,
        x_home_offer: o?.x_home_offer,
        has_is_in_offer: o != null && 'is_in_offer' in o,
        is_in_offer: o?.is_in_offer,
      })),
      null,
      2,
    ),
  );
};

export const getMerchants = async (params = {}) => {
  const token = await getToken();

  console.log(params, 'params getMerchants');
  const res = await instance.post('/user/category/merchant/lists', {
    params: { token, ...params, x_org_linked: org.code },
  });
  console.log("getMerchants res:", res.data)

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result.sort((a, b) => (a.x_sequence > b.x_sequence ? 1 : -1));
};

export const getMerchantById = async merchant_id => {
  const token = await getToken();

  const res = await instance.post('/user/merchant/details', {
    params: { token, merchant_id },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getOffers = async merchant_id => {
  const token = await getToken();

  const payload = { params: { token, merchant_id } };
  console.log('[OffersTab] /user/offers/golalita/v3 REQUEST:', JSON.stringify(payload, null, 2));
  const res = await instance.post('/user/offers/golalita/v3', payload);
  console.log('[OffersTab] /user/offers/golalita/v3 RESPONSE:', JSON.stringify(res?.data, null, 2));
  logOfferFieldCheck('/user/offers/golalita/v3', res?.data?.result);

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getAllOffersByMeerchantId = async merchant_id => {
  const token = await getToken();

  const payload = { params: { token, merchant_id } };
  console.log('[OffersTab] /user/offers/v3 REQUEST:', JSON.stringify(payload, null, 2));
  const res = await instance.post('/user/offers/v3', payload);
  console.log('[OffersTab] /user/offers/v3 RESPONSE:', JSON.stringify(res?.data, null, 2));
  logOfferFieldCheck('/user/offers/v3', res?.data?.result);
  const offers = res?.data?.result;

  if (!Array.isArray(offers)) {
    return [];
  }

  const transformedOffers = offers.map(offer => ({
    ...offer,
    value: offer.list_price,
    name: offer.name,
    uri: offer.image_url,
  }));

  return transformedOffers;
};

export const getMerchantDetails = async merchant_id => {
  const token = await getToken();

  const res = await instance.post('/user/merchant/details', {
    params: {
      token,
      merchant_id: merchant_id.merchant_id,
      x_for_employee_type: merchant_id.x_for_employee_type,
    },
  });

  return res.data.result;
};


export const getAllMerchants = async (otherParams = {}) => {
  const token = await getToken();

  console.log("getAllMerchants:params:", {
    token,
    x_org_linked: org.code,
    ...otherParams,
  })

  const res = await instance.post('/user/category/merchant/lists', {
    params: {
      token,
      x_org_linked: org.code,
      ...otherParams,
    },
  });
  console.log("getAllMerchants:", res.data)
  return res.data.result;
};

export const getAllMerchantsForScan = async (otherParams = {}) => {
  const token = await getToken();

  const res = await instance.post('/scan/merchant/list', {
    params: {
      token,
      ...otherParams,
    },
  });

  return res.data.result?.merchants || [];
};

export const getLocalClients = async () => {
  const token = await getToken();

  const res = await instance.post('/category/new/merchant/lists', {
    params: {
      token,
    },
  });

  return res.data.result;
};

export const getBranchesById = async merchant_id => {
  const token = await getToken();

  const res = await instance.post('/user/merchant/branch/list', {
    params: {
      token,
      merchant_id,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getMerchantDisscountForOffers = async merchant_id => {
  const token = await getToken();

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
  const token = await getToken();

  const res = await instance.post('/get/favourite/merchants', {
    params: {
      token,
      customer_id,
    },
  });

  return res.data.result;
};

export const saveBill = async params => {
  const token = await getToken();

  const res = await instance.post('/user/scan/bills', {
    params: {
      token,
      ...params,
    },
  });

  return res.data.result;
};

export const getPremiumMerchants = async () => {
  const token = await getToken();

  const res = await instance.post('/user/merchant/lists/premium', {
    params: {
      token,
    },
  });

  return res.data.result;
};


export const getGoPointsMerchantsWithDiscount = async () => {
  const token = await getToken();

  const res = await instance.post('/user/category/merchant/lists/', {
    params: {
      token,
      gpoint: true,
      offset: 0,
      category_id: [],
    },
  });

  const result = res.data.result;

  if (!result) {
    throw 'can not get go point merchants list'
  }

  const updatedClients = await Promise.all(
    result.map(async client => {
      const discountData = await getMerchantDisscountForOffers(
        client.merchant_id,
      );

      return { ...client, ...discountData };
    }),
  );


  return updatedClients;
};

export const getNearbyMerchants = async ({ latitude, longitude }) => {
  const token = await getToken();

  console.log(latitude, longitude, 'longitude');

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
  const token = await getToken();

  const res = await instance.post('/user/terms-conditions', {
    params: {
      token,
      merchant_id,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getContracts = async merchant_id => {
  const token = await getToken();

  const res = await instance.post('/user/contracts', {
    params: {
      token,
      merchant_id,
    },
  });

  if (!res.data.result) {
    throw new Error();
  }

  return res.data.result;
};

export const getPremiumMerchantsCount = async () => {
  const token = await getToken();

  const res = await instance.post('/user/merchant/count/premium', {
    params: {
      token,
    },
  });

  return res.data.result;
};

export const getGoPointMerchatnsCount = async () => {
  const token = await getToken();

  const res = await instance.post('/user/merchant/count/gpoint', {
    params: {
      token,
    },
  });

  return res.data.result;
};

export const verifyEmail = async () => {
  const token = await getToken();

  const res = await instance.post('/user/verify/email', {
    params: {
      token,
    },
  });

  return res.data.result;
};

export const verifyPhone = async () => {
  const token = await getToken();

  const res = await instance.post('/user/verify/phone', {
    params: {
      token,
    },
  });

  return res.data.result;
};

export const submitComplaint = async complaintData => {
  const token = await getToken();

  console.log('Submitting complaint:', complaintData);

  const res = await instance.post('/user/complaints/create', {
    params: {
      token,
      merchant_id: complaintData.merchant_id,
      merchant_name: complaintData.merchant_name,
      // Explicit so it's always a new complaint ticket (reviews would upsert).
      feedback_type: 'complaint',
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

// Star rating + optional comment. Upserts: re-submitting edits the user's existing review.
export const submitMerchantFeedback = async ({ merchant_id, rating, comment }) => {
  const token = await getToken();

  const res = await instance.post('/feedback/submit', {
    params: {
      token,
      merchant_id,
      rating,
      ...(comment ? { comment } : {}),
    },
  });

  const result = res.data?.result;

  if (!result?.success) {
    throw new Error(result?.error || 'Failed to submit feedback');
  }

  return result;
};

// Deletes the user's own review for a merchant (never complaints).
export const deleteMerchantFeedback = async merchant_id => {
  const token = await getToken();

  const res = await instance.post('/feedback/delete', {
    params: { token, merchant_id },
  });

  const result = res.data?.result;

  if (result?.status !== 'success') {
    const error = new Error(result?.message || 'Failed to delete review');
    error.notFound = /no review found/i.test(result?.message || '');
    throw error;
  }

  return result;
};

export const getMerchantFeedbackSummary = async merchant_id => {
  const token = await getToken();

  const res = await instance.post('/merchant/feedback/summary', {
    params: { token, merchant_id },
  });

  const result = res.data?.result;

  if (result?.status !== 'success' || !result?.data) {
    throw new Error(result?.message || 'Failed to load feedback summary');
  }

  return result.data;
};

export const getMerchantWeeklyTimetable = async merchant_id => {
  const token = await getToken();

  console.log('[Timetable] request:', { merchant_id, hasToken: !!token });

  const res = await instance.post('/merchant/weekly/timetable', {
    params: { token: token || '', merchant_id },
  });

  console.log('[Timetable] raw response:', JSON.stringify(res.data));

  const result = res.data?.result;

  if (!result || result.error || !Array.isArray(result.timetable)) {
    // JSON-RPC level errors (e.g. server exception) come back in res.data.error, not result.
    const message =
      result?.error ||
      res.data?.error?.data?.message ||
      res.data?.error?.message ||
      'Failed to load timetable';
    console.log('[Timetable] invalid response for merchant', merchant_id, '->', message);
    throw new Error(message);
  }

  return result;
};

export const getMerchantsByCoordinates = async (
  latitude,
  longitude,
  category_id,
  radius = 5,
) => {
  const token = await getToken();

  const res = await instance.post('/user/category/merchant/list/nearby', {
    params: {
      token,
      latitude,
      longitude,
      category_id,
      limit: 20,
      x_org_linked: org.id,
      radius,
    },
  });

  return res.data.result?.merchants;
};

export const trackMerchantOpensCount = async (merchant_id) => {
  const token = await getToken();

  const res = await instance.post('/merchant/mobile/count/add', {
    params: {
      token,
      merchant_id
    },
  });

  return res.data.result?.merchants;
}

export const getMerchantMatrixDiscount = async (merchant_id) => {
  const token = await getToken();

  const res = await instance.post('/user/merchant-matrix/discount', {
    params: {
      token,
      merchant_id
    },
  });

  return res.data.result;
}







