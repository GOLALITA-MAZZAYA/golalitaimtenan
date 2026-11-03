import {useEffect, useState} from "react";
import {getClinicById} from "../../../../api/clinics";

const useClinicDetails = (id) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState(null)

    const getClinic = async () => {
        try{
          setLoading(true);

          const data = await getClinicById(id);

          setData(data);

        }catch(err){
            setError(err);
            console.log(err,'errror')
        }finally{
          setLoading(false);
        }
    }


    useEffect(() => {

        getClinic()

    },[id])

    return {loading, data, error}
};

export default useClinicDetails;