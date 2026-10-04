import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

const storageKey = (userId, merchantId) =>
  `merchant_review:${userId}:${merchantId}`;

const useMyMerchantReview = merchantId => {
  const user = useSelector(state => state.authReducer.user);
  const userId = user?.partner_id || user?.id || user?.email;
  const [review, setReview] = useState(null);

  useEffect(() => {
    setReview(null);
    if (!userId || !merchantId) {
      return;
    }

    let cancelled = false;

    AsyncStorage.getItem(storageKey(userId, merchantId))
      .then(raw => {
        if (!cancelled && raw) {
          setReview(JSON.parse(raw));
        }
      })
      .catch(err => console.log('My review read error:', err?.message));

    return () => {
      cancelled = true;
    };
  }, [userId, merchantId]);

  const saveReview = useCallback(
    async ({ rating, comment }) => {
      const next = { rating, comment, updated_at: new Date().toISOString() };
      setReview(next);
      if (userId && merchantId) {
        try {
          await AsyncStorage.setItem(
            storageKey(userId, merchantId),
            JSON.stringify(next),
          );
        } catch (err) {
          console.log('My review save error:', err?.message);
        }
      }
    },
    [userId, merchantId],
  );

  const clearReview = useCallback(async () => {
    setReview(null);
    if (userId && merchantId) {
      try {
        await AsyncStorage.removeItem(storageKey(userId, merchantId));
      } catch (err) {
        console.log('My review clear error:', err?.message);
      }
    }
  }, [userId, merchantId]);

  return { review, saveReview, clearReview };
};

export default useMyMerchantReview;
