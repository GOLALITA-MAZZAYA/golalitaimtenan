export const DRAWER_SCREEN_NAMES = {
  FAMILY_MEMBERS: 'familyMembers',
  VOUCHERS: 'vouchers',
  ALL_OFFERS: 'allOffers',
  FAVORITES: 'favorites',
  SETTINGS: 'settings',
  LANGUAGE: 'language',
  CONTACT_US: 'contactUs',
};

const normalizeCategory = value => String(value || '').toLowerCase().trim();

export const isDrawerScreenVisible = (screenName, menuCategories = []) => {
  if (!screenName || !menuCategories.length) {
    return true;
  }

  const normalizedCategories = menuCategories.map(normalizeCategory);

  return normalizedCategories.includes(normalizeCategory(screenName));
};
