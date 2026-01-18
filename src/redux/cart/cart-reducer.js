import { CONSTANTS } from "../../MainScreens/Delivery/screens/RestaurantList/components/DeliveryTabs/config";
import {
  ADD_RODUCT_IN_CART,
  CALCULATE_ORDER_PRICE,
  CLEAR_PRODUCT_CART,
  REMOVE_PRODUCT_FROM_CART,
  SET_DELIVERY_ACTIVE_TAB,
  SET_VOUCHER_DISCOUNT,
} from "./cart-types";
import { calculateOrderPriceValues } from "./helpers";

const initialState = {
  cartProducts: {},
  totalPrice: 0,
  totalDiscount: 0,
  totalQuantity: 0,
  subtotal: 0,
  deliveryFee: 0,
  voucher: {},
  activeTab: CONSTANTS.DELIVERY,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_RODUCT_IN_CART: {
      const { product_id, price, product, quantity = 1 } = action.payload;

      if (!state.cartProducts[product_id]) {
        const newCardProducts = { ...state.cartProducts };

        newCardProducts[product_id] = {
          product_id,
          quantity,
          price,
          product,
        };

        return { ...state, cartProducts: newCardProducts };
      }

      const newCardProducts = { ...state.cartProducts };

      newCardProducts[product_id] = {
        product_id,
        quantity: newCardProducts[product_id].quantity + 1,
        price,
        product,
      };

      return { ...state, cartProducts: newCardProducts };
    }

    case REMOVE_PRODUCT_FROM_CART: {
      const { product_id, price } = action.payload;

      if (
        !state.cartProducts[product_id] ||
        state.cartProducts[product_id]?.quantity === 0
      ) {
        return state;
      }

      const newCartProducts = { ...state.cartProducts };

      newCartProducts[product_id] = {
        ...newCartProducts[product_id],
        product_id,
        quantity: newCartProducts[product_id].quantity - 1,
        price,
      };

      return {
        ...state,
        cartProducts: newCartProducts,
      };
    }

    case SET_VOUCHER_DISCOUNT: {
      return {
        ...state,
        voucher: {
          value: action.voucher.value,
          discount: action.voucher.discount,
        },
      };
    }

    case CLEAR_PRODUCT_CART: {
      return { ...initialState, activeTab: state.activeTab };
    }

    case CALCULATE_ORDER_PRICE: {
      const { quantity, price, discount, subtotal, deliveryFee } =
        calculateOrderPriceValues(
          state.cartProducts,
          state.voucher?.discount || 0
        );

      return {
        ...state,
        totalPrice: price,
        totalDiscount: discount,
        totalQuantity: quantity,
        subtotal,
        deliveryFee,
      };
    }

    case SET_DELIVERY_ACTIVE_TAB: {
      return {
        ...state,
        activeTab: action.activeTab,
      };
    }

    default:
      return state;
  }
};
