import {useEffect, useState} from "react";
import { verifySkipcachePayment } from "../../../../api/restaurants";

const useOrderPaymentStatus = (bookingId, orderRef, orderType) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState(null)

    const getDetails = async () => {
        try{
          setLoading(true);

          const data = await verifySkipcachePayment(bookingId, orderRef, orderType);

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

    },[bookingId, orderRef])

    return {loading, data, error}
};

export default useOrderPaymentStatus;