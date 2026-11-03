import i18next from "i18next";
import {bookTableInRestaurant, createOrder, orderCancel, orderUpdate, restaurantBookingUpdate} from "../../api/restaurants";
import {navigate} from "../../Navigation/RootNavigation";
import {setRestaurantLoading} from "./restaurant-actions";
import {showMessage} from "react-native-flash-message";
import {getAmountInfo} from "../../MainScreens/LoyaltyPoints/helpers";
import {setMarchantOrderDetails} from "../loyalty/loyalty-actions";
import { org } from "../../org/config";

export const restaurantBook =
  (restaurant_id) => async (dispatch, getState) => {
    dispatch(setRestaurantLoading(true));

    try {
      const state = getState();
      const { user } = state.authReducer;
      const { order_type, delivery, takeaway, reservation } =
        state.restaurantReducer;
      const loyaltyState = state.loyaltyReducer;

      const discountPercentage =
        loyaltyState?.merchantDiscount?.rule?.discount_percentage;

      const buildReturnUrl = (usedPoints, total_amount) =>
        `${org.urlScheme}restaurant-payment-result?usedPoints=${usedPoints}&totalAmount=${total_amount}`;

      const handleResponse = (res) => {
        if (!res?.success) throw res.error;

        const orderReference = res.data?.reference;
        const orderId = res?.data?.order_id || res?.data?.booking_id;

        console.log(res?.data,'create order response')

        console.log(orderReference,'orderReference');
        console.log(orderId,'orderId')

        if(orderReference && orderId){
          console.log('save to redux')
          dispatch(setMarchantOrderDetails(orderReference, orderId))
        }

        navigate("restaurant-skipcache", {
          payment_url: res.data?.payment_url,
        });
      };

      const mapItems = (items, quantity, notes) =>
        items.map((item) => ({
          item_id: item.id,
          quantity,
          notes,
          ...item,
        }));

      const handlers = {
        reservation: async () => {
  
          const { total_amount, usedPoints, amount, discount } = getAmountInfo(
            reservation.items,
            {
              order_type,
              discountPercentage,
              bookingFee: reservation.bookingFee,
            }
          );

          const body = {
            restaurant_id,
            customer_name: user.name,
            customer_phone: user.phone,
            datetime: reservation.datetime,
            guests: reservation.guests,
            occasion: reservation.occasion,
            child_count: reservation.child_count,
            seating_preference_id:
              reservation.seating_preference_id,
            special_request: reservation.note,
            return_url: buildReturnUrl(usedPoints, total_amount),
            total_amount,
            items: reservation.items,
            amount,
            discount
          };

          const res = await bookTableInRestaurant(body);
          handleResponse(res);
        },

        delivery: async () => {
          const { total_amount, usedPoints } = getAmountInfo(
            delivery.items,
            { order_type, discountPercentage }
          );

          const body = {
            restaurant_id,
            order_type: "delivery",
            customer_name: user.name,
            customer_phone: user.phone,
            unit_number: delivery.unit_number,
            building_number: delivery.building_number,
            zone_number: delivery.zone_number,
            street_number: delivery.street_number,
            latitude: delivery.latitude,
            longitude: delivery.longitude,
            items: mapItems(
              delivery.items,
              delivery.quantity,
              delivery.special_instructions
            ),
            return_url: buildReturnUrl(usedPoints, total_amount),
            total_amount,
          };

          const res = await createOrder(restaurant_id, body);
          handleResponse(res);
        },

        takeaway: async () => {
          const { total_amount, usedPoints } = getAmountInfo(
            takeaway.items,
            { order_type, discountPercentage }
          );

          const body = {
            restaurant_id,
            order_type: "takeaway",
            customer_name: user.name,
            customer_phone: user.phone,
            special_instructions: takeaway.special_instructions,
            items: mapItems(
              takeaway.items,
              takeaway.quantity,
              takeaway.special_instructions
            ),
            return_url: buildReturnUrl(usedPoints, total_amount),
            total_amount,
          };

          const res = await createOrder(restaurant_id, body);
          handleResponse(res);
        },
      };

      if (handlers[order_type]) {
        await handlers[order_type]();
      }
    } catch (error) {
      showMessage({
        type: "danger",
        message:
          typeof error === "string"
            ? error
            : i18next.t("General.error"),
      });

      console.log(error, "book restaurant error");
    } finally {
      dispatch(setRestaurantLoading(false));
    }
  };

export const updateOrderThunk = (params) => async (dispatch) => {
  try {
    dispatch(setRestaurantLoading(true));
    const res = await orderUpdate(params);
    console.log(res,'order update res')
    const error = res?.error;

    if(error){
        throw error
    }

    return {success: res?.success}
    
  } catch (error) {
     showMessage({
        type: 'danger',
        message: typeof error === 'string' ? error : i18next.t('General.error')
     })

    console.log(error, 'book restaurant error');
  } finally {
    dispatch(setRestaurantLoading(false));
  }
};

export const cancelOrderThunk = (order_ref) => async (dispatch) => {
  try {
    dispatch(setRestaurantLoading(true));
    const res = await orderCancel(order_ref);
    const error = res?.error;

    if(error){
        throw error
    }

    return {success: res?.success}
    
  } catch (error) {
     showMessage({
        type: 'danger',
        message: typeof error === 'string' ? error : i18next.t('General.error')
     })

    console.log(error, 'cancel order error');
  } finally {
    dispatch(setRestaurantLoading(false));
  }
};

export const updateReservationThunk = (booking_id) => async (dispatch, getState) => {

            try{
                  dispatch(setRestaurantLoading(true));

                  const {reservation} = getState().restaurantReducer;

                  const body = {
                     datetime: reservation.datetime,
                     guests: reservation.guests,
                     occasion: reservation.occasion,
                     child_count: reservation.child_count,
                     seating_preference_id : reservation.seating_preference_id,
                     special_request: reservation.note,
                     booking_id,
                     items: reservation.items.map(item => ({item_id: item.id, quantity: item.quantity, ...item}))
                  };


                  const res = await restaurantBookingUpdate(body);
    
    
                  console.log(res,'rebook reservation')
    
    
                  if(!res?.success){
                   throw(res.error);  
                  };

                  
    
                 return {success: true}

            }catch(err){
                console.log(err,'rebook error')

            }finally{
              dispatch(setRestaurantLoading(false));
            }
    
}