import {useEffect, useState} from "react";
import {getRestaurantBookingStatus} from "../../../api/restaurants";

const useRestaurantBookingInfo = (reference) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState({})

    const getAppointment = async () => {
        try{
          setLoading(true);

          const data = await getRestaurantBookingStatus(reference);

          setData(data);

        }catch(err){
            setError(err);
            console.log(err,'error')
        }finally{
          setLoading(false);
        }
    }


    useEffect(() => {

        getAppointment()

    },[reference])

    return {loading, data, error}
};

export default useRestaurantBookingInfo;