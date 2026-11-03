import { useEffect, useState, useCallback } from "react";
import { getAppointmentDetails } from "../../../../api/clinics";

const useAppointmentDetails = (booking_reference, enabled = true) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getAppointment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAppointmentDetails(booking_reference);
      setData(res);
    } catch (err) {
      setError(err);
      console.log(err, "error");
    } finally {
      setLoading(false);
    }
  }, [booking_reference]);

  useEffect(() => {
    if (!enabled || !booking_reference) return;

    getAppointment();
  }, [booking_reference, enabled, getAppointment]);

  return { loading, data, error};
};

export default useAppointmentDetails;