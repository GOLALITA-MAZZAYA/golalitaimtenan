import {
  SET_CARDMOLA_GIFT_CARDS,
  SET_CARDMOLA_GIFT_CARDS_LOADING,
  SET_GIFT_CARDS,
  SET_GIFT_CARDS_LOADING,
  SET_PAYMENT_DATA,
  SET_PURCHASED_GIFT_CARDS,
  SET_PURCHASED_GIFT_CARDS_LOADING,
  SET_SELECTED_CARDMOLA_COUNTRY,
  SET_SELECTED_CARDMOLA_GIFT_CARD,
  SET_SELECTED_CARDMOLA_GIFT_CARD_LOADING,
} from "./giftcards-types";

const initialState = {
  loading: false,
  giftCards: [],
  paymentDataGlobal: null,
  cardmolaGiftCards: [],
  selectedCardmolaGiftCard: null,
  selectedCardmolaCountry: null,
  selectedCardmolaGiftCardLoading: true,
  cardmolaLoading: false,
  cardmolaToken: null,

  purchasedGiftCards: [],
  purchasedGiftCardsLoading: false,
};

export const giftcardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GIFT_CARDS_LOADING:
      return { ...state, loading: action.loading };
    case SET_GIFT_CARDS:
      return { ...state, giftCards: action.giftCards };
    case SET_CARDMOLA_GIFT_CARDS_LOADING:
      return { ...state, cardmolaLoading: action.loading };
    case SET_PAYMENT_DATA:
      return { ...state, paymentDataGlobal: action.giftCards };
    case SET_CARDMOLA_GIFT_CARDS:
      return {
        ...state,
        cardmolaGiftCards: action.giftCards,
        cardmolaToken: action.token,
      };
    case SET_SELECTED_CARDMOLA_COUNTRY:
      return { ...state, selectedCardmolaCountry: action.giftCards };
    case SET_SELECTED_CARDMOLA_GIFT_CARD:
      return { ...state, selectedCardmolaGiftCard: action.giftCard };
    case SET_SELECTED_CARDMOLA_GIFT_CARD_LOADING:
      return { ...state, selectedCardmolaGiftCardLoading: action.loading };
    case SET_PURCHASED_GIFT_CARDS_LOADING:
      return { ...state, purchasedGiftCardsLoading: action.loading };
    case SET_PURCHASED_GIFT_CARDS:
      return { ...state, purchasedGiftCards: action.purchasedGiftCards };
    default:
      return state;
  }
};
