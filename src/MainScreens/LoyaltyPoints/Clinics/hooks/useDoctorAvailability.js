import {useEffect, useState} from "react";
import {getDoctorAvailability} from "../../../../api/clinics";
import {removePastTimes} from "../../helpers";

const useDoctorAvailability = (doctorId, date) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState([])

    const getAvailabilityList = async () => {
        try{
          setLoading(true);

          const data = await getDoctorAvailability(doctorId, date);

          const availableTimes = removePastTimes(data);

          setData(availableTimes);

        }catch(err){
            setError(err);
            console.log(err,'errror')
        }finally{
          setLoading(false);
        }
    }


    useEffect(() => {
        getAvailabilityList()

    },[doctorId, date])

    return {loading, data, error}
};

export default useDoctorAvailability;