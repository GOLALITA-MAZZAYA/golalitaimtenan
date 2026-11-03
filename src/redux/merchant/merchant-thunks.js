import { merchantApi } from './merchant-api';
import {
  setAdvert,
  setFavoriteOffers,
  setMerchantDetails,
  setMerchantDetailsLoading,
  setMerchantOffers,
  setMerchants,
  setOffers,
  setParentCategories,
  setParentCategoriesLoading,
} from './merchant-actions';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from '../../utils/secureStorage';
import { CONTENT_DISABLED } from '../auth/auth-types';
import {
  setIsMerchantsLoading,
  setIsOffersLoading,
} from '../loaders/loaders-actions';
import { showMessage } from 'react-native-flash-message';
import i18next from 'i18next';
import { logout } from '../auth/auth-thunks';
import { getOffsetAndLimit } from '../../../utils';
import { navigate, push } from '../../Navigation/RootNavigation';
import { setClickedNotificationData } from '../notifications/notifications-actions';
import { getMerchantDisscountForOffers, trackMerchantOpensCount } from '../../api/merchants';
import { getFavouriteMerchantsList } from '../favouriteMerchants/favourite-merchants-thunks';
import { org } from '../../org/config';
import { isEventsTicketsCategory } from '../../config/globalTix';
import trackActivity from '../../api/activityTracker';
import { rewriteAssetUrl } from '../../utils/rewriteAssetUrl';

const PARENT_CATEGORY_FIELDS =
  "['id','name','parent_id', 'x_name_arabic', 'x_image_url_2', 'image_url', 'x_image_url_3', 'x_image_url_4', 'x_gif_image', 'x_country_code', 'x_if_have_child_cat']";

const toParentCategoryList = result => {
  if (Array.isArray(result)) {
    return result;
  }
  if (Array.isArray(result?.data)) {
    return result.data;
  }
  if (result && typeof result === 'object' && !result.error) {
    const values = Object.values(result);
    if (
      values.length > 0 &&
      values.every(item => item && typeof item === 'object' && item.id != null)
    ) {
      return values;
    }
  }
  return [];
};

const isRootCategory = item => {
  const parent = item.parent_id;
  if (!parent || parent === false) {
    return true;
  }
  if (Array.isArray(parent)) {
    return !parent[0];
  }
  return false;
};

const CATEGORY_IMAGE_KEYS = [
  'x_image_url_2',
  'image_url',
  'x_image_url_3',
  'x_image_url_4',
  'x_gif_image',
  'image3',
];

const withRewrittenCategoryImages = categories =>
  categories.map(item => {
    const next = { ...item };
    CATEGORY_IMAGE_KEYS.forEach(key => {
      if (next[key]) {
        next[key] = rewriteAssetUrl(next[key]);
      }
    });
    // Search/v2 often leave x_image_url_2 as Odoo's empty camera PNG.
    // x_image3 is the actual category icon on both gcptest and www.
    if (!next.x_image_url_3 && next.id != null) {
      next.x_image_url_3 = `https://${org.baseUrl}/go/api/image/${next.id}/x_image3/partner.category`;
    }
    return next;
  });

