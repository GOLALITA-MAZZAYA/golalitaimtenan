// Maps redirectScreen keys to drawer destinations
// (gift cards & vouchers).
// myVouchers-list tabs: selectedPage "0" = vouchers, "1" = gift cards.
const REDIRECT_SCREEN_ROUTES = {
  giftcard: [
    'myVouchers',
    { screen: 'myVouchers-list', params: { selectedPage: '1' } },
  ],
  vouchers: [
    'myVouchers',
    { screen: 'myVouchers-list', params: { selectedPage: '0' } },
  ],
  offer_around_you: ['ARMap', { screen: 'ARHowToUse' }],
};

// Returns true if `redirectScreen` was recognized and navigation was performed.
export const handleRedirectScreen = (redirectScreen, navigate) => {
  if (redirectScreen == null || typeof navigate !== 'function') {
    return false;
  }

  const key = String(redirectScreen).trim().toLowerCase();
  const route = REDIRECT_SCREEN_ROUTES[key];
  if (!route) return false;

  navigate(...route);
  return true;
};
