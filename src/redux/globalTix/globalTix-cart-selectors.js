export const globalTixCartItemsSelector = (state) => {
  // Only log when there are cart items to avoid spam
  const cartItems = state.globalTix?.cart?.cartItems;
  if (cartItems && Object.keys(cartItems).length > 0) {
    console.log('=== globalTixCartItemsSelector Debug ===');
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

export const globalTixCartSubtotalSelector = (state) => state.globalTix.cart.subtotal;

export const getGlobalTixCartItemQuantity = (state, productId, optionId, ticketTypeId) => {
  const cartKey = `${productId}_${optionId}_${ticketTypeId}`;
  return state.globalTix.cart.cartItems[cartKey]?.quantity || 0;
};

export const getGlobalTixCartItem = (state, productId, optionId, ticketTypeId) => {
  const cartKey = `${productId}_${optionId}_${ticketTypeId}`;
  return state.globalTix.cart.cartItems[cartKey] || null;
};

export const getGlobalTixCartClearedForNewAttraction = (state) => {
  return state.globalTix.cart.cartClearedForNewAttraction;
};

export const getGlobalTixNewAttractionName = (state) => {
  return state.globalTix.cart.newAttractionName;
};

