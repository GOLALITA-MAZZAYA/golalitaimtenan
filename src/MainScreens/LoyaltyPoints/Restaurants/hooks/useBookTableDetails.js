import { useEffect, useState, useCallback } from "react";
import {getRestaurantBookingStatus} from "../../../../api/restaurants";

const useBookTableDetails = (
  booking_reference,
  { enabled = true } = {}
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getDetails = useCallback(async () => {
    if (!booking_reference) return;

    try {
      setLoading(true);
      setError(null);
      console.log('before')

      const response = await getRestaurantBookingStatus(booking_reference);
      console.log(response,'getRestaurantBookingStatus')
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
  }, [enabled, getDetails, booking_reference]);

  return {
    loading,
    data,
    error,
  };
};

export default useBookTableDetails;