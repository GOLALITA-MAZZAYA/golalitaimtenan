import { useEffect, useState, useCallback } from "react";
import {getMerchantMatrixDiscount} from "../../../../api/merchants";

const useMerchantMatrixDiscount = (merchantId, { enabled = true } = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getDiscount = useCallback(async () => {
    if (!merchantId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getMerchantMatrixDiscount(merchantId);
      setData(response);
    } catch (err) {
      setError(err);
      console.log(err, "error");
    } finally {
      setLoading(false);
    }
  }, [merchantId]);

  useEffect(() => {
    if (!enabled) return;

    getDiscount();
  }, [enabled, getDiscount]);

  return {
    loading,
    data,
    error,
  };
};

export default useMerchantMatrixDiscount;