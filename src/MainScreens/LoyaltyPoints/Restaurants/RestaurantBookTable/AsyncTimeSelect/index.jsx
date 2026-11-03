import {useEffect, useState} from "react";
import FormikHorizontalTimes from "../../../../../components/Formik/FormikHorizontalTimes"
import {getRestaurantSlots} from "../../../../../api/restaurants";
import {removePastTimes} from "../../../helpers";

const AsyncFormikTimeSelect = ({name, restaurant_id, booking_date, label}) => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    console.log(booking_date,'booking date')


    const getSlots = async () => {
        try{
            setLoading(true);

           const slots = await getRestaurantSlots(restaurant_id, booking_date);

           const filteredSlots = removePastTimes(slots);

            if(filteredSlots?.length){
               setSlots(filteredSlots);
            }

        }catch(err){
         console.log(err,'get restaurant slots error')
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
      getSlots();
    },[restaurant_id, booking_date])

    return (
        <FormikHorizontalTimes name={name} times={slots} loading={loading} label={label}/>
    )
};

export default AsyncFormikTimeSelect;