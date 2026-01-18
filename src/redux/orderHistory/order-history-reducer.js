import {
  SET_ORDER_HISTORY,
  SET_ORDER_HISTORY_LOADING,
} from "./order-history-types";

const initialState = {
  orderHistory: [],
  orderHistoryLoading: false,
};
export const orderHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDER_HISTORY: {
      return { ...state, orderHistory: action.orderHistory };
    }
    case SET_ORDER_HISTORY_LOADING: {
      return { ...state, orderHistoryLoading: action.loading };
    }
    default:
      return state;
  }
};
