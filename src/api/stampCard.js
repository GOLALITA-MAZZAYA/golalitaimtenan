import { getToken } from '../utils/secureStorage';
import instance from '../redux/instance';

/**
 * Fetches all stamp-enabled merchants with pagination.
 * POST /go/api/customer/stamp/merchants/list
 * @param {Object} [options]
 * @param {number} [options.limit=20] - Number of merchants per page
 * @param {number} [options.offset=0] - Offset for pagination
 */
export const getStampMerchantsListApi = async ({ limit = 20, offset = 0 } = {}) => {
  const token = await getToken();
  const params = {
    token,
    limit,
    offset,
  };

  if (__DEV__) {
    console.log('[STAMP_API] getStampMerchantsListApi (limit=' + limit + ', offset=' + offset + ')');
  }

  const response = await instance.post('/customer/stamp/merchants/list', {
    params,
  });
  console.log('getStampMerchantsListApi response', response)
  if (!response?.data) {
    throw new Error('Network error: No response received');
  }

  const result = response.data.result;
  if (result?.status === 'error' || result?.error) {
    throw new Error(result?.error || result?.message || 'Failed to fetch stamp merchants');
  }

  return result || {};
};

/**
 * Fetches all available stamp programs & customer live progress for a specific merchant.
 * POST /go/api/customer/stamp/programs
 * @param {number|string} merchantId - Selected merchant partner ID
 */
export const getMerchantStampProgramsApi = async (merchantId) => {
  const token = await getToken();
  const params = {
    token,
    merchant_id: Number(merchantId),
  };

  if (__DEV__) {
    console.log('[STAMP_API] getMerchantStampProgramsApi (merchantId=' + merchantId + ')');
  }

  const response = await instance.post('/customer/stamp/programs', {
    params,
  });
  console.log('getMerchantStampProgramsApi response', response.data.result)
  if (!response?.data) {
    throw new Error('Network error: No response received');
  }

  const result = response.data.result;
  if (result?.status === 'error' || result?.error) {
    throw new Error(result?.error || result?.message || 'Failed to fetch merchant stamp programs');
  }

  return result || {};
};

/**
 * Fetches customer stamp cards and rolling progress (active cards or past redemption history).
 * POST /go/api/customer/stamps
 * @param {number|Object} [optionsOrMerchantId] - Merchant ID or options object
 * @param {number} [optionsOrMerchantId.merchantId] - Optional merchant filter
 * @param {string} [optionsOrMerchantId.status='active'] - 'active' | 'history' | 'all'
 */
export const getCustomerStampsApi = async (optionsOrMerchantId) => {
  const token = await getToken();

  let merchantId = null;
  let status = 'active';

  if (typeof optionsOrMerchantId === 'object' && optionsOrMerchantId !== null) {
    merchantId = optionsOrMerchantId.merchantId;
    status = optionsOrMerchantId.status || 'active';
  } else if (optionsOrMerchantId !== undefined && optionsOrMerchantId !== null) {
    merchantId = optionsOrMerchantId;
  }

  const params = { token, status };
  if (merchantId) {
    params.merchant_id = Number(merchantId);
  }

  if (__DEV__) {
    console.log('[STAMP_API] getCustomerStampsApi (status=' + status + ', merchantId=' + merchantId + ')');
  }

  const response = await instance.post('/customer/stamps', {
    params,
  });

  if (!response?.data) {
    throw new Error('Network error: No response received');
  }

  const result = response.data.result;
  if (result?.status === 'error' || result?.error) {
    throw new Error(result?.error || result?.message || 'Failed to fetch stamp cards');
  }

  let list = [];
  if (Array.isArray(result?.data)) {
    list = result.data;
  } else if (Array.isArray(result?.data?.data)) {
    list = result.data.data;
  } else if (Array.isArray(result?.history)) {
    list = result.history;
  } else if (Array.isArray(result?.cards)) {
    list = result.cards;
  } else if (Array.isArray(result)) {
    list = result;
  }

  if (__DEV__) {
    console.log(`[STAMP_API] getCustomerStampsApi (status="${status}") -> items count:`, list.length);
  }
  return list;
};

