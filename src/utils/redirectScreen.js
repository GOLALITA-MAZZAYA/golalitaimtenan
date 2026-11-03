const REDIRECT_SCREEN_ROUTES = {
  giftcard: ['loyaltyPoints', { screen: 'loyaltyPoints-giftCards-list' }],
  offer_around_you: ['ARMap', { screen: 'ARHowToUse' }],
  vouchers: ['loyaltyPoints', { screen: 'loyaltyPoints-vouchers-list' }],
  explore_my_rewards: ['loyaltyPoints', { screen: 'loyaltyPoints-main' }],
};

// Returns true if `redirectScreen` was recognized and navigation was performed.
export const handleRedirectScreen = (redirectScreen, navigate) => {
  const route = REDIRECT_SCREEN_ROUTES[redirectScreen];
  if (!route) return false;
  navigate(...route);
  return true;
};
