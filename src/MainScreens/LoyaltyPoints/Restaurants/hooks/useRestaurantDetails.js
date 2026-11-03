import { useEffect, useState, useCallback } from "react";
import { getRestaurantById } from "../../../../api/restaurants";

const useRestaurantDetails = (restaurant_id, { enabled = true } = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getDetails = useCallback(async () => {
    if (!restaurant_id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getRestaurantById(restaurant_id);
      setData(response);
    } catch (err) {
      setError(err);
      console.log(err, "error");
    } finally {
      setLoading(false);
    }
  }, [restaurant_id]);

  useEffect(() => {
    if (!enabled) return;

    getDetails();
  }, [enabled, getDetails]);

  return {
    loading,
    data,
    error,
  };
};

export default useRestaurantDetails;