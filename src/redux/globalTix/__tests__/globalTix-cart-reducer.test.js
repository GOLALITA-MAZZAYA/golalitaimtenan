import { globalTixCartReducer } from '../globalTix-cart-reducer';
import {
  ADD_TO_GLOBALTIX_CART,
  REMOVE_FROM_GLOBALTIX_CART,
  UPDATE_GLOBALTIX_CART_QUANTITY,
  CLEAR_GLOBALTIX_CART,
  CALCULATE_GLOBALTIX_CART_TOTAL,
  CART_CLEARED_FOR_NEW_ATTRACTION,
} from '../globalTix-cart-types';

// Suppress reducer console logs in test output
beforeAll(() => jest.spyOn(console, 'log').mockImplementation(() => {}));
afterAll(() => console.log.mockRestore());

const initialState = {
  cartItems: {},
  totalPrice: 0,
  totalQuantity: 0,
  subtotal: 0,
  cartClearedForNewAttraction: false,
  newAttractionName: null,
  isUserAction: false,
};

const makeTicket = (overrides = {}) => ({
  nettPrice: 100,
  name: 'Adult',
  ...overrides,
});

const makeAddAction = (overrides = {}) => ({
  type: ADD_TO_GLOBALTIX_CART,
  payload: {
    productId: 1,
    optionId: 10,
    ticketTypeId: 100,
    product: { id: 1, name: 'Universal Studios' },
    option: { id: 10, currency: 'SGD' },
    ticketType: makeTicket(),
    quantity: 1,
    convertedPrice: 150,
    visitDate: '2026-07-10',
    eventId: null,
    timeSlot: null,
    isDynamicPrice: false,
    ceaNettPrice: null,
    ceaMsp: null,
    ceaRsp: null,
    isUserAction: true,
    ...overrides,
  },
});

describe('globalTixCartReducer', () => {
  describe('initial state', () => {
    it('returns initial state for unknown action', () => {
      const state = globalTixCartReducer(undefined, { type: '@@INIT' });
      expect(state).toEqual(initialState);
    });
  });

  // ─── ADD_TO_GLOBALTIX_CART ───────────────────────────────────────────────
  describe('ADD_TO_GLOBALTIX_CART', () => {
    it('adds item to empty cart', () => {
      const state = globalTixCartReducer(undefined, makeAddAction());
      expect(Object.keys(state.cartItems)).toHaveLength(1);
      expect(state.cartItems['1_10_100']).toBeDefined();
      expect(state.cartItems['1_10_100'].price).toBe(150);
      expect(state.cartItems['1_10_100'].quantity).toBe(1);
    });

    it('uses convertedPrice as item price', () => {
      const state = globalTixCartReducer(undefined, makeAddAction({ convertedPrice: 275 }));
      expect(state.cartItems['1_10_100'].price).toBe(275);
    });

    it('falls back to ticketType.nettPrice when convertedPrice is 0', () => {
      const action = makeAddAction({ convertedPrice: 0, ticketType: makeTicket({ nettPrice: 200 }) });
      const state = globalTixCartReducer(undefined, action);
      expect(state.cartItems['1_10_100'].price).toBe(200);
    });

    it('stores visitDate on cart item', () => {
      const state = globalTixCartReducer(undefined, makeAddAction({ visitDate: '2026-08-01' }));
      expect(state.cartItems['1_10_100'].visitDate).toBe('2026-08-01');
    });

    it('adds second ticket type from same attraction', () => {
      const first = globalTixCartReducer(undefined, makeAddAction());
      const second = globalTixCartReducer(
        first,
        makeAddAction({ optionId: 10, ticketTypeId: 101, convertedPrice: 120 })
      );
      expect(Object.keys(second.cartItems)).toHaveLength(2);
      expect(second.cartItems['1_10_101']).toBeDefined();
    });

    it('updates quantity and price when same key added again', () => {
      const first = globalTixCartReducer(undefined, makeAddAction({ convertedPrice: 150 }));
      const second = globalTixCartReducer(
        first,
        makeAddAction({ quantity: 3, convertedPrice: 160 })
      );
      expect(Object.keys(second.cartItems)).toHaveLength(1);
      expect(second.cartItems['1_10_100'].quantity).toBe(3);
      expect(second.cartItems['1_10_100'].price).toBe(160);
    });

    it('clears cart and adds new item when different attraction is added', () => {
      const withItem = globalTixCartReducer(undefined, makeAddAction());
      const state = globalTixCartReducer(
        withItem,
        makeAddAction({ productId: 2, product: { id: 2, name: 'Gardens by the Bay' } })
      );
      expect(Object.keys(state.cartItems)).toHaveLength(1);
      expect(state.cartItems['2_10_100']).toBeDefined();
      expect(state.cartItems['1_10_100']).toBeUndefined();
    });

    it('sets cartClearedForNewAttraction when different attraction replaces existing cart', () => {
      const withItem = globalTixCartReducer(undefined, makeAddAction());
      const state = globalTixCartReducer(
        withItem,
        makeAddAction({ productId: 2, product: { id: 2, name: 'Gardens by the Bay' }, isUserAction: true })
      );
      expect(state.cartClearedForNewAttraction).toBe(true);
      expect(state.newAttractionName).toBe('Gardens by the Bay');
    });

    it('does not set cartClearedForNewAttraction when cart was already empty', () => {
      const state = globalTixCartReducer(
        undefined,
        makeAddAction({ productId: 2, product: { id: 2, name: 'Gardens by the Bay' } })
      );
      expect(state.cartClearedForNewAttraction).toBe(false);
    });

    // ── Dynamic pricing fields ──────────────────────────────────────────────
    it('stores isDynamicPrice = true on cart item', () => {
      const state = globalTixCartReducer(
        undefined,
        makeAddAction({ isDynamicPrice: true, ceaNettPrice: 281.34 })
      );
      expect(state.cartItems['1_10_100'].isDynamicPrice).toBe(true);
    });

    it('stores ceaNettPrice from CEA on cart item', () => {
      const state = globalTixCartReducer(
        undefined,
        makeAddAction({ isDynamicPrice: true, ceaNettPrice: 281.34 })
      );
      expect(state.cartItems['1_10_100'].ceaNettPrice).toBe(281.34);
    });

    it('stores ceaMsp (minimumSellingPrice) from CEA', () => {
      const state = globalTixCartReducer(
        undefined,
        makeAddAction({ ceaMsp: 332.49 })
      );
      expect(state.cartItems['1_10_100'].ceaMsp).toBe(332.49);
    });

    it('stores ceaRsp (recommendedSellingPrice) from CEA', () => {
      const state = globalTixCartReducer(
        undefined,
        makeAddAction({ ceaRsp: 383.65 })
      );
      expect(state.cartItems['1_10_100'].ceaRsp).toBe(383.65);
    });

    it('defaults isDynamicPrice to false when not provided', () => {
      const action = makeAddAction();
      delete action.payload.isDynamicPrice;
      const state = globalTixCartReducer(undefined, action);
      expect(state.cartItems['1_10_100'].isDynamicPrice).toBe(false);
    });

    it('defaults ceaNettPrice to null when not provided', () => {
      const action = makeAddAction();
      delete action.payload.ceaNettPrice;
      const state = globalTixCartReducer(undefined, action);
      expect(state.cartItems['1_10_100'].ceaNettPrice).toBeNull();
    });

    it('stores all dynamic CEA fields together (Product 35045 real values)', () => {
      const state = globalTixCartReducer(
        undefined,
        makeAddAction({
          isDynamicPrice: true,
          ceaNettPrice: 281.34,
          ceaMsp: 332.49,
          ceaRsp: 383.65,
        })
      );
      const item = state.cartItems['1_10_100'];
      expect(item.isDynamicPrice).toBe(true);
      expect(item.ceaNettPrice).toBe(281.34);
      expect(item.ceaMsp).toBe(332.49);
      expect(item.ceaRsp).toBe(383.65);
    });
  });

  // ─── REMOVE_FROM_GLOBALTIX_CART ──────────────────────────────────────────
  describe('REMOVE_FROM_GLOBALTIX_CART', () => {
    it('removes an existing item from cart', () => {
      const withItem = globalTixCartReducer(undefined, makeAddAction());
      const state = globalTixCartReducer(withItem, {
        type: REMOVE_FROM_GLOBALTIX_CART,
        payload: { productId: 1, optionId: 10, ticketTypeId: 100 },
      });
      expect(state.cartItems['1_10_100']).toBeUndefined();
      expect(Object.keys(state.cartItems)).toHaveLength(0);
    });

    it('returns unchanged state when item does not exist', () => {
      const withItem = globalTixCartReducer(undefined, makeAddAction());
      const state = globalTixCartReducer(withItem, {
        type: REMOVE_FROM_GLOBALTIX_CART,
        payload: { productId: 999, optionId: 10, ticketTypeId: 100 },
      });
      expect(Object.keys(state.cartItems)).toHaveLength(1);
    });
  });

  // ─── UPDATE_GLOBALTIX_CART_QUANTITY ──────────────────────────────────────
  describe('UPDATE_GLOBALTIX_CART_QUANTITY', () => {
    let stateWithItem;
    beforeEach(() => {
      stateWithItem = globalTixCartReducer(undefined, makeAddAction({ ceaNettPrice: 281.34 }));
    });

    it('updates quantity', () => {
      const state = globalTixCartReducer(stateWithItem, {
        type: UPDATE_GLOBALTIX_CART_QUANTITY,
        payload: { productId: 1, optionId: 10, ticketTypeId: 100, quantity: 3 },
      });
      expect(state.cartItems['1_10_100'].quantity).toBe(3);
    });

    it('updates convertedPrice when provided', () => {
      const state = globalTixCartReducer(stateWithItem, {
        type: UPDATE_GLOBALTIX_CART_QUANTITY,
        payload: { productId: 1, optionId: 10, ticketTypeId: 100, quantity: 1, convertedPrice: 200 },
      });
      expect(state.cartItems['1_10_100'].price).toBe(200);
    });

    it('keeps existing price when convertedPrice not provided', () => {
      const state = globalTixCartReducer(stateWithItem, {
        type: UPDATE_GLOBALTIX_CART_QUANTITY,
        payload: { productId: 1, optionId: 10, ticketTypeId: 100, quantity: 2 },
      });
      expect(state.cartItems['1_10_100'].price).toBe(150);
    });

    it('updates ceaNettPrice when provided', () => {
      const state = globalTixCartReducer(stateWithItem, {
        type: UPDATE_GLOBALTIX_CART_QUANTITY,
        payload: { productId: 1, optionId: 10, ticketTypeId: 100, quantity: 1, ceaNettPrice: 295.50 },
      });
      expect(state.cartItems['1_10_100'].ceaNettPrice).toBe(295.50);
    });

    it('keeps existing ceaNettPrice when not provided in update', () => {
      const state = globalTixCartReducer(stateWithItem, {
        type: UPDATE_GLOBALTIX_CART_QUANTITY,
        payload: { productId: 1, optionId: 10, ticketTypeId: 100, quantity: 2 },
      });
      expect(state.cartItems['1_10_100'].ceaNettPrice).toBe(281.34);
    });

    it('returns unchanged state when quantity is 0', () => {
      const state = globalTixCartReducer(stateWithItem, {
        type: UPDATE_GLOBALTIX_CART_QUANTITY,
        payload: { productId: 1, optionId: 10, ticketTypeId: 100, quantity: 0 },
      });
      expect(state.cartItems['1_10_100'].quantity).toBe(1);
    });

    it('returns unchanged state for non-existent item', () => {
      const state = globalTixCartReducer(stateWithItem, {
        type: UPDATE_GLOBALTIX_CART_QUANTITY,
        payload: { productId: 999, optionId: 10, ticketTypeId: 100, quantity: 2 },
      });
      expect(Object.keys(state.cartItems)).toHaveLength(1);
    });
  });

  // ─── CLEAR_GLOBALTIX_CART ────────────────────────────────────────────────
  describe('CLEAR_GLOBALTIX_CART', () => {
    it('resets state to initial values', () => {
      const withItem = globalTixCartReducer(undefined, makeAddAction());
      const state = globalTixCartReducer(withItem, { type: CLEAR_GLOBALTIX_CART });
      expect(state).toEqual(initialState);
    });

    it('clears all cart items', () => {
      const withItem = globalTixCartReducer(undefined, makeAddAction());
      const state = globalTixCartReducer(withItem, { type: CLEAR_GLOBALTIX_CART });
      expect(Object.keys(state.cartItems)).toHaveLength(0);
    });
  });

  // ─── CART_CLEARED_FOR_NEW_ATTRACTION ─────────────────────────────────────
  describe('CART_CLEARED_FOR_NEW_ATTRACTION', () => {
    it('resets cartClearedForNewAttraction flag', () => {
      const withNotification = { ...initialState, cartClearedForNewAttraction: true, newAttractionName: 'Gardens' };
      const state = globalTixCartReducer(withNotification, { type: CART_CLEARED_FOR_NEW_ATTRACTION });
      expect(state.cartClearedForNewAttraction).toBe(false);
      expect(state.newAttractionName).toBeNull();
    });
  });

  // ─── CALCULATE_GLOBALTIX_CART_TOTAL ──────────────────────────────────────
  describe('CALCULATE_GLOBALTIX_CART_TOTAL', () => {
    it('calculates total for single item', () => {
      const withItem = globalTixCartReducer(undefined, makeAddAction({ convertedPrice: 150, quantity: 1 }));
      const state = globalTixCartReducer(withItem, { type: CALCULATE_GLOBALTIX_CART_TOTAL });
      expect(state.totalPrice).toBe(150);
      expect(state.totalQuantity).toBe(1);
      expect(state.subtotal).toBe(150);
    });

    it('multiplies price by quantity', () => {
      const withItem = globalTixCartReducer(undefined, makeAddAction({ convertedPrice: 100, quantity: 3 }));
      const state = globalTixCartReducer(withItem, { type: CALCULATE_GLOBALTIX_CART_TOTAL });
      expect(state.totalPrice).toBe(300);
      expect(state.totalQuantity).toBe(3);
    });

    it('sums across multiple items', () => {
      const first = globalTixCartReducer(undefined, makeAddAction({ convertedPrice: 150, quantity: 2 }));
      const second = globalTixCartReducer(
        first,
        makeAddAction({ ticketTypeId: 101, convertedPrice: 100, quantity: 1 })
      );
      const state = globalTixCartReducer(second, { type: CALCULATE_GLOBALTIX_CART_TOTAL });
      expect(state.totalPrice).toBe(400); // (150×2) + (100×1)
      expect(state.totalQuantity).toBe(3);
    });

    it('returns 0 totals for empty cart', () => {
      const state = globalTixCartReducer(undefined, { type: CALCULATE_GLOBALTIX_CART_TOTAL });
      expect(state.totalPrice).toBe(0);
      expect(state.totalQuantity).toBe(0);
    });

    it('handles item with 0 price', () => {
      const withItem = globalTixCartReducer(
        undefined,
        makeAddAction({ convertedPrice: 0, ticketType: makeTicket({ nettPrice: 0 }) })
      );
      const state = globalTixCartReducer(withItem, { type: CALCULATE_GLOBALTIX_CART_TOTAL });
      expect(state.totalPrice).toBe(0);
    });
  });
});