export const getParentCategories = type => async (dispatch, getState) => {
  try {
    const token = getState().authReducer.token || (await getToken());
    if (!token) {
      return;
    }

    dispatch(setParentCategoriesLoading(true));

    const v2Params = {
      token,
      fields: PARENT_CATEGORY_FIELDS,
      type,
      org_id: org.id,
    };

    const v2Res = await merchantApi.getParentCategories({
      params: v2Params,
    });
    let categories = toParentCategoryList(v2Res.data?.result);

    // TEMP [EventsTickets] debug — remove after diagnosing live.
    console.log(
      `[EventsTickets] fetch type=${type} org=${org.id} base=${org.baseUrl} v2Count=${categories.length}`,
      categories.length ? '' : JSON.stringify(v2Res.data)?.slice(0, 500),
    );

    // gcptest /parent/category/v2 currently returns { error: "Failed to fetch categories" }.
    // Last resort: older search endpoint.
    if (!categories.length) {
      const searchRes = await merchantApi.getCategories({
        params: {
          token,
          fields: PARENT_CATEGORY_FIELDS,
        },
      });
      const roots = toParentCategoryList(searchRes.data?.result).filter(
        isRootCategory,
      );
      if (roots.length) {
        categories = roots;
      }
    }

    // TEMP [EventsTickets] debug — remove after diagnosing live.
    console.log(
      `[EventsTickets] final type=${type} count=${categories.length} hasEventsTickets=${categories.some(isEventsTicketsCategory)}`,
    );
    console.log(
      '[EventsTickets] categories:',
      categories.map(c => `${c.id} | ${c.name} | ${c.x_name_arabic || ''} | cc=${c.x_country_code || ''}`),
    );

    dispatch(setParentCategories(withRewrittenCategoryImages(categories)));
  } catch (err) {
    console.log('[EventsTickets] fetch error', type, err?.message, err?.response?.status);
  } finally {
    dispatch(setParentCategoriesLoading(false));
  }
};

// Every fresh list load (anything but a "next" page) starts a new generation.
// A response from an older generation is dropped: without this, a next-page
// request still in flight when the filters change gets appended to the new
// list, mixing merchants from two different filter sets.
let merchantListGeneration = 0;

export const getMerchantList =
  ({ page, transform, filters = {}, onGetData }) =>
    async (dispatch, getState) => {
      if (page !== 'next') {
        merchantListGeneration += 1;
      }
      const generation = merchantListGeneration;
      const isStale = () => generation !== merchantListGeneration;

      try {
        dispatch(setIsMerchantsLoading(true));

        if (page === 1) {
          dispatch(setMerchants({ data: [] }));
        }

        const { workStatus } = getState().authReducer;
        const token = await getToken();
        const isWorkStatusDisabled = workStatus === CONTENT_DISABLED;

        if (isWorkStatusDisabled) {
          if (!isStale()) {
            dispatch(setMerchants({ data: [] }));
            onGetData?.(0, getOffsetAndLimit(1).limit);
          }
          return;
        }

        const { merchantsPage } = getState().merchantReducer;

        const pageVal = page === 'next' ? merchantsPage + 1 : page;

        const params = {
          token,
          ...filters,
          ...getOffsetAndLimit(pageVal),
          x_org_linked: org.code,
        };

        const merchantsRes = await merchantApi.getAllMerchant({
          params,
        });

        const merchantsData = Array.isArray(merchantsRes?.data?.result)
          ? merchantsRes.data.result
          : [];

        if (isStale()) {
          return;
        }

        // Stop pagination when the page is short/empty (same rule as QLM).
        onGetData?.(merchantsData.length, params.limit);

        const data = transform ? transform(merchantsData) : merchantsData;

        const concat = !page || pageVal === 1 ? false : true;

        dispatch(setMerchants({ data, concat, page: pageVal }));
      } catch (err) {
        console.error('[MerchantList] /user/category/merchant/lists ERROR:', err);
        // Avoid infinite onEndReached retries when the request fails.
        if (!isStale()) {
          onGetData?.(0, getOffsetAndLimit(1).limit);
        }
      } finally {
        // A newer load owns the loading flag once this one is stale.
        if (!isStale()) {
          dispatch(setIsMerchantsLoading(false));
        }
      }
    };

export const getMerchantDetailsWithoutNavigate = (merchant_id) => async (dispatch) => {
  try {
    dispatch(setMerchantDetailsLoading(true));

    const token = await getToken();

    const res = await merchantApi.getMerchantDetails({
      params: {
        token,
        merchant_id,
      },
    });



    const ribbon_text = await getMerchantDisscountForOffers(merchant_id);

    res.data.result.ribbon_text = ribbon_text;

    await trackMerchantOpensCount(merchant_id);
    trackActivity('merchant_details_visit', { merchant_id, page_name: 'merchant_detail' });

    dispatch(setMerchantDetails({ ...res.data.result, id: merchant_id }));
  } catch (err) {
  } finally {
    dispatch(setMerchantDetailsLoading(false));
  }
}

