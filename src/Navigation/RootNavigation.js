import { createNavigationContainerRef, StackActions, CommonActions, DrawerActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

const ROOT_AUTH_SCREENS = new Set([
  'Boot',
  'OnBoarding',
  'Login',
  'ForgotPassword',
  'Register',
  'RegCodeVerification',
  'CodeConfirmation',
  'CreatePassword',
  'Verification',
  'PrivacyPolicy',
]);

const pendingActions = [];

/**
 * Analog of navigation.push(...)
 */
export function push(...args) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(...args));
  } else {
    pendingActions.push({ type: 'push', args });
  }
}

/**
 * Get navigation object directly if needed
 */
export const getNavigation = () => navigationRef.current;

/**
 * Closes the Drawer if one is currently mounted (i.e. the user is
 * authenticated — DrawerNavigator only exists under RootStack's "Main"
 * screen). Safe to call unconditionally from navigateDeep: every target it
 * navigates to lives inside the Drawer, so if the Drawer isn't mounted the
 * navigate itself is already a no-op/misuse in that context.
 */
export function closeDrawer() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(DrawerActions.closeDrawer());
  }
}

/**
 * Called when NavigationContainer is ready to flush queued actions
 */
export function flushPendingActions() {
  if (!navigationRef.isReady()) return;

  while (pendingActions.length) {
    const action = pendingActions.shift();
    if (!action) return;

    if (action.type === 'navigate') {
      navigate(action.name, action.params);
    } else if (action.type === 'push') {
      navigationRef.dispatch(StackActions.push(...action.args));
    }
  }
}

const SUB_STACK_MAP = {
  // LoyaltyPointsNavigator (MainStack: 'loyaltyPoints')
  'loyaltyPoints-main': 'loyaltyPoints',
  'loyaltyPoints-info': 'loyaltyPoints',
  'loyaltyPoints-transactions': 'loyaltyPoints',
  'loyaltyPoints-categories': 'loyaltyPoints',
  'loyaltyPoints-products-list': 'loyaltyPoints',
  'loyaltyPoints-products-info': 'loyaltyPoints',
  'loyaltyPoints-products-redeem': 'loyaltyPoints',
  'loyaltyPoints-vouchers-list': 'loyaltyPoints',
  'loyaltyPoints-vouchers-info': 'loyaltyPoints',
  'loyaltyPoints-vouchers-skipcache': 'loyaltyPoints',
  'loyaltyPoints-voucher-redeem': 'loyaltyPoints',
  'loyaltyPoints-vouchers-redeem-success': 'loyaltyPoints',
  'loyaltyPoints-giftCards-list': 'loyaltyPoints',
  'loyaltyPoints-giftCards-info': 'loyaltyPoints',
  'loyaltyPoints-giftCard-redeem': 'loyaltyPoints',
  'loyaltyPoints-partners-list': 'loyaltyPoints',
  'loyaltyPoints-partners-info': 'loyaltyPoints',
  'loyaltyPoints-partners-transfer': 'loyaltyPoints',
  'loyaltyPoints-partners-transfer-confirmation': 'loyaltyPoints',
  'loyaltyPoints-travel-list': 'loyaltyPoints',
  'loyaltyPoints-travel-info': 'loyaltyPoints',
  'loyaltyPoints-goods-list': 'loyaltyPoints',
  'loyaltyPoints-goods-info': 'loyaltyPoints',
  'loyaltyPoints-go-merchants-list': 'loyaltyPoints',
  'loyaltyPoints-go-merchants-info': 'loyaltyPoints',
  'clinics-list': 'loyaltyPoints',
  'clinics-info': 'loyaltyPoints',
  'clinics-appointment': 'loyaltyPoints',
  'clinics-appointment-confirmation': 'loyaltyPoints',
  'clinics-appointment-details': 'loyaltyPoints',
  'clinics-appointment-payment-status': 'loyaltyPoints',
  'clinics-appointment-skipcache': 'loyaltyPoints',
  'restaurant-book-table': 'loyaltyPoints',
  'restaurant-book-table-success': 'loyaltyPoints',
  'restaurants-list': 'loyaltyPoints',
  'restaurant-list': 'loyaltyPoints',
  'restaurant-info': 'loyaltyPoints',
  'restaurant-reservation-food-list': 'loyaltyPoints',
  'restaurant-delivery-address': 'loyaltyPoints',
  'restaurant-order-success': 'loyaltyPoints',
  'restaurant-skipcache': 'loyaltyPoints',
  'restaurant-check-payment-status': 'loyaltyPoints',
  'saloons-list': 'loyaltyPoints',
  'saloon-info': 'loyaltyPoints',
  'saloons-appointment': 'loyaltyPoints',
  'saloon-appointment-success': 'loyaltyPoints',
  'saloons-appointment-payment-status': 'loyaltyPoints',
  'saloons-appointment-skipcache': 'loyaltyPoints',

  // MerchantNavigator (MainStack: 'merchant')
  'merchant-info': 'merchant',
  'merchant-menu': 'merchant',

  // MerchantsNavigator (MainStack: 'merchants')
  'merchants-list': 'merchants',
  'newMerchants-list': 'merchants',
  'premiumMerchants-list': 'merchants',
  'merchants-filters': 'merchants',

  // OffersNavigator (MainStack: 'AllOffers')
  'offer-list': 'AllOffers',
  'offer-info': 'AllOffers',
  'offer-menu': 'AllOffers',
  'offer-book-hotel': 'AllOffers',
  'offer-apply-code-confirmation': 'AllOffers',
  'merchant-code-confirmation': 'AllOffers',

  // CategoriesNavigator (MainStack: 'categories')
  'categories-child': 'categories',

  // MyBookingsNavigator (MainStack: 'myBookings')
  'bookings-list': 'myBookings',
  'bookings-clinics-appointment': 'myBookings',
  'bookings-clinics-appointment-info': 'myBookings',
  'booking-restaurant-appointment': 'myBookings',
  'booking-restaurant-appointment-info': 'myBookings',
  'booking-restaurant-appointment-food-list': 'myBookings',
  'booking-restaurant-order-edit': 'myBookings',
  'booking-restaurant-order-info': 'myBookings',
  'booking-payment': 'myBookings',
  'booking-saloon-appointment-info': 'myBookings',

  // ARMapNavigator (MainStack: 'ARMap')
  'ARMerchants': 'ARMap',
  'ARHowToUse': 'ARMap',
  'ARCategories': 'ARMap',
};

