import { useEffect, useState } from 'react';
import { getMerchantFeedbackSummary } from '../api/merchants';

const cache = new Map();
const listeners = new Map();

const setEntry = (merchantId, entry) => {
  cache.set(merchantId, entry);
  listeners.get(merchantId)?.forEach(listener => listener(entry));
};

const load = merchantId => {
  const previousData = cache.get(merchantId)?.data ?? null;

  setEntry(merchantId, {
    status: previousData ? 'success' : 'loading',
    data: previousData,
    inFlight: true,
  });

  return getMerchantFeedbackSummary(merchantId)
    .then(data => {
      setEntry(merchantId, { status: 'success', data, inFlight: false });
    })
    .catch(err => {
      console.log('Feedback summary error:', err?.message);
      setEntry(merchantId, {
        status: previousData ? 'success' : 'error',
        data: previousData,
        inFlight: false,
      });
    });
};

export const refreshMerchantFeedbackSummary = merchantId =>
  merchantId ? load(merchantId) : Promise.resolve();

const useMerchantFeedbackSummary = merchantId => {
  const [entry, setLocalEntry] = useState(() => cache.get(merchantId));

  useEffect(() => {
    if (!merchantId) {
      return;
    }

    if (!listeners.has(merchantId)) {
      listeners.set(merchantId, new Set());
    }
    const merchantListeners = listeners.get(merchantId);
    merchantListeners.add(setLocalEntry);

    const current = cache.get(merchantId);
    setLocalEntry(current);

    if (!current?.inFlight && merchantListeners.size === 1) {
      load(merchantId);
    }

    return () => {
      merchantListeners.delete(setLocalEntry);
    };
  }, [merchantId]);

  return {
    summary: entry?.data ?? null,
    status: entry?.status ?? 'loading',
  };
};

export default useMerchantFeedbackSummary;