export const getMerchantDetails =
  (merchant_id, navigation, t, title, isOrganization, isOnlineStore, isB1G1, restaurantId) =>
    async (dispatch, getState) => {
      try {
        dispatch(setMerchantDetailsLoading(true));

        const { workStatus } = getState().authReducer;
        const token = await getToken();

        let res;

        if (isOrganization) {
          res = await merchantApi.getOrganizationDetails({
            params: {
              token,
              org_id: merchant_id,
            },
          });
        } else {
          res = await merchantApi.getMerchantDetails({
            params: {
              token,
              merchant_id,
            },
          });

          const ribbon_text = await getMerchantDisscountForOffers(merchant_id);

          res.data.result.ribbon_text = ribbon_text;
        }

        if (res.data.result.error) {
          const apiError = res.data.result.error;

          showMessage({
            message: typeof apiError === "string" && apiError ? apiError : i18next.t("General.error"),
            type: "danger",
          });
          return;
        }

        dispatch(
          setMerchantDetails(
            workStatus === CONTENT_DISABLED
              ? []
              : {
                ...res.data.result,
                id: merchant_id,
                isOrganization,
                isB1G1,
                isOnlineStore,
              },
          ),
        );

        const { clickedNotification } = getState().notificationsReducer;

        if (clickedNotification) {
          dispatch(setClickedNotificationData(null));
        }

        if (navigation?.navigate) {
          navigation.navigate('merchant', {
            screen: 'merchant-info',
            params: {
              title,
              isOrganization,
              isOnlineStore,
              isB1G1,
              restaurantId,
            },
          });
        } else {
          navigate('merchant', {
            screen: 'merchant-info',
            params: {
              title,
              isOrganization,
              isOnlineStore,
              isB1G1,
              restaurantId,
            },
          });
        }

        await trackMerchantOpensCount(merchant_id);
        trackActivity('merchant_details_visit', { merchant_id, page_name: 'merchant_detail' });
      } catch (err) {
      } finally {
        dispatch(setMerchantDetailsLoading(false));
      }
    };


export const getOffers =
  ({
    merchant_id = null,
    merchant_category_id,
    page,
    params: additionalRequestParams = {},
    onGetData,
  }) =>
    async (dispatch, getState) => {
      try {
        dispatch(setIsOffersLoading(true));

        if (page === 1) {
          dispatch(
            setOffers({
              data: [],
              page: 1,
              concat: false,
            }),
          );
        }



        const { workStatus } = getState().authReducer;
        const { token } = getState().authReducer;

        const reqParams = merchant_id
          ? { token, merchant_id, ...additionalRequestParams }
          : merchant_category_id
            ? { token, merchant_category_id, ...additionalRequestParams }
            : { token, ...additionalRequestParams };

        let pageVal;

        let offsetAndLimit = {};
        if (page) {
          const { offersPage } = getState().merchantReducer;

          if (page === 'next') {
            pageVal = offersPage + 1;
            offsetAndLimit = getOffsetAndLimit(pageVal);
          } else if (typeof page === 'number') {
            pageVal = page;
            offsetAndLimit = getOffsetAndLimit(page);
          }
        }

        const params = Object.assign(reqParams, offsetAndLimit);


        const res = await merchantApi.getNewOffers({
          params,
        });
        // With show_total_count the backend also returns total_count; the
        // offers list may then sit under result.data / result.offers.
        const result = res?.data?.result;
        const resultData = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.offers)
              ? result.offers
              : [];
        const totalCount = result?.total_count ?? res?.data?.total_count;
        if (params.show_total_count) {
          console.log('[getOffers] total_count:', totalCount, 'result keys:',
            Array.isArray(result) ? 'array' : Object.keys(result || {}));
        }

        if (merchant_id)
          dispatch(
            setMerchantOffers(
              workStatus === CONTENT_DISABLED ? [] : resultData,
            ),
          );
        else {
          const concat = !page || pageVal === 1 ? false : true;

          onGetData?.(resultData.length, params.limit, totalCount);

          dispatch(
            setOffers({
              data: workStatus === CONTENT_DISABLED ? [] : resultData,
              page: pageVal,
              concat,
            }),
          );
        }
      } catch (err) {
      } finally {
        dispatch(setIsOffersLoading(false));
      }
    };