export const navigateDeep = (screenName, params = {}) => {
  if (!navigationRef.isReady()) {
    pendingActions.push({ type: 'navigate', name: screenName, params });
    return;
  }

  // Every navigateDeep target lives inside the Drawer's content, one screen
  // ("Home") that never changes — so the Drawer doesn't auto-close on its
  // own when only the nested params change. Close it explicitly so callers
  // (drawer items, tab bar, deep links, notifications, thunks) don't each
  // need to remember to do it themselves.
  closeDrawer();

  const parentSubStack = SUB_STACK_MAP[screenName];

  let mainStackScreen;
  let mainStackParams;

  if (parentSubStack) {
    // If the target is a sub-stack screen (e.g. loyaltyPoints-categories)
    mainStackScreen = parentSubStack;
    mainStackParams = {
      screen: screenName,
      params,
    };
  } else {
    // Direct screen in MainStack
    mainStackScreen = screenName;
    mainStackParams = params;
  }

  // NOT wrapped in {name:'Main', params:{screen:'Home', ...}}: RootStack's
  // "Main" screen is permanently the focused route once authenticated, so a
  // navigate() targeting it by name hits React Navigation's "already on this
  // screen" shortcut and merges params onto that unchanging route WITHOUT
  // ever recursing into Drawer/Tabs/MainStack. Dispatching the MainStack
  // target directly by name isn't a RootStack/Drawer/Tabs screen name, so it
  // skips that shortcut and is resolved via nested-navigator auto-forwarding
  // through the currently-focused Drawer > Tabs > MainStack chain instead.
  const action = CommonActions.navigate({
    name: mainStackScreen,
    params: mainStackParams,
  });

  navigationRef.dispatch(action);
};

export function navigate(name, params) {
  if (!navigationRef.isReady()) {
    pendingActions.push({ type: 'navigate', name, params });
    return;
  }

  // If the target screen is directly on RootStack (e.g. auth screens)
  if (ROOT_AUTH_SCREENS.has(name)) {
    navigationRef.navigate(name, params);
    return;
  }

  // Otherwise, route into the nested MainStack (Main -> Home -> TabsBar -> screenName)
  navigateDeep(name, params);
}

export function canNavigate(routeName) {
  if (navigationRef.isReady()) {
    const state = navigationRef.getState();
    return state?.routes?.some(route => route.name === routeName);
  }
  return false;
}

