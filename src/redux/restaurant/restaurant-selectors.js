export const selectOrderType = (state) => state.restaurantReducer.order_type;

export const selectCurrentForm = (state) => {
  const type = state.restaurantReducer.order_type;

  switch (type) {
    case 'reservation':
      return state.restaurantReducer.reservation;
    case 'delivery':
      return state.restaurantReducer.delivery;
    case 'takeaway':
      return state.restaurantReducer.takeaway;
  }
};

export const restaurantLoadingSelector = (state) => state.restaurantReducer.loading;
