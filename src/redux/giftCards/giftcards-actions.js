import {
  SET_GIFT_CARDS,
  SET_GIFT_CARDS_LOADING,
  SET_PAYMENT_DATA,
} from "./giftcards-types";

export const setGiftCardsLoading = (loading) => ({
  type: SET_GIFT_CARDS_LOADING,
  loading,
});

export const setGiftCards = (giftCards) => ({
  type: SET_GIFT_CARDS,
  giftCards,
});

export const setPaymentDataGlobal = (giftCards) => ({
  type: SET_PAYMENT_DATA,
  giftCards,
});
