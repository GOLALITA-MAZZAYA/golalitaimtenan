import {
  getCustomerCardsApi,
  getCustomerCardDetailApi,
} from '../../api/discountCard';
import {
  setDiscountCards,
  setDiscountCardsLoading,
  setDiscountCardDetail,
  setDiscountCardDetailLoading,
  setDiscountCardError,
} from './discountCard-actions';

// Discount Cards only. Visit Stamp programs are a separate program shown on the Loyalty Stamps screen.

/**
 * Thunk to fetch all discount cards for the current customer
 */
export const fetchCustomerCards = () => async (dispatch) => {
  try {
    dispatch(setDiscountCardsLoading(true));
    dispatch(setDiscountCardError(null));

    const cards = await getCustomerCardsApi();
    dispatch(setDiscountCards(cards || []));
    return cards;
  } catch (error) {
    console.error('Error fetching customer discount cards:', error);
    dispatch(setDiscountCardError(error?.message || 'Failed to fetch cards'));
    dispatch(setDiscountCards([]));
    return [];
  } finally {
    dispatch(setDiscountCardsLoading(false));
  }
};

/**
 * Thunk to fetch detailed card info (QR image, branches, redemption history).
 * Always queries the server so usage reflects the latest merchant redemptions.
 * @param {number|string} cardId
 */
export const fetchCustomerCardDetail = (cardId) => async (dispatch, getState) => {
  try {
    dispatch(setDiscountCardDetailLoading(true));
    dispatch(setDiscountCardError(null));

    let card = null;
    try {
      card = await getCustomerCardDetailApi(cardId);
    } catch (apiErr) {
      console.log('getCustomerCardDetailApi failed:', apiErr?.message);
    }

    // Offline fallback: last known copy from the list
    if (!card) {
      const existingCards = getState().discountCardReducer?.cards || [];
      card = existingCards.find(
        (c) => String(c.card_id) === String(cardId) || String(c.id) === String(cardId)
      ) || null;
    }

    if (card) {
      dispatch(setDiscountCardDetail(card));
    }
    return card;
  } catch (error) {
    console.error('Error fetching discount card detail:', error);
    dispatch(setDiscountCardError(error?.message || 'Failed to fetch card detail'));
    return null;
  } finally {
    dispatch(setDiscountCardDetailLoading(false));
  }
};
