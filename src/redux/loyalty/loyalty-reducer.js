import {SET_MERCHANT_DISCOUNT_PERCENTAGE, SET_MERCHANT_DISCOUNT_PERCENTAGE_LOADING, SET_MERCHANT_ORDER_DETAILS, SET_MERCHANT_POINT_RATE, SET_USER_LOYALTY_POINTS, TOGGLE_MERCHANT_POINT_DISCOUNT_ENABLED} from "./loyalty-types";

const initialState = {
   merchantDiscount: null,
   loading: false,
   isPointsEnabled: false,
   pointRate: 0,
   userPoints: 0,
   orderReference: null,
   orderId: null
};

export const loyaltyReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MERCHANT_DISCOUNT_PERCENTAGE:
      return { ...state, merchantDiscount: action.discount, loading: false };
    case SET_MERCHANT_DISCOUNT_PERCENTAGE_LOADING:
      return { ...state, loading: action.loading };
    case SET_MERCHANT_POINT_RATE:
      return { ...state, pointRate: action.pointRate }
    case TOGGLE_MERCHANT_POINT_DISCOUNT_ENABLED: {
      return {...state, isPointsEnabled: !state.isPointsEnabled }
    }
    case SET_USER_LOYALTY_POINTS:
      return {...state, userPoints: action.points}
    case SET_MERCHANT_ORDER_DETAILS:
      return {...state, orderReference: action.orderReference, orderId: action.orderId}
    default:
      return state;
  }
};
