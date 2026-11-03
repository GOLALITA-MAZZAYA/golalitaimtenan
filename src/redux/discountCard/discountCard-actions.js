import {
  SET_DISCOUNT_CARDS,
  SET_DISCOUNT_CARDS_LOADING,
  SET_DISCOUNT_CARD_DETAIL,
  SET_DISCOUNT_CARD_DETAIL_LOADING,
  SET_DISCOUNT_CARD_ERROR,
  RESET_DISCOUNT_CARD_DETAIL,
} from './discountCard-types';

export const setDiscountCardsLoading = (loading) => ({
  type: SET_DISCOUNT_CARDS_LOADING,
  loading,
});

export const setDiscountCards = (cards) => ({
  type: SET_DISCOUNT_CARDS,
  cards,
});

export const setDiscountCardDetailLoading = (loading) => ({
  type: SET_DISCOUNT_CARD_DETAIL_LOADING,
  loading,
});

export const setDiscountCardDetail = (card) => ({
  type: SET_DISCOUNT_CARD_DETAIL,
  card,
});

export const setDiscountCardError = (error) => ({
  type: SET_DISCOUNT_CARD_ERROR,
  error,
});

export const resetDiscountCardDetail = () => ({
  type: RESET_DISCOUNT_CARD_DETAIL,
});