export const getOfferById = product_id => async (dispatch, getState) => {
  try {
    const { token } = getState().authReducer;
    const res = await merchantApi.getProductById({
      params: { product_id, token },
    });

    const product = res.data.result?.[0];

    push('ProductPage', { product });
  } catch (err) {
  } finally {
    dispatch(setClickedNotificationData(null));
  }
};

export const getFavoriteOffers =
  (isHideLoading, selectedCategory, isVouchers) =>
    async (dispatch, getState) => {
      try {
        const { workStatus } = getState().authReducer;
        const { token } = getState().authReducer;
        let body = { token, merchant_category_id: selectedCategory };
        if (isVouchers) {
          body = { ...body, is_voucher: 'True' };
        } else {
          body = { ...body, is_save: 'True' };
        }
        if (!isHideLoading) dispatch(setIsOffersLoading(true));

        const res = await merchantApi.getFavoriteOffers({
          params: body,
        });

        dispatch(
          setFavoriteOffers(workStatus === CONTENT_DISABLED ? [] : res.data.result),
        );
      } catch (err) {
      } finally {
        if (!isHideLoading) dispatch(setIsOffersLoading(false));
      }
    };

export const deleteAccount = () => async (dispatch, getState) => {
  const { token } = getState().authReducer;
  try {
    const res = await merchantApi.deleteAccount({
      params: {
        token,
      },
    });

    dispatch(logout());
  } catch (e) {
    showMessage({
      message: i18next.t('General.error'),
      type: 'danger',
    });
  }
};

const filterAdvertSlot = items =>
  (items || [])
    .filter(
      item =>
        !item.is_sjc &&
        (Platform.OS === 'android' ? item.x_android : item.x_ios),
    )
    .sort((a, b) => a.sequence - b.sequence);

// Home screen banners are Qatar-only; Global country screens fetch their own
// via getCountryBanners below.
export const getAdvert = () => async (dispatch, getState) => {
  const { token } = getState().authReducer;
  try {

    const res = await merchantApi.getAdvert({
      params: { token, country: 'QA' },
    });


    dispatch(
      setAdvert({
        ad_1: filterAdvertSlot(res.data?.result?.ad_1),
        ad_2: filterAdvertSlot(res.data?.result?.ad_2),
        ad_3: filterAdvertSlot(res.data?.result?.ad_3),
      }),
    );
  } catch (e) {
    // Home waits on !!advert — set empty slots so a failed banner call
    // doesn't leave the screen on an endless loader.
    dispatch(setAdvert({ ad_1: [], ad_2: [], ad_3: [] }));
  }
};

// Top-slot banners for one Global country screen (e.g. K.S.A). Returned
// rather than stored so it doesn't overwrite the Home screen's banners.
export const getCountryBanners = countryCode => async (dispatch, getState) => {
  const { token } = getState().authReducer;
  try {
    const res = await merchantApi.getAdvert({
      params: { token, country: countryCode },
    });
    return filterAdvertSlot(res.data?.result?.ad_1);
  } catch (e) {
    return [];
  }
};

export const trackBanner = body => async (dispatch, getState) => {
  const { token } = getState().authReducer;
  try {
    const res = await merchantApi.trackBanner({
      params: {
        token,
        ...body,
      },
    });
  } catch (e) {
  }
};

