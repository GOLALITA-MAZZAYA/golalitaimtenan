export const globalTixCartItemsSelector = (state) => {
  // Only log when there are cart items to avoid spam
  const cartItems = state.globalTix?.cart?.cartItems;
  if (cartItems && Object.keys(cartItems).length > 0) {
    //  console.log('=== globalTixCartItemsSelector Debug ===');
    console.log('cartItems:', cartItems);
  }
  return state.globalTix.cart.cartItems;
};

export const globalTixCartTotalPriceSelector = (state) => {
  return state.globalTix.cart.totalPrice;
};

export const globalTixCartTotalQuantitySelector = (state) => {
  return state.globalTix.cart.totalQuantity;
};


