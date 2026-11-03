import {useEffect, useState} from "react";
import {getDoctors} from "../../../../api/clinics";

const useDoctors = (clinicId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState(null)

    const getDoctorsList = async () => {
        try{
          setLoading(true);

          const data = await getDoctors(clinicId);

          setData(data);

        }catch(err){
            setError(err);
            console.log(err,'errror')
        }finally{
          setLoading(false);
        }
    }


    useEffect(() => {

        getDoctorsList()

    },[])

    return {loading, data, error}
};

export default useDoctors;