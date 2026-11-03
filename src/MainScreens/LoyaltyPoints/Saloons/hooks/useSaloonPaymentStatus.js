import {useEffect, useState} from "react";
import {checkSaloonPaymentStatus} from "../../../../api/saloons";

const useSallonPaymentStatus = (appointmentId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState(null)

    const getStatus = async () => {
        try{
          setLoading(true);

          const data = await checkSaloonPaymentStatus(appointmentId);

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

export default useSallonPaymentStatus;