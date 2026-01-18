import {
  getGiftCards as getGiftCardsRequest,
  getPurchasedGiftCards as getPurchasedGiftCardsRequest,
  getCardmolaGiftCards as getCardmolaGiftCardsRequest,
  getCardmolaGiftCardById as getCardmolaGiftCardByIdRequest,
  getCardmolaCurrencies,
} from "../../api/giftCard";
import {
  setCardmolaGiftCards,
  setCardmolaGiftCardsLoading,
  setGiftCards,
  setGiftCardsLoading,
  setPurchasedGiftCards,
  setPurchasedGiftCardsLoading,
  setSelecteedCardmolaGiftCard,
  setSelecteedCardmolaGiftCardLoading,
} from "./giftcards-actions";

export const getGiftCards =
  (categoryId, countryCode) => async (dispatch, getState) => {
    const { token } = getState().authReducer;

    try {
      dispatch(setGiftCardsLoading(true));

      const params = {
        token,
        fields:
          "['id','name','brand_code', 'brand_id', 'brand_accepted_currency', 'category_ids', 'country_ids', 'denomination_ids', 'description', 'detail_url', 'display_name', 'image_gallery', 'is_active', 'is_generic', 'locations_url', 'logo', 'pin_redeemable', 'product_image', 'redemption_instructions', 'redemption_type', 'tagline', 'validity_in_months', 'variable_amount', 'x_rate', 'x_minimum_point']",
      };

      if (categoryId && !countryCode) {
        params.domain = JSON.stringify([
          ["category_ids.category_id", "=", categoryId],
          ["denomination_ids", "!=", "False"],
          ["denomination_ids.is_active", "=", "True"],
        ]);
      }

      if (countryCode && !categoryId) {
        params.domain = JSON.stringify([
          ["country_ids.code", "=", countryCode],
          ["denomination_ids", "!=", "False"],
          ["denomination_ids.is_active", "=", "True"],
        ]);
      }

      if (countryCode && categoryId) {
        params.domain = JSON.stringify([
          ["category_ids.category_id", "=", categoryId],
          ["country_ids.code", "=", countryCode],
          ["denomination_ids", "!=", "False"],
          ["denomination_ids.is_active", "=", "True"],
        ]);
      }
      params.domain = params.domain
        .replace(/"False"/g, "False")
        .replace(/"True"/g, "True");

      console.log(params,'params')

      const giftCards = await getGiftCardsRequest(params);

      if (!giftCards) {
        throw "get favourtire gift cards error";
      }

      dispatch(setGiftCards(giftCards));
    } catch (err) {
      console.log(err, "error");

      dispatch(setGiftCards([]));
    } finally {
      dispatch(setGiftCardsLoading(false));
    }
  };

export const getCardmolaGiftCards = (country) => async (dispatch) => {
  console.log("1");
  try {
    dispatch(setCardmolaGiftCardsLoading(true));
    console.log("2");
    const { data, token } = await getCardmolaGiftCardsRequest(country);

    console.log("3");
    if (!data) {
      throw "get cardmola gift cards error";
    }

    console.log("4");

    dispatch(setCardmolaGiftCards(data, token));
  } catch (err) {
    console.log(err.message, "error");

    dispatch(setCardmolaGiftCards([]));
  } finally {
    console.log("5");
    dispatch(setCardmolaGiftCardsLoading(false));
  }
};

export const getCardmolaGiftCardById =
  (encodedId) => async (dispatch, getState) => {
    const { cardmolaToken } = getState().giftcardsReducer;

    try {
      dispatch(setSelecteedCardmolaGiftCardLoading(true));

      const giftCard = await getCardmolaGiftCardByIdRequest(
        encodedId,
        cardmolaToken
      );

      if (!giftCard) {
        throw "get cardmola gift card error";
      }

      const currencies = await getCardmolaCurrencies();

      const currencyCode = giftCard.currencyCode;
      const rate = currencies?.find((item) => item.name === currencyCode)?.rate;
      giftCard.rate = rate;
      giftCard.denominations_org = giftCard.denominations;
      giftCard.denominations = giftCard.denominations.map(
        (item) => +(item * rate).toFixed(2)
      );

      if (!rate) {
        throw "no rate found";
      }

      giftCard.rate = rate;

      dispatch(setSelecteedCardmolaGiftCard(giftCard));
    } catch (err) {
      console.log(err.message, "error");

      dispatch(setSelecteedCardmolaGiftCard(null));
    } finally {
      dispatch(setSelecteedCardmolaGiftCardLoading(false));
    }
  };

export const requestForGiftCardPayment =
  (params) => async (dispatch, getState) => {
    const { cardmolaToken } = getState().giftcardsReducer;

    try {
      dispatch(setSelecteedCardmolaGiftCardLoading(true));

      const updatedParams = {
        token: cardmolaToken,
        ...params,
      };

      const giftCard = await requestGiftCardPayment(updatedParams);

      if (!giftCard) {
        throw "get cardmola gift card error";
      }

      dispatch(setSelecteedCardmolaGiftCard(giftCard));
    } catch (err) {
      console.log(err.message, "error");

      dispatch(setSelecteedCardmolaGiftCard(null));
    } finally {
      dispatch(setSelecteedCardmolaGiftCardLoading(false));
    }
  };

export const getPurchasedGiftCards = () => async (dispatch, getState) => {
  try {
    dispatch(setPurchasedGiftCardsLoading(true));
    const { user } = getState().authReducer;

    const purchasedGiftCards = await getPurchasedGiftCardsRequest(
      user.partner_id
    );

    if (purchasedGiftCards) {
      dispatch(setPurchasedGiftCards(purchasedGiftCards));

      return;
    }

    throw "err";
  } catch (err) {
    dispatch(setPurchasedGiftCards([]));
  } finally {
    dispatch(setPurchasedGiftCardsLoading(false));
  }
};
