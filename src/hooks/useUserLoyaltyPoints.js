import {useEffect, useState} from "react"
import {getUserPoints} from "../api/loyalty";

const useUserLoyaltyPoints = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [points, setPoints] = useState(0);

    const getUserPointsApiCall = async () => {
        try{
            setLoading(true);
         const points = await getUserPoints();

         if(!points){
           throw 'Get user points error'
         }

         setPoints(points)

        }catch(err){
         setError(err)
        }finally{
          setLoading(false)
        }
    }

    useEffect(() => {
       getUserPointsApiCall();
    },[])

    return {points, loading, error}
};

export default useUserLoyaltyPoints;