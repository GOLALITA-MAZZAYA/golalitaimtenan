import {
  ADD_RODUCT_IN_CART,
  CALCULATE_ORDER_PRICE,
  CLEAR_PRODUCT_CART,
  REMOVE_PRODUCT_FROM_CART,
  SET_VOUCHER_DISCOUNT,
  SET_DELIVERY_ACTIVE_TAB,
} from "./cart-types";

export const addProductInCart = (payload) => ({
  type: ADD_RODUCT_IN_CART,
  payload,
});

export const removeProductFromCart = (payload) => ({
  type: REMOVE_PRODUCT_FROM_CART,
  payload,
});

export const clearProductCart = () => ({
  type: CLEAR_PRODUCT_CART,
});

export const calculateOrderPrice = () => ({
  type: CALCULATE_ORDER_PRICE,
});

export const setVoucherDiscount = (voucher) => ({
  type: SET_VOUCHER_DISCOUNT,
  voucher,
});

export const setActiveTab = (activeTab) => ({
  type: SET_DELIVERY_ACTIVE_TAB,
  activeTab,
});
