// src/Navigation/RootNavigation.js
import {
  createNavigationContainerRef,
  StackActions,
  CommonActions,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

const pendingActions = [];

// Nested screens → their MainStack parent navigator.
// RootNavigation.navigate('offer-info') becomes navigate('AllOffers', { screen: 'offer-info' }).
const SUB_STACK_MAP = {
  // MerchantsNavigator
  'merchants-list': 'merchants',
  'merchants-filters': 'merchants',
  'newMerchants-list': 'merchants',
  'premiumMerchants-list': 'merchants',

  // OffersNavigator (MainStack: AllOffers)
  'offer-info': 'AllOffers',
  'offer-menu': 'AllOffers',
  'offer-apply-code-confirmation': 'AllOffers',
  'merchant-code-confirmation': 'AllOffers',

  // MerchantNavigator
  'merchant-info': 'merchant',
  'merchant-menu': 'merchant',

  // MyVouchersNavigator
  'myVouchers-list': 'myVouchers',
  'myVouchers-giftCard': 'myVouchers',
  'myVouchers-cardmolaGiftCard': 'myVouchers',
  'myVouchers-voucher': 'myVouchers',

  // LoyaltyPointsNavigator
  'loyaltyPoints-main': 'loyaltyPoints',
  'loyaltyPoints-info': 'loyaltyPoints',
  'loyaltyPoints-transactions': 'loyaltyPoints',
  'loyaltyPoints-categories': 'loyaltyPoints',
  'loyaltyPoints-products-list': 'loyaltyPoints',
  'loyaltyPoints-products-info': 'loyaltyPoints',
  'loyaltyPoints-products-redeem': 'loyaltyPoints',
  'loyaltyPoints-products-redeem-success': 'loyaltyPoints',
  'loyaltyPoints-vouchers-list': 'loyaltyPoints',
  'loyaltyPoints-vouchers-info': 'loyaltyPoints',
  'loyaltyPoints-vouchers-skipcache': 'loyaltyPoints',
  'loyaltyPoints-voucher-redeem': 'loyaltyPoints',
  'loyaltyPoints-vouchers-redeem-success': 'loyaltyPoints',
  'loyaltyPoints-giftCards-list': 'loyaltyPoints',
  'loyaltyPoints-giftCards-info': 'loyaltyPoints',
  'loyaltyPoints-giftCard-redeem': 'loyaltyPoints',
  'loyaltyPoints-giftCard-redeem-success': 'loyaltyPoints',
  'loyaltyPoints-partners-list': 'loyaltyPoints',
  'loyaltyPoints-partners-info': 'loyaltyPoints',
  'loyaltyPoints-partners-transfer': 'loyaltyPoints',
  'loyaltyPoints-travel-list': 'loyaltyPoints',
  'loyaltyPoints-goods-list': 'loyaltyPoints',
  'loyaltyPoints-goods-info': 'loyaltyPoints',

  // ARMapNavigator
  ARMerchants: 'ARMap',
  ARHowToUse: 'ARMap',
  ARCategories: 'ARMap',

  // CategoriesNavigator
  'categories-child': 'categories',
};

// Screens registered on MainStack (for pushToMainStack / navigateDeep).
const MAIN_STACK_SCREENS = new Set([
  'merchant',
  'ARMap',
  'AllOffers',
  'B1G1',
  'ProductPage',
  'card',
  'MapPage',
  'Notifications',
  'Profile',
  'ChangePassword',
  'Family',
  'Favorites',
  'Transactions',
  'Settings',
  'NotificationSettings',
  'ContactUs',
  'Dashboard',
  'merchants',
  'loyaltyPoints',
  'myVouchers',
  'favouriteMerchants',
  'AddFamilyMember',
  'FamilyEmailVerification',
  'BookHotel',
  'SocialMedia',
  'Promocode',
  'offer-apply-code-confirmation',
  'Voucher',
  'OnlineStores',
  'GlobalTix',
  'ProductDetails',
  'GlobalTixCartScreen',
  'PrivacyPolicy',
  'delivery',
  'Website',
  'BillScanner',
  'BillScannerHoToUse',
  'categories',
  'MumayzInfo',
  'ProfileEmailVerification',
  'CodeConfirmation',
  'categories-child-mainstack',
  'Charities',
  'AiChat',
  'ESim',
  'Main',
]);

/**
 * Walk parent navigators and go back on the first that has history.
 */
export function safeGoBack(navigation = navigationRef) {
  if (!navigation) {
    return false;
  }

  let current = navigation;

  while (current) {
    if (typeof current.canGoBack === 'function' && current.canGoBack()) {
      current.goBack();
      return true;
    }

    current =
      typeof current.getParent === 'function' ? current.getParent() : null;
  }

  if (
    navigationRef.isReady() &&
    navigation !== navigationRef &&
    navigationRef.canGoBack()
  ) {
    navigationRef.goBack();
    return true;
  }

  return false;
}

export function goBackOrMain(navigation = navigationRef) {
  if (safeGoBack(navigation)) {
    return;
  }

  if (navigationRef.isReady()) {
    navigationRef.navigate('Main');
    return;
  }

  if (navigation && typeof navigation.navigate === 'function') {
    navigation.navigate('Main');
  }
}

const getMainStackKey = () => {
  if (!navigationRef.isReady()) {
    return null;
  }

  const findStackWithMain = state => {
    if (!state?.routes) {
      return null;
    }

    if (state.routes.some(route => route.name === 'Main')) {
      return state.key;
    }

    for (const route of state.routes) {
      const found = findStackWithMain(route.state);
      if (found) {
        return found;
      }
    }

    return null;
  };

  return findStackWithMain(navigationRef.getRootState());
};

const getMainStackState = () => {
  if (!navigationRef.isReady()) {
    return null;
  }

  const findStackWithMain = state => {
    if (!state?.routes) {
      return null;
    }

    if (state.routes.some(route => route.name === 'Main')) {
      return state;
    }

    for (const route of state.routes) {
      const found = findStackWithMain(route.state);
      if (found) {
        return found;
      }
    }

    return null;
  };

  return findStackWithMain(navigationRef.getRootState());
};

const routeExistsInState = (state, routeName) => {
  if (!state?.routes) {
    return false;
  }

  for (const route of state.routes) {
    if (route.name === routeName) {
      return true;
    }
    if (route.state && routeExistsInState(route.state, routeName)) {
      return true;
    }
  }

  return false;
};

const resolveMainStackTarget = (name, params) => {
  const parent = SUB_STACK_MAP[name];

  if (parent) {
    return {
      name: parent,
      params: {
        screen: name,
        params,
      },
    };
  }

  return { name, params };
};

/**
 * Push onto MainStack so Home / list stays under the new screen for back.
 *
 * Optimizations to stop unbounded stack growth:
 * 1) Same screen already on top → merge params (no push).
 * 2) Same screen exists earlier in MainStack → drop those copies, then push
 *    once (e.g. notification opens merchant while another merchant is under
 *    AllOffers). Keeps at most one instance of the target screen.
 */
export function pushToMainStack(name, params) {
  if (!navigationRef.isReady()) {
    pendingActions.push({ type: 'pushToMainStack', name, params });
    return;
  }

  const target = resolveMainStackTarget(name, params);
  const mainStackState = getMainStackState();

  if (!mainStackState?.routes) {
    navigationRef.navigate(target.name, target.params);
    return;
  }

  const stackKey = mainStackState.key ?? getMainStackKey();
  const activeRoutes = mainStackState.routes.slice(
    0,
    mainStackState.index + 1,
  );
  const topRoute = activeRoutes[activeRoutes.length - 1];

  if (topRoute?.name === target.name) {
    navigationRef.navigate({
      name: target.name,
      params: target.params,
      merge: true,
    });
    return;
  }

  const hasDuplicate = activeRoutes.some(route => route.name === target.name);

  if (!hasDuplicate && stackKey) {
    navigationRef.dispatch({
      ...StackActions.push(target.name, target.params),
      target: stackKey,
    });
    return;
  }

  // Rebuild MainStack without prior copies of this screen, then place the
  // new route on top so back still returns to Home / merchants / etc.
  const preservedRoutes = activeRoutes
    .filter(route => route.name !== target.name)
    .map(route => ({
      key: route.key,
      name: route.name,
      params: route.params,
      state: route.state,
    }));

  const nextRoutes = [
    ...preservedRoutes,
    {
      name: target.name,
      params: target.params,
    },
  ];

  if (stackKey) {
    navigationRef.dispatch({
      ...CommonActions.reset({
        index: nextRoutes.length - 1,
        routes: nextRoutes,
      }),
      target: stackKey,
    });
    return;
  }

  navigationRef.navigate(target.name, target.params);
}

/**
 * Default in-app navigate. Resolves nested routes so RootNavigation.navigate
 * ('offer-info' / 'loyaltyPoints-*' / 'merchants-filters') keeps working.
 * For external opens that must keep back history, use pushToMainStack().
 *
 * When the nested parent is already mounted (e.g. offers list → offer-info),
 * navigate by the child screen name. Remapping to parent+screen can no-op
 * because MainStack's AllOffers and the list screen share the same name.
 */
export function navigate(name, params) {
  if (!navigationRef.isReady()) {
    pendingActions.push({ type: 'navigate', name, params });
    return;
  }

  const parent = SUB_STACK_MAP[name];

  if (parent) {
    const rootState = navigationRef.getRootState();
    const parentMounted = routeExistsInState(rootState, parent);

    if (parentMounted) {
      navigationRef.navigate({
        name,
        params,
        merge: true,
      });
      return;
    }

    navigationRef.navigate({
      name: parent,
      params: {
        screen: name,
        params,
      },
      merge: true,
    });
    return;
  }

  // Caller already passed a parent + nested screen (e.g. AllOffers / offer-info).
  if (params?.screen) {
    navigationRef.navigate({
      name,
      params,
      merge: true,
    });
    return;
  }

  navigationRef.navigate(name, params);
}

/**
 * Deep links / redirects: push MainStack screens so back works.
 */
export function navigateDeep(name, params) {
  const target = resolveMainStackTarget(name, params);

  if (MAIN_STACK_SCREENS.has(target.name) || SUB_STACK_MAP[name]) {
    pushToMainStack(name, params);
    return;
  }

  navigate(name, params);
}

export function push(...args) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(...args));
  } else {
    pendingActions.push({ type: 'push', args });
  }
}

export const getNavigation = () => navigationRef.current;

export function flushPendingActions() {
  if (!navigationRef.isReady()) return;

  while (pendingActions.length) {
    const action = pendingActions.shift();
    if (!action) return;

    if (action.type === 'navigate') {
      navigate(action.name, action.params);
    } else if (action.type === 'push') {
      navigationRef.dispatch(StackActions.push(...action.args));
    } else if (action.type === 'pushToMainStack') {
      pushToMainStack(action.name, action.params);
    }
  }
}
