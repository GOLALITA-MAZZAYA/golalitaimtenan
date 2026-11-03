import {SET_MERCHANT_DISCOUNT_PERCENTAGE, SET_MERCHANT_ORDER_DETAILS, SET_MERCHANT_POINT_RATE, SET_USER_LOYALTY_POINTS, TOGGLE_MERCHANT_POINT_DISCOUNT_ENABLED, TOGGLE_MERCHANT_POINTS_DISCOUNT} from "./loyalty-types";

export const setMerchantDiscount = (discount) => ({
  type: SET_MERCHANT_DISCOUNT_PERCENTAGE,
  discount
});

export const setMerchantsPointRate = (pointRate) => ({
  type: SET_MERCHANT_POINT_RATE,
  pointRate
});

export const setUserLoayltyPoints = (points) => ({
  type: SET_USER_LOYALTY_POINTS,
  points
});

export const toggleMerchantPointDiscount = () => ({
  type: TOGGLE_MERCHANT_POINT_DISCOUNT_ENABLED,
})

export const setMarchantOrderDetails = (orderReference, orderId) => ({
  type: SET_MERCHANT_ORDER_DETAILS,
  orderReference, orderId
})
