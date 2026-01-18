import {
  addProductInCart,
  calculateOrderPrice,
  removeProductFromCart,
} from "./cart-actions";

export const addProduct = (value) => (dispatch) => {
  dispatch(addProductInCart(value));

  dispatch(calculateOrderPrice());
};

export const removeProduct = (value) => (dispatch) => {
  dispatch(removeProductFromCart(value));

  dispatch(calculateOrderPrice());
};
