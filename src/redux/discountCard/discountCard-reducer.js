import {
  SET_DISCOUNT_CARDS,
  SET_DISCOUNT_CARDS_LOADING,
  SET_DISCOUNT_CARD_DETAIL,
  SET_DISCOUNT_CARD_DETAIL_LOADING,
  SET_DISCOUNT_CARD_ERROR,
  RESET_DISCOUNT_CARD_DETAIL,
} from './discountCard-types';

const initialState = {
  cards: [],
  cardsLoading: false,
  cardDetail: null,
  cardDetailLoading: false,
  error: null,
};

export const discountCardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DISCOUNT_CARDS_LOADING:
      return {
        ...state,
        cardsLoading: action.loading,
      };
    case SET_DISCOUNT_CARDS:
      return {
        ...state,
        cards: action.cards,
        error: null,
      };
    case SET_DISCOUNT_CARD_DETAIL_LOADING:
      return {
        ...state,
        cardDetailLoading: action.loading,
      };
    case SET_DISCOUNT_CARD_DETAIL:
      return {
        ...state,
        cardDetail: action.card,
        error: null,
      };
    case SET_DISCOUNT_CARD_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case RESET_DISCOUNT_CARD_DETAIL:
      return {
        ...state,
        cardDetail: null,
      };
    default:
      return state;
  }
};
