import { openScreen } from '../Navigation/RootNavigation';

// Maps redirectScreen keys to MainStack destinations
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

/**
 * Returns true if `redirectScreen` was recognized and navigation was performed.
 * Always uses openScreen so back returns to the previous screen.
 */
export const handleRedirectScreen = (redirectScreen, navigateFn = openScreen) => {
  if (redirectScreen == null || typeof navigateFn !== 'function') {
    return false;
  }

  const key = String(redirectScreen).trim().toLowerCase();
  const route = REDIRECT_SCREEN_ROUTES[key];
  if (!route) return false;

  navigateFn(...route);
  return true;
};
