import { Platform } from 'react-native';
import instance from '../redux/instance';
import store from '../redux/store';
import { logger } from '../utils/logger';

// A cold start triggered directly by tapping a killed-state push notification
// calls this before Redux has finished rehydrating the auth token from
// storage — the token check below would otherwise silently drop the very
// event we most want to capture. Give hydration a brief window to finish.
const waitForToken = (timeoutMs = 4000) =>
  new Promise(resolve => {
    const existing = store.getState().authReducer.token;
    if (existing) {
      resolve(existing);
      return;
    }

    const timer = setTimeout(() => {
      unsubscribe();
      resolve(store.getState().authReducer.token || null);
    }, timeoutMs);

    const unsubscribe = store.subscribe(() => {
      const { token } = store.getState().authReducer;
      if (token) {
        clearTimeout(timer);
        unsubscribe();
        resolve(token);
      }
    });
  });

// Fire-and-forget wrapper around POST /user/activity/track.
// Never throws — tracking failures must not surface to the user or block
// the action that triggered them. Guests (no token) are skipped.
const trackActivity = async (event_type, options = {}) => {
  try {
    let { token } = store.getState().authReducer;
    if (!token) {
      token = await waitForToken();
    }
    if (!token) return;

    const {
      reference,
      page_name,
      merchant_id,
      product_id,
      offer_id,
      search_query,
      amount,
      currency_id,
      latitude,
      longitude,
      metadata,
    } = options;

    const params = {
      token,
      event_type,
      device_type: Platform.OS,
    };

    if (reference != null) params.reference = String(reference);
    if (page_name) params.page_name = page_name;
    if (merchant_id != null) params.merchant_id = merchant_id;
    if (product_id != null) params.product_id = product_id;
    if (offer_id != null) params.offer_id = offer_id;
    if (search_query != null) params.search_query = search_query;
    if (amount != null) params.amount = amount;
    if (currency_id != null) params.currency_id = currency_id;
    if (latitude != null) params.latitude = latitude;
    if (longitude != null) params.longitude = longitude;
    if (metadata && Object.keys(metadata).length) params.metadata = metadata;

    const res = await instance.post('/user/activity/track', {
      jsonrpc: '2.0',
      params,
    });
    logger.debug('trackActivity success', event_type, res?.data?.result);
  } catch (error) {
    logger.debug('trackActivity failed', event_type, error?.message);
  }
};

export default trackActivity;
