import { getToken } from '../utils/secureStorage';
import instance from '../redux/instance';

const CARDS_PAGE_LIMIT = 100; // server max
const CARDS_MAX_PAGES = 20;

const getCustomerCardsPage = async (token, page) => {
  const response = await instance.post('/discount_card/customer/cards', {
    params: {
      token,
      page,
      limit: CARDS_PAGE_LIMIT,
    },
  });
  console.log('getCustomerCardsPage response', response.data);
  if (!response?.data) {
    throw new Error('Network error: No response received');
  }

  const result = response.data.result;
  if (result?.status === 'error' || result?.error) {
    throw new Error(result?.error || result?.message || 'Failed to fetch customer discount cards');
  }

  return {
    cards: Array.isArray(result?.cards) ? result.cards : [],
    hasNext: Boolean(result?.pagination?.has_next),
  };
};

/**
 * Fetches all discount cards for the authenticated customer, following pagination.
 * POST /go/api/discount_card/customer/cards
 */
export const getCustomerCardsApi = async () => {
  const token = await getToken();
  const cards = [];
  for (let page = 1; page <= CARDS_MAX_PAGES; page++) {
    const { cards: pageCards, hasNext } = await getCustomerCardsPage(token, page);
    cards.push(...pageCards);
    if (!hasNext || pageCards.length === 0) break;
  }
  return cards;
};

/**
 * Fetches full card details including the QR image URL, branches, and redemption history.
 * `qr_image_url` is empty when the card is used/exhausted.
 * POST /go/api/discount_card/customer/card_detail
 * @param {number|string} cardId
 */
export const getCustomerCardDetailApi = async (cardId) => {
  const token = await getToken();
  const response = await instance.post('/discount_card/customer/card_detail', {
    params: {
      token,
      card_id: Number(cardId),
    },
  });
  console.log('getCustomerCardDetailApi response', response.data);
  if (!response?.data) {
    throw new Error('Network error: No response received');
  }

  const result = response.data.result;
  if (result?.status === 'error' || result?.error) {
    throw new Error(result?.error || result?.message || 'Failed to fetch card details');
  }

  return result?.card || null;
};