export const saveOffer =
  (offer_id, t, isVoucher) => async (dispatch, getState) => {
    const { token } = getState().authReducer;
    const { favoriteOffers } = getState().merchantReducer;

    const is_save =
      favoriteOffers?.find?.(o => o?.id === offer_id) !== undefined;


    try {
      let body = { token, product_id: offer_id };

      if (isVoucher) {
        body = { ...body, is_voucher: true };
      } else {
        body = { ...body, is_save: !is_save };
      }

      const res = await merchantApi.saveOffer({
        params: body,
      });
      if (res.data.result?.success) {
        showMessage({
          message: t('Product.saved'),
          type: 'success',
        });
      } else {
        showMessage({
          message: res.data.result?.error,
          type: 'danger',
        });
      }
      dispatch(getFavoriteOffers(true));
    } catch (e) {
      showMessage({
        message: t('General.error'),
        type: 'danger',
      });
    }
  };

export const toggleFavourites = merchant_id => async (dispatch, getState) => {
  const { token } = getState().authReducer;
  const { favouriteMerchants } = getState().favouriteMerchantsReducer;

  const customer_id = await AsyncStorage.getItem('tracking_partner_id');
  const isFavouriteMerchant = !!favouriteMerchants.find(
    item => item.merchant_id === merchant_id,
  );

  try {
    let body = { token, merchant_id: merchant_id, customer_id: customer_id };

    const api = isFavouriteMerchant
      ? merchantApi.removeMerchant
      : merchantApi.saveMerchant;

    const res = await api({
      params: body,
    });

    if (!res?.data?.result?.success) {
      showMessage({
        message: res.data.result?.error,
        type: 'danger',
      });
    }

    dispatch(getFavouriteMerchantsList(true));
  } catch (e) {
    showMessage({
      message: i18next.t('General.error'),
      type: 'danger',
    });
  }
};

export const redeem = (body, t) => async (dispatch, getState) => {
  const { token, user } = getState().authReducer;
  const userId = await AsyncStorage.getItem('userId');

  try {
    const res = await merchantApi.redeem({
      params: {
        token,
        customer_name: user.name,
        customer_phone: user.phone,
        customer_email: user.email,
        track_type: 'b1g1',
        track_value: body.merchant_code,
        product_id: body.product_id,
        track_date_time: new Date(),
        customer_id: userId,
      },
    });

    if (res.data.result === true) {
      showMessage({
        message: t('MainScreen.success'),
        type: 'success',
      });

      dispatch(track('b1g1', body.product_id, false, body.merchant_code));

      navigate('AllOffers', {
        screen: 'offer-apply-code-confirmation',
        params: {
          product_id: body.product_id,
          merchant_id: body.merchant_id,
        },
      });
    } else {

      const errroMsg =
        typeof res.data.result.error === 'string'
          ? res.data.result.error
          : t('General.error');

      showMessage({
        message: errroMsg,
        type: 'danger',
      });
    }
  } catch (e) {
    showMessage({
      message: t('General.error'),
      type: 'danger',
    });
  }
};

export const track =
  (track_type, product_id, isSendEmail, value, onFinishCallBack) =>
    async (dispatch, getState) => {
      const { token, user } = getState().authReducer;
      const userId = await AsyncStorage.getItem('tracking_partner_id');

      try {
        let body = {
          params: {
            token,
            customer_id: userId,
            customer_name: user.name,
            customer_phone: user.phone,
            customer_email: user.email,
            track_type,
            product_id,
            track_value: value,
            track_date_time: new Date(),
          },
        };
        if (isSendEmail) {
          const res = await merchantApi.sendEmail(body);
          onFinishCallBack?.();
        } else {
          const res = await merchantApi.track(body);
          onFinishCallBack?.();
        }
      } catch (e) {
      }
    };

