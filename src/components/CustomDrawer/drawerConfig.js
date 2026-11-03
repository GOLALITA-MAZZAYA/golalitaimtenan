export const DRAWER_SCREEN_NAMES = {
  FAMILY_MEMBERS: 'familyMembers',
  LOYALTY_POINTS: 'loyaltyPoints',
  ALL_OFFERS: 'allOffers',
  FAVORITES: 'favorites',
  MY_BOOKINGS: 'myBookings',
  SETTINGS: 'settings',
  LANGUAGE: 'language',
  CONTACT_US: 'contactUs',
  // Backend team to implement this exact category key for
  // /public/app/menu_categories.
  PREMIUM_MERCHANTS: 'premiumMerchants',
  // Backend team to implement this exact category key for
  // /public/app/menu_categories.
  AI_CHAT: 'aiChat',
  // Backend team to implement these exact category keys for
  // /public/app/menu_categories (Complimentary Coupons / Loyalty Stamps).
  DISCOUNT_CARDS: 'discountCards',
  STAMP_CARDS: 'stampCards',
  GIFT_CARDS: 'giftCards',
};

const normalizeCategory = value => String(value || '').toLowerCase().trim();

export const isDrawerScreenVisible = (screenName, menuCategories = []) => {
  if (!screenName || !menuCategories.length) {
    return true;
  }

  const normalizedCategories = menuCategories.map(normalizeCategory);

  return normalizedCategories.includes(normalizeCategory(screenName));
};
