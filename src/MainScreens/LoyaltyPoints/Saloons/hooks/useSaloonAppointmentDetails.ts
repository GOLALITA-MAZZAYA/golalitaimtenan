import {useEffect, useState} from "react";
import { getSaloonAppointmentDetails} from "../../../../api/saloons";

const useSaloonAppointmentDetails = (appointmentId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState(null)

    const getDetails = async () => {
        try{
          setLoading(true);

          const data = await getSaloonAppointmentDetails(appointmentId);

          setData(data);

        }catch(err){
            setError(err);
            console.log(err,'error')
        }finally {
          setLoading(false);
        }
    }

    useEffect(() => {
        getDetails()

    },[appointmentId])

    return {loading, data, error}
};

export default useSaloonAppointmentDetails;