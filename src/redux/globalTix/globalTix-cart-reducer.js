import {
  ADD_TO_GLOBALTIX_CART,
  REMOVE_FROM_GLOBALTIX_CART,
  UPDATE_GLOBALTIX_CART_QUANTITY,
  CLEAR_GLOBALTIX_CART,
  CALCULATE_GLOBALTIX_CART_TOTAL,
  CART_CLEARED_FOR_NEW_ATTRACTION,
} from "./globalTix-cart-types";

const initialState = {
  cartItems: {},
  totalPrice: 0,
  totalQuantity: 0,
  subtotal: 0,
  cartClearedForNewAttraction: false,
  newAttractionName: null,
  isUserAction: false, // Track if this is a user-initiated action
};

export const globalTixCartReducer = (state = initialState, action) => {
  // Only log for cart-related actions, not every action
  if (action.type.includes('GLOBALTIX_CART')) {
    console.log('=== globalTixCartReducer Debug ===');
    console.log('Action type:', action.type);
    console.log('Action payload:', action.payload);
  }
  
  switch (action.type) {
    case ADD_TO_GLOBALTIX_CART: {
      console.log('Processing ADD_TO_GLOBALTIX_CART');
      const { productId, optionId, ticketTypeId, product, option, ticketType, quantity = 1, convertedPrice, visitDate, isUserAction = true } = action.payload;
      const cartKey = `${productId}_${optionId}_${ticketTypeId}`;
      
      console.log('Cart key:', cartKey);
      console.log('Existing cart items:', state.cartItems);
      console.log('Item exists in cart:', !!state.cartItems[cartKey]);
      console.log('Converted price:', convertedPrice);

      // Check if this is the same attraction (same productId)
      const existingCartItems = Object.values(state.cartItems);
      const isSameAttraction = existingCartItems.some(item => item.productId === productId);
      
      if (!state.cartItems[cartKey]) {
        // If cart is empty or this is the same attraction, proceed
        if (existingCartItems.length === 0 || isSameAttraction) {
          console.log('Adding new item to cart');
          const newCartItems = { ...state.cartItems };
          newCartItems[cartKey] = {
            productId,
            optionId,
            ticketTypeId,
            product,
            option,
            ticketType,
            quantity,
            price: convertedPrice || ticketType.nettPrice || ticketType.originalPrice || ticketType.price || 0,
            visitDate: visitDate || null,
          };
          console.log('New cart items after adding:', newCartItems);
          return { ...state, cartItems: newCartItems, isUserAction: false };
        } else {
          // Different attraction - clear cart and add new one
          console.log('Different attraction detected, clearing cart and adding new item');
          const newCartItems = {};
          newCartItems[cartKey] = {
            productId,
            optionId,
            ticketTypeId,
            product,
            option,
            ticketType,
            quantity,
            price: convertedPrice || ticketType.nettPrice || ticketType.originalPrice || ticketType.price || 0,
            visitDate: visitDate || null,
          };
          console.log('New cart items after clearing and adding:', newCartItems);
          
          // Only show notification if there were existing items in the cart AND this is a user action
          const hadExistingItems = Object.keys(state.cartItems).length > 0;
          const shouldShowNotification = hadExistingItems && isUserAction;
          
          return { 
            ...state, 
            cartItems: newCartItems,
            cartClearedForNewAttraction: shouldShowNotification, // Only true if there were existing items AND user action
            newAttractionName: shouldShowNotification ? (product.name || 'New Attraction') : null,
            isUserAction: false // Reset the flag
          };
        }
      }

      console.log('Updating existing item quantity');
      const newCartItems = { ...state.cartItems };
      newCartItems[cartKey] = {
        ...newCartItems[cartKey],
        quantity: quantity, // Set the quantity directly instead of adding
        price: convertedPrice || newCartItems[cartKey].price, // Update price if converted price is provided
        visitDate: visitDate || newCartItems[cartKey].visitDate, // Update visit date if provided
      };
      console.log('New cart items after updating:', newCartItems);

      return { ...state, cartItems: newCartItems, isUserAction: false };
    }

    case REMOVE_FROM_GLOBALTIX_CART: {
      const { productId, optionId, ticketTypeId } = action.payload;
      const cartKey = `${productId}_${optionId}_${ticketTypeId}`;

      if (!state.cartItems[cartKey]) {
        return state;
      }

      const newCartItems = { ...state.cartItems };
      delete newCartItems[cartKey];

      return { ...state, cartItems: newCartItems };
    }

    case UPDATE_GLOBALTIX_CART_QUANTITY: {
      const { productId, optionId, ticketTypeId, quantity, convertedPrice, visitDate } = action.payload;
      const cartKey = `${productId}_${optionId}_${ticketTypeId}`;

      if (!state.cartItems[cartKey] || quantity <= 0) {
        return state;
      }

      const newCartItems = { ...state.cartItems };
      newCartItems[cartKey] = {
        ...newCartItems[cartKey],
        quantity,
        price: convertedPrice || newCartItems[cartKey].price, // Update price if converted price is provided
        visitDate: visitDate || newCartItems[cartKey].visitDate, // Update visit date if provided
      };

      console.log('Updated cart item:', newCartItems[cartKey]);

      return { ...state, cartItems: newCartItems };
    }

    case CLEAR_GLOBALTIX_CART: {
      return { ...initialState };
    }

    case CART_CLEARED_FOR_NEW_ATTRACTION: {
      return {
        ...state,
        cartClearedForNewAttraction: false,
        newAttractionName: null,
        isUserAction: false,
      };
    }

    case CALCULATE_GLOBALTIX_CART_TOTAL: {
      console.log('Processing CALCULATE_GLOBALTIX_CART_TOTAL');
      const cartItems = Object.values(state.cartItems);
      let totalPrice = 0;
      let totalQuantity = 0;

      console.log('Cart items for calculation:', cartItems);

      // Use the stored prices (which should be converted QAR prices)
      Object.entries(state.cartItems).forEach(([key, item]) => {
        const itemPrice = item.price || 0; // Use the stored price (converted QAR)
        
        console.log('Item price for calculation:', itemPrice, 'for item:', item.ticketType?.name);
        totalPrice += itemPrice * item.quantity;
        totalQuantity += item.quantity;
      });

      console.log('Calculated totals - totalPrice:', totalPrice, 'totalQuantity:', totalQuantity);

      return {
        ...state,
        totalPrice,
        totalQuantity,
        subtotal: totalPrice,
      };
    }

    default:
      return state;
  }
};

export default globalTixCartReducer;
