import {ADD_FOOD_ITEM_TO_FORM, CLEAR_RESTAURANT_STATE, REMOVE_FOOD_ITEM_FROM_FORM, SET_DELIVERY_FIELD, SET_DELIVERY_FIELDS, SET_ORDER_TYPE, SET_RESERVATION_FIELD, SET_RESERVATION_FIELDS, SET_RESTAURANT_LOADING, SET_TAKEAWAY_FIELD, SET_TAKEAWAY_FIELDS} from "./restaurant-types"

export const setOrderType = (payload) => ({
  type: SET_ORDER_TYPE,
  payload,
});

export const setRestaurantLoading = (loading) => ({
  type: SET_RESTAURANT_LOADING,
  loading,
});

export const setReservationField = (name, value) => ({
  type: SET_RESERVATION_FIELD,
  payload: {name, value}
});

export const setReservationFields = (data) => ({
  type: SET_RESERVATION_FIELDS,
  data
});

export const setDeliveryField = (name, value) => ({
  type: SET_DELIVERY_FIELD,
  payload: {name, value}
});

export const setDeliveryFields = (data) => ({
  type: SET_DELIVERY_FIELDS,
  data
});

export const setTakeawayField = (name, value) => ({
  type: SET_TAKEAWAY_FIELD,
  payload: {name, value}
});

export const setTakeawayFields = (name, value) => ({
  type: SET_TAKEAWAY_FIELDS,
  payload: {name, value}
});

export const addFoodItemToForm = (name,item) => ({
  type: ADD_FOOD_ITEM_TO_FORM,
  payload: {item, name}
});

export const removeFoodItemFromForm = (name, item) => ({
  type: REMOVE_FOOD_ITEM_FROM_FORM,
  payload: {item, name}
});


export const clearRestaurantStore = () => ({
  type: CLEAR_RESTAURANT_STATE,
});

