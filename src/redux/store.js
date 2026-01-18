import { applyMiddleware, combineReducers, createStore } from "redux";

import thunk from "redux-thunk";
import { authReducer } from "./auth/auth-reducer";
import { merchantReducer } from "./merchant/merchant-reducer";
import { transactionsReducer } from "./transactions/transactions-reducer";
import { notificationsReducer } from "./notifications/notifications-reducer";
import { loadersReducer } from "./loaders/loaders-reducer";
import { voucherReducer } from "./voucher/voucher-reducer";
import { giftcardsReducer } from "./giftCards/giftcards-reducer";
import { favouriteMerchantsReducer } from "./favouriteMerchants/favourite-merchants-reducer";
import { globalReducer } from "./global/global-reducer";
import { globalTixReducer } from "./globalTix/globalTix-reducer";
import { globalTixCartReducer } from "./globalTix/globalTix-cart-reducer";
import { cartReducer } from "./cart/cart-reducer";

let reducers = combineReducers({
  authReducer,
  merchantReducer,
  transactionsReducer,
  notificationsReducer,
  loadersReducer,
  voucherReducer,
  giftcardsReducer,
  favouriteMerchantsReducer,
  globalReducer,
  globalTix: globalTixReducer,
  globalTixCart: globalTixCartReducer,
  cartReducer,
});

let store = createStore(reducers, applyMiddleware(thunk));
export default store;
