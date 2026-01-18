import {
  addToGlobalTixCart,
  removeFromGlobalTixCart,
  updateGlobalTixCartQuantity,
  clearGlobalTixCart,
  calculateGlobalTixCartTotal,
} from "./globalTix-cart-actions";

export const addToGlobalTixCartThunk = (payload) => (dispatch) => {
  console.log('=== addToGlobalTixCartThunk Debug ===');
  console.log('Payload received:', payload);
  console.log('Dispatching addToGlobalTixCart action');
  dispatch(addToGlobalTixCart(payload));
  console.log('Dispatching calculateGlobalTixCartTotal action');
  dispatch(calculateGlobalTixCartTotal());
};

export const removeFromGlobalTixCartThunk = (payload) => (dispatch) => {
  dispatch(removeFromGlobalTixCart(payload));
  dispatch(calculateGlobalTixCartTotal());
};

export const updateGlobalTixCartQuantityThunk = (payload) => (dispatch) => {
  dispatch(updateGlobalTixCartQuantity(payload));
  dispatch(calculateGlobalTixCartTotal());
};

export const clearGlobalTixCartThunk = () => (dispatch) => {
  dispatch(clearGlobalTixCart());
  dispatch(calculateGlobalTixCartTotal());
};

