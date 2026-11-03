import {useEffect, useState} from "react";
import {getMerchantById} from "../api/merchants";

const useMerchantDetails = (id) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState(null)

    const getMerchantDataById = async () => {
        try{
          setLoading(true);

          const data = await getMerchantById(id);

          setData(data);

        }catch(err){
            setError(err);
            console.log(err,'errror')
        }finally{
          setLoading(false);
        }
    }


    useEffect(() => {

        getMerchantDataById()

    },[id])

    return {loading, data, error}
};

export default useMerchantDetails;