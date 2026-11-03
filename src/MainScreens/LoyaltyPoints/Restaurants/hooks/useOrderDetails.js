import { useEffect, useState, useCallback } from "react";
import { getOrderStatus } from "../../../../api/restaurants";

const useOrderDetails = (booking_reference, { enabled = true } = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getDetails = useCallback(async () => {
    if (!booking_reference) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getOrderStatus(booking_reference);
      console.log(response,'response')
      setData(response);
    } catch (err) {
      setError(err);
      console.log(err, "error");
    } finally {
      setLoading(false);
    }
  }, [booking_reference]);

  useEffect(() => {
    if (!enabled) return;

    getDetails();
  }, [enabled, getDetails]);

  return {
    loading,
    data,
    error,
    refetch: getDetails, // manual trigger
  };
};

export default useOrderDetails;