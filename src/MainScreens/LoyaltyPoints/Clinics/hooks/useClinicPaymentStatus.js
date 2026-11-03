import {useEffect, useState} from "react";
import {checkClinicPaymentStatus} from "../../../../api/clinics";

const useClinicAppointmentStatus = (appointmentId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState(null)

    const getStatus = async () => {
        console.log('get status func start')
        try{
          setLoading(true);

          console.log('after loading')

          const data = await checkClinicPaymentStatus(appointmentId);

          console.log(data,'useClinicAppointmentStatus func')

          setData(data);

        }catch(err){
            setError(err);
            console.log(err,'error')
        }finally {
          setLoading(false);
        }
    }

    useEffect(() => {
        getStatus()
    },[appointmentId])

    return {loading, data, error}
};

export default useClinicAppointmentStatus;