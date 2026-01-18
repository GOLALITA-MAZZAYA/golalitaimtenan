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

export const setGiftCardsLoading = (loading) => ({
  type: SET_GIFT_CARDS_LOADING,
  loading,
});

export const setGiftCards = (giftCards) => ({
  type: SET_GIFT_CARDS,
  giftCards,
});

export const setCardmoolaGiftCardsCountry = (giftCards) => ({
  type: SET_SELECTED_CARDMOLA_COUNTRY,
  giftCards,
});

export const setPaymentDataGlobal = (giftCards) => ({
  type: SET_PAYMENT_DATA,
  giftCards,
});

export const setCardmolaGiftCardsLoading = (loading) => ({
  type: SET_CARDMOLA_GIFT_CARDS_LOADING,
  loading,
});

export const setCardmolaGiftCards = (giftCards, token) => ({
  type: SET_CARDMOLA_GIFT_CARDS,
  giftCards,
  token,
});

export const setSelecteedCardmolaGiftCard = (giftCard) => ({
  type: SET_SELECTED_CARDMOLA_GIFT_CARD,
  giftCard,
});

export const setSelecteedCardmolaGiftCardLoading = (loading) => ({
  type: SET_SELECTED_CARDMOLA_GIFT_CARD_LOADING,
  loading,
});

export const setPurchasedGiftCardsLoading = (loading) => ({
  type: SET_PURCHASED_GIFT_CARDS_LOADING,
  loading,
});

export const setPurchasedGiftCards = (purchasedGiftCards) => ({
  type: SET_PURCHASED_GIFT_CARDS,
  purchasedGiftCards,
});
