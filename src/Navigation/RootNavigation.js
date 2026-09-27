// src/Navigation/RootNavigation.js
import {
  createNavigationContainerRef,
  StackActions,
  CommonActions,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/**
 * Nested child → MainStack parent.
 * Tree: Drawer(Home) → MainStack → [Main | merchant | AllOffers | …]
 */
const NESTED_PARENT = {
  'merchants-list': 'merchants',
  'merchants-filters': 'merchants',
  'newMerchants-list': 'merchants',
  'premiumMerchants-list': 'merchants',

  'offers-list': 'AllOffers',
  'offer-info': 'AllOffers',
  'offer-menu': 'AllOffers',
  'offer-apply-code-confirmation': 'AllOffers',
  'merchant-code-confirmation': 'AllOffers',

  'merchant-info': 'merchant',
  'merchant-menu': 'merchant',

  'myVouchers-list': 'myVouchers',
  'myVouchers-giftCard': 'myVouchers',
  'myVouchers-cardmolaGiftCard': 'myVouchers',
  'myVouchers-voucher': 'myVouchers',

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

  ARMerchants: 'ARMap',
  ARHowToUse: 'ARMap',
  ARCategories: 'ARMap',

  'categories-child': 'categories',
};

const MAIN_STACK_SCREENS = new Set([
  'Main',
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
]);

/** Bottom-bar destinations (fake tabs on MainStack). */
export const TAB_SCREENS = new Set(['Main', 'MapPage', 'card', 'Profile']);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const findMainStackState = state => {
  if (!state?.routes) {
    return null;
  }

  // MainStack is the navigator that contains the Home screen "Main".
  if (state.routes.some(route => route.name === 'Main')) {
    return state;
  }

  for (const route of state.routes) {
    const found = findMainStackState(route.state);
    if (found) {
      return found;
    }
  }

  return null;
};

const getMainStackState = () => {
  if (!navigationRef.isReady()) {
    return null;
  }
  return findMainStackState(navigationRef.getRootState());
};

/** Focused MainStack route name (e.g. Main, MapPage, merchant). */
export function getFocusedMainStackRouteName() {
  const mainStackState = getMainStackState();
  if (!mainStackState?.routes?.length) {
    return 'Main';
  }
  return (
    mainStackState.routes[mainStackState.index ?? 0]?.name ?? 'Main'
  );
}

/** Which tab icon should be selected, or null when on a non-tab screen. */
export function getActiveTabRouteName() {
  const name = getFocusedMainStackRouteName();
  return TAB_SCREENS.has(name) ? name : null;
}

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
  const parent = NESTED_PARENT[name];

  if (parent) {
    if (params?.screen) {
      return { name: parent, params };
    }
    return {
      name: parent,
      params: {
        screen: name,
        params,
      },
    };
  }

  // Opening AllOffers list explicitly.
  if (name === 'AllOffers' && !params?.screen) {
    return {
      name: 'AllOffers',
      params: {
        screen: 'offers-list',
        params: params ?? undefined,
      },
    };
  }

  return { name, params };
};

