import {
  ADD_TO_GLOBALTIX_CART,
  REMOVE_FROM_GLOBALTIX_CART,
  UPDATE_GLOBALTIX_CART_QUANTITY,
  CLEAR_GLOBALTIX_CART,
  CALCULATE_GLOBALTIX_CART_TOTAL,
  CART_CLEARED_FOR_NEW_ATTRACTION,
} from "./globalTix-cart-types";

export const addToGlobalTixCart = (payload) => ({
  type: ADD_TO_GLOBALTIX_CART,
  payload,
});

export const removeFromGlobalTixCart = (payload) => ({
  type: REMOVE_FROM_GLOBALTIX_CART,
  payload,
});

export const updateGlobalTixCartQuantity = (payload) => ({
  type: UPDATE_GLOBALTIX_CART_QUANTITY,
  payload,
});

export const clearGlobalTixCart = () => ({
  type: CLEAR_GLOBALTIX_CART,
});

export const calculateGlobalTixCartTotal = () => ({
  type: CALCULATE_GLOBALTIX_CART_TOTAL,
});

export const cartClearedForNewAttraction = (newAttractionName) => ({
  type: CART_CLEARED_FOR_NEW_ATTRACTION,
  payload: { newAttractionName },
});



