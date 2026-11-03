import React from "react";
import {
    Dimensions,
  StyleSheet,
  View,
} from "react-native";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import {HEADER_HEIGHT} from "../../../../constants";
import {useDispatch, useSelector} from "react-redux";
import {userSelector} from "../../../../redux/auth/auth-selectors";
import {INITIAL_VALUES} from "./config";
import {getValidation} from "./validation";
import TakeawayForm from "./TakeAwayForm";
import ReservationForm from "./ReservationForm";
import DeliveryForm from "./DeliveryForm";
import {selectOrderType} from "../../../../redux/restaurant/restaurant-selectors";
import {setReservationFields} from "../../../../redux/restaurant/restaurant-actions";
import {restaurantBook} from "../../../../redux/restaurant/restaurant-thunks";
import {confirmAction} from "../../../../helpers";

const RestaurantBookTable = ({ route, navigation }) => {
  const restaurantId = route?.params?.restaurantId;
  const booking_id = route?.params?.booking_id;
  const bookingFee =  route?.params?.bookingFee;
  const user = useSelector(userSelector);
  const { t } = useTranslation();
  const orderType = useSelector(selectOrderType);
  const dispatch = useDispatch();


  const handleSubmit = async ({ guests, child_count, date, time, seating_preference_id, occasion, note, bookingFee}) => {        
        if(orderType === 'reservation' && booking_id){
           dispatch(setReservationFields({
            restaurant_id: restaurantId,
            customer_name: user.name,
            customer_phone: user.phone,
            datetime: `${date} ${time}:00`,
            guests,
            occasion,
            child_count,
            seating_preference_id,
            special_request: note,
          }))

          navigation.navigate('booking-restaurant-appointment-food-list',{ restaurantId, bookingId:  booking_id});

          return
        }


        if(orderType === 'reservation'){
          
          dispatch(setReservationFields({
            restaurant_id: restaurantId,
            customer_name: user.name,
            customer_phone: user.phone,
            datetime: `${date} ${time}:00`,
            guests,
            occasion,
            child_count,
            seating_preference_id,
            special_request: note,
            bookingFee: bookingFee
          }))

          confirmAction({
              message: t('Restaurants.preOrder'),
              title: t('Restaurants.reservationConfirmed'),
              cancelText: t('Restaurants.no'),
              okText: t('Restaurants.yes'),
              onConfirm: () => navigation.navigate('restaurant-book-food-list',{ restaurantId }),
              onCancel: () => dispatch(restaurantBook(restaurantId))
          });

          

          return
        }

        if(orderType === 'delivery'){
          navigation.navigate('restaurant-delivery-address-list',{ restaurantId });

          return
        }

        if(orderType === 'takeaway'){
          dispatch(restaurantBook(restaurantId));
          return
        }

      };
  
      

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validationSchema={getValidation()}
      onSubmit={handleSubmit}
    > 
    <>      
        <View style={{flex: 1}}>
              {orderType === 'reservation' && <ReservationForm restaurantId={restaurantId} bookingFee={bookingFee}/>}

              {orderType === 'delivery' && <DeliveryForm restaurantId={restaurantId} />}

              {orderType === 'takeaway' && <TakeawayForm restaurantId={restaurantId} /> }   
        </View> 
    </>        
    </Formik>
  );
};

const styles = StyleSheet.create({
     list: {
       paddingHorizontal: 20
     },
     blockMargin: {
        marginTop: 20
     },
     submitBtn: {
        marginTop: 27
     },
     loader: {
         width: "100%",
         height: Dimensions.get("window").height,
         top: -HEADER_HEIGHT,
    },
});


export default RestaurantBookTable;