const dispatchOnMainStack = (action, stackKey) => {
  if (stackKey) {
    navigationRef.dispatch({ ...action, target: stackKey });
    return;
  }
  navigationRef.dispatch(action);
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Push onto MainStack so Home / previous screens stay underneath for back.
 * Use for notifications, deep links, banners, modals, drawer, merchants, tabs.
 */
export function openScreen(name, params) {
  if (!navigationRef.isReady()) {
    return;
  }

  if (name === 'Main' || name === 'home') {
    goHome();
    return;
  }

  const target = resolveMainStackTarget(name, params);
  const mainStackState = getMainStackState();

  if (!mainStackState?.routes) {
    navigationRef.navigate(target.name, target.params);
    return;
  }

  const stackKey = mainStackState.key;
  const activeRoutes = mainStackState.routes.slice(
    0,
    mainStackState.index + 1,
  );
  const topRoute = activeRoutes[activeRoutes.length - 1];

  if (topRoute?.name === target.name) {
    dispatchOnMainStack(
      StackActions.replace(target.name, target.params),
      stackKey,
    );
    return;
  }

  const firstIdx = activeRoutes.findIndex(route => route.name === target.name);

  if (firstIdx === -1) {
    dispatchOnMainStack(
      StackActions.push(target.name, target.params),
      stackKey,
    );
    return;
  }

  const preservedRoutes = activeRoutes.slice(0, firstIdx).map(route => ({
    key: route.key,
    name: route.name,
    params: route.params,
    state: route.state,
  }));

  dispatchOnMainStack(
    CommonActions.reset({
      index: preservedRoutes.length,
      routes: [
        ...preservedRoutes,
        {
          name: target.name,
          params: target.params,
        },
      ],
    }),
    stackKey,
  );
}

/**
 * Navigate inside an already-mounted nested stack (list → detail).
 * Falls back to openScreen when the parent is not mounted.
 */
export function navigateNested(name, params) {
  if (!navigationRef.isReady()) {
    return;
  }

  const parent = NESTED_PARENT[name];

  if (parent) {
    const rootState = navigationRef.getRootState();
    if (routeExistsInState(rootState, parent)) {
      navigationRef.navigate({
        name,
        params,
        merge: true,
      });
      return;
    }
    openScreen(name, params);
    return;
  }

  if (params?.screen || MAIN_STACK_SCREENS.has(name)) {
    openScreen(name, params);
    return;
  }

  navigationRef.navigate(name, params);
}

/**
 * Return to Home (Main).
 * - Already on Main → no-op (avoids remount / “new Home under Home” animation)
 * - Detail screens above Main → popToTop (React Navigation’s usual pattern)
 */
export function goHome() {
  if (!navigationRef.isReady()) {
    return;
  }

  const mainStackState = getMainStackState();
  const stackKey = mainStackState?.key;

  if (!mainStackState?.routes?.length || !stackKey) {
    navigationRef.navigate('Main');
    return;
  }

  const activeRoutes = mainStackState.routes.slice(
    0,
    mainStackState.index + 1,
  );
  const topRoute = activeRoutes[activeRoutes.length - 1];

  // Already on Home — do not reset/remount.
  if (topRoute?.name === 'Main' && mainStackState.index === 0) {
    return;
  }

  // Main is the initial route; pop everything above it.
  if (activeRoutes.some(route => route.name === 'Main')) {
    dispatchOnMainStack(StackActions.popToTop(), stackKey);
    return;
  }

  dispatchOnMainStack(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    }),
    stackKey,
  );
}

/**
 * Switch a bottom-tab destination (Map / Card / Profile / Home).
 * Keeps a single tab screen above Main — does not stack tabs on each other.
 */
export function openTab(name, params) {
  if (!navigationRef.isReady()) {
    return;
  }

  if (name === 'Main' || name === 'home') {
    goHome();
    return;
  }

  if (!TAB_SCREENS.has(name)) {
    openScreen(name, params);
    return;
  }

  const mainStackState = getMainStackState();
  const stackKey = mainStackState?.key;

  if (!mainStackState?.routes?.length || !stackKey) {
    navigationRef.navigate(name, params);
    return;
  }

  const topRoute = mainStackState.routes[mainStackState.index ?? 0];

  // Already on this tab — no remount.
  if (topRoute?.name === name) {
    return;
  }

  dispatchOnMainStack(
    CommonActions.reset({
      index: 1,
      routes: [{ name: 'Main' }, { name, params }],
    }),
    stackKey,
  );
}

export function goBack(navigation = navigationRef) {
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

export function goBackOrHome(navigation = navigationRef) {
  if (goBack(navigation)) {
    return true;
  }

  const mainStackState = getMainStackState();
  const top =
    mainStackState?.routes?.[mainStackState.index ?? 0];

  // Already on Home root — match “no Header back”: let Android exit the app.
  if (top?.name === 'Main' && mainStackState.index === 0) {
    return false;
  }

  // No MainStack (e.g. auth) and nowhere to go — system default.
  if (!mainStackState) {
    return false;
  }

  goHome();
  return true;
}

/**
 * Smart in-app navigate. Prefer openScreen / navigateNested when intent is clear.
 */
export function navigate(name, params) {
  if (!navigationRef.isReady()) {
    return;
  }

  if (name === 'Main' || name === 'home') {
    goHome();
    return;
  }

  if (NESTED_PARENT[name]) {
    navigateNested(name, params);
    return;
  }

  if (params?.screen || MAIN_STACK_SCREENS.has(name)) {
    openScreen(name, params);
    return;
  }

  navigationRef.navigate(name, params);
}

export function push(...args) {
  if (!navigationRef.isReady()) {
    return;
  }
  navigationRef.dispatch(StackActions.push(...args));
}

export const getNavigation = () => navigationRef.current;
