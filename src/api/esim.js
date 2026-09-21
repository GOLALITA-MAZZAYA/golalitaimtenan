import { getAuthToken } from '../utils/tokenStorage';
import instance from '../redux/instance';

const unwrap = res => {
  const payload = res?.data;
  if (payload?.success === false) {
    const message =
      payload?.error?.message || payload?.message || 'eSIM request failed';
    const error = new Error(message);
    error.code = payload?.error?.code;
    throw error;
  }
  if (payload?.data !== undefined) {
    return payload.data;
  }
  if (payload?.result !== undefined) {
    return payload.result;
  }
  return payload;
};

const postEsim = async (path, params = {}, { auth = false } = {}) => {
  const body = { params: { ...params } };
  if (auth) {
    body.params.token = await getAuthToken();
  }
  const res = await instance.post(path, body);
  return unwrap(res);
};

export const getEsimDestinations = (params = {}) =>
  postEsim('/esim/v1/destinations', params);

const DESTINATIONS_PAGE_SIZE = 200;

export const getAllEsimDestinations = async (params = {}) => {
  const items = [];
  let page = 1;
  let total = Infinity;

  while (items.length < total) {
    const data = await getEsimDestinations({
      ...params,
      page,
      limit: DESTINATIONS_PAGE_SIZE,
    });

    console.log(data,'countries')
    const batch = Array.isArray(data?.items) ? data.items : [];
    const reportedTotal = Number(data?.total);
    total = Number.isFinite(reportedTotal) ? reportedTotal : batch.length;
    items.push(...batch);
    if (!batch.length || batch.length < (Number(data?.limit) || DESTINATIONS_PAGE_SIZE)) {
      break;
    }
    page += 1;
  }

  return { items };
};

let cachedLocalDestinations = null;
let cachedLocalDestinationsRequest = null;

export const getCachedLocalEsimDestinations = () => {
  if (cachedLocalDestinations) {
    return Promise.resolve(cachedLocalDestinations);
  }
  if (!cachedLocalDestinationsRequest) {
    cachedLocalDestinationsRequest = getAllEsimDestinations({ type: 'local' })
      .then(data => {
        cachedLocalDestinations = Array.isArray(data?.items) ? data.items : [];
        return cachedLocalDestinations;
      })
      .catch(error => {
        cachedLocalDestinationsRequest = null;
        throw error;
      });
  }
  return cachedLocalDestinationsRequest;
};

export const getEsimPackages = (params = {}) =>
  postEsim('/esim/v1/packages', params);

export const getEsimPackageDetail = package_id =>
  postEsim('/esim/v1/packages/detail', { package_id });

export const getEsimCompatibleDevices = (params = {}) =>
  postEsim('/esim/v1/compatible-devices', params);

export const checkoutEsim = (package_id, return_url) =>
  postEsim(
    '/esim/v1/checkout',
    { package_id, return_url },
    { auth: true },
  );

export const getEsimOrderStatus = order_reference =>
  postEsim('/esim/v1/orders/status', { order_reference }, { auth: true });

export const getEsimOrders = (params = {}) =>
  postEsim('/esim/v1/orders', params, { auth: true });

export const getEsimProfile = order_reference =>
  postEsim('/esim/v1/orders/esim', { order_reference }, { auth: true });

export const getEsimInstructions = order_reference =>
  postEsim('/esim/v1/orders/instructions', { order_reference }, { auth: true });

export const getEsimTopups = order_reference =>
  postEsim('/esim/v1/orders/topups', { order_reference }, { auth: true });

export const checkoutEsimTopup = ({
  order_reference,
  topup_package_id,
  return_url,
}) =>
  postEsim(
    '/esim/v1/orders/topups/checkout',
    { order_reference, topup_package_id, return_url },
    { auth: true },
  );

export const getEsimTopupStatus = topup_reference =>
  postEsim('/esim/v1/topups/status', { topup_reference }, { auth: true });

export const getEsimTopupHistory = order_reference =>
  postEsim(
    '/esim/v1/orders/topups/history',
    { order_reference },
    { auth: true },
  );

export const getEsimPackageHistory = order_reference =>
  postEsim(
    '/esim/v1/orders/package-history',
    { order_reference },
    { auth: true },
  );

export const getEsimReturnUrl = () =>
  'https://www.golalita.com/esim/payment/callback';
