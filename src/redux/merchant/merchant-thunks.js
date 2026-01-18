import { merchantApi } from './merchant-api';
import {
  setAdvert,
  setCategories,
  setFavoriteOffers,
  setInternationalClients,
  setLocalClients,
  setMerchantDetails,
  setMerchantDetailsLoading,
  setMerchantOffers,
  setMerchantProducts,
  setMerchants,
  setOffers,
  setOrganizations,
  setParentCategories,
  setParentCategoriesLoading,
  setPremiumBanners,
  setPremiumBannersLoading,
  setPremiumMerchants,
  setSocialMedia,
  setTravelCategories,
} from './merchant-actions';
import { CLIENT, PREMIUM, STANDARD } from '../types';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONTENT_DISABLED } from '../auth/auth-types';
import authApi from '../auth/auth-api';
import {
  setIsMerchantsLoading,
  setIsOffersLoading,
} from '../loaders/loaders-actions';
import { showMessage } from 'react-native-flash-message';
import { logout } from '../auth/auth-thunks';
import { getOffsetAndLimit, getOffsetAndLimitForOffers } from '../../../utils';
import { navigate, push } from '../../Navigation/RootNavigation';
import { setClickedNotificationData } from '../notifications/notifications-actions';
import axios from 'axios';
import { getMerchantDisscountForOffers, trackMerchantOpensCount } from '../../api/merchants';
import { getFavouriteMerchantsList } from '../favouriteMerchants/favourite-merchants-thunks';

export const getCategories = () => async (dispatch, getState) => {
  const { workStatus } = getState().authReducer;
  const token = await AsyncStorage.getItem('token');
  const res = await merchantApi.getCategories({
    params: {
      token,
      fields: "['id','name','image_url', 'x_image_url_2', 'x_name_arabic' ]",
    },
  });

  dispatch(
    setCategories(workStatus === CONTENT_DISABLED ? [] : res.data.result),
  );
};

const getSubCategoriesFunc = async (parentCategories, type, country) => {
  const newCategories = [];

  const token = await AsyncStorage.getItem('token');

  const getSubCategories = async id => {
    return new Promise(async resolve => {
      const res = await merchantApi.getParentCategoriesById({
        params: {
          token,
          type,
          country,
          parent_id: id,
          org_id: 1651,
        },
      });

      resolve(res.data.result);
    });
  };

  let i = 0;

  for (let item of parentCategories) {
    if (item.id) {
      const subCategories = await getSubCategories(item.id);

      newCategories.push({ ...item, children: subCategories });
    } else {
      newCategories.push({ ...item, children: [] });
    }

    i++;
  }

  return newCategories;
};

const getSubCategoriesFunc2 = async (parentCategories, token) => {
  const getSubCategories = async (id, token) => {
    return new Promise(async resolve => {
      const res = await merchantApi.getParentCategoriesById({
        params: {
          token,
          parent_id: id,
        },
      });

      resolve(res.data.result);
    });
  };

  const getSubCategoriesForOneCategory = async (newCategories, token) => {
    let i = 0;

    for (let item of newCategories) {
      const subCategories = await getSubCategories(item.id, token);

      newCategories[i].items = subCategories.map(item => ({
        title: item.name,
        id: item.id,
      }));

      if (subCategories.length) {
        await getSubCategoriesForOneCategory(newCategories[i].items, token);
      }

      i++;
    }

    return newCategories;
  };

  const newCategories = await getSubCategoriesForOneCategory(
    parentCategories,
    token,
  );

  return newCategories;
};

export const getParentCategories = type => async (dispatch, getState) => {
  try {
    dispatch(setParentCategoriesLoading(true));

    const token = await AsyncStorage.getItem('token');

    const params = {
      token,
      fields:
        "['id','name','parent_id', 'x_name_arabic', 'x_image_url_2', 'image_url', 'x_image_url_3', 'x_image_url_4', 'x_gif_image']",
      type,
      org_id: 1651,
    };

    const res = await merchantApi.getParentCategories({
      params,
    });

    dispatch(setParentCategories(res.data.result || []));
  } catch (err) {
    console.log(err, 'get parrent categories error');
  } finally {
    dispatch(setParentCategoriesLoading(false));
  }
};

export const getTravelSubCategories = () => async dispatch => {
  const token = await AsyncStorage.getItem('token');

  const res = await merchantApi.getParentCategoriesById({
    params: {
      token,
      parent_id: 60,
    },
  });

  const parentCategories =
    res.data.result?.map(item => ({
      title: item.name,
      ...item,
    })) || [];

  const newCategories = await getSubCategoriesFunc2(parentCategories, token);

  dispatch(setTravelCategories(newCategories));
};

export const getPremiumBanners =
  ({ page }) =>
  async (dispatch, getState) => {
    setPremiumBannersLoading(true);

    const { premiumBannersPage } = getState().merchantReducer;
    const pageVal = page === 'next' ? premiumBannersPage + 1 : page;
    const concat = !page || pageVal === 1 ? false : true;

    const token = await AsyncStorage.getItem('token');

    const userRes = await authApi.getUserBanners({
      params: {
        token,
        ...getOffsetAndLimit(pageVal),
      },
    });

    const banners = userRes.data.result;

    const sortedBanners = banners.sort((a, b) =>
      a.x_sequence > b.x_sequence ? 1 : -1,
    );

    dispatch(setPremiumBanners({ data: sortedBanners, concat, page: pageVal }));
  };

export const getMerchantList =
  ({ page, transform, filters = {}, onGetData }) =>
  async (dispatch, getState) => {
    dispatch(setIsMerchantsLoading(true));

    if (page === 1) {
      dispatch(setMerchants({ data: [] }));
    }

    const { workStatus } = getState().authReducer;
    const token = await AsyncStorage.getItem('token');
    const isWorkStatusDisabled = workStatus === CONTENT_DISABLED;

    if (isWorkStatusDisabled) {
      setMerchants({ data: [] });
      return;
    }

    const { merchantsPage } = getState().merchantReducer;

    const pageVal = page === 'next' ? merchantsPage + 1 : page;

    const params = {
      token,
      ...filters,
      ...getOffsetAndLimit(pageVal),
      x_org_linked: 'golalita',
    };


    const merchantsRes = await merchantApi.getAllMerchant({
      params,
    });

    const merchantsData = merchantsRes.data.result;

    onGetData?.(merchantsData?.length, params.limit);

    const sortedMerchants = merchantsData;

    const data = transform ? transform(sortedMerchants) : sortedMerchants;

    const concat = !page || pageVal === 1 ? false : true;

    dispatch(setMerchants({ data, concat, page: pageVal }));

    dispatch(setIsMerchantsLoading(false));
  };

export const getMerchants =
  (type, category_id, isSkip, mapRef, setPressedItem) =>
  async (dispatch, getState) => {
    const { workStatus } = getState().authReducer;
    const token = await AsyncStorage.getItem('token');
    let res;
    if (type === CLIENT || type === PREMIUM || type === STANDARD) {
      if (!isSkip) dispatch(setIsMerchantsLoading(true));

      res = await merchantApi.getMerchant({
        params: {
          token,
          domain: `[['go_entity', '=', 'merchant'] 
        ${type ? `, ['merchant_type', '=', '${type}']` : ''}]`,
          fields:
            "['id','name','image_url', 'partner_latitude', 'partner_longitude', 'x_online_store']",
        },
      });

      dispatch(
        setPremiumMerchants(
          workStatus === CONTENT_DISABLED ? [] : res.data.result,
        ),
      );
    } else {
      if (!isSkip) {
        dispatch(setIsMerchantsLoading(true));
        // dispatch(setMerchants({ data: [], concat: false, page: 1 }));
      }

      if (!setPressedItem) {
        res = await authApi.getUserData({
          params: {
            token,
          },
        });

        const data =
          workStatus === CONTENT_DISABLED
            ? []
            : res.data.result.banners.sort((a, b) =>
                a.x_sequence > b.x_sequence ? 1 : -1,
              );

        dispatch(setPremiumBanners({ data }));
      }

      res = await merchantApi.getAllMerchant({
        params: { token, category_id },
      });
      // if (!isSkip) dispatch(setIsMerchantsLoading(false));

      dispatch(
        setMerchants({
          data:
            workStatus === CONTENT_DISABLED
              ? []
              : res.data.result.sort((a, b) =>
                  a.x_sequence > b.x_sequence ? 1 : -1,
                ),
          concat: false,
          page: 1,
        }),
      );

      if (!isSkip) dispatch(setIsMerchantsLoading(false));

      if (mapRef) {
        mapRef.current?.animateToRegion({
          latitude: res.data.result[0].partner_latitude - 0.004,
          longitude: res.data.result[0].partner_longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
        if (setPressedItem) setPressedItem(res.data.result[0]);
      }
    }
  };

export const getMerchantDetails =
  (merchant_id, navigation, t, title, isOrganization, isOnlineStore, isB1G1) =>
  async (dispatch, getState) => {
    dispatch(setMerchantDetailsLoading(true));

    const { workStatus } = getState().authReducer;
    const token = await AsyncStorage.getItem('token');

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

    navigate('merchant', {
      screen: 'merchant-info',
      params: {
        title,
        isOrganization,
        isOnlineStore,
        isB1G1,
      },
    });

    await trackMerchantOpensCount(merchant_id);

    dispatch(setMerchantDetailsLoading(false));
    
  };

const getNewMerchantIdsToGroupe = (offers, oldMerchantIds) => {
  const idsObj = {...oldMerchantIds};

  offers.forEach((item) => idsObj[item.merchant_id] = true );

  return idsObj
};

const removeDuplicateOffers = (offers, merchantIdSet) => {
  const seen = new Set(merchantIdSet);
  const result = [];

  for (const offer of offers) {
    const id = String(offer.merchant_id); 

    if (!seen.has(id)) {
      seen.add(id);
      result.push(offer);
    }
  }

  return { offers: result, nextMerchantIds: seen };
};


export const getGroupedByMerchantOffers =
  ({ page, onGetData, params = {} }) =>
  async (dispatch, getState) => {
    dispatch(setIsOffersLoading(true));

    try {
      if (page === 1) {
        dispatch(
          setOffers({
            data: [],
            page: 1,
            concat: false,
            merchantIdsToGroup: {},
          })
        );
      }

      const { token } = getState().authReducer;
      const { offersPage, merchantIdsToGroup } =
        getState().merchantReducer;

      const pageVal =
        typeof page === "number" ? page : offersPage + 1;

      const offsetAndLimit = getOffsetAndLimitForOffers(
        pageVal,
        10
      );

      const res = await merchantApi.getNewOffers({
        params: { token, ...offsetAndLimit, ...params },
      });

      const newOffers = res.data.result ?? [];

      // No more data from API
      if (!newOffers.length) {
        onGetData?.(0, offsetAndLimit.limit);
        return;
      }

      const merchantIdSet = new Set(
        Object.keys(merchantIdsToGroup)
      );

      const { offers: groupedOffers, nextMerchantIds } =
        removeDuplicateOffers(newOffers, merchantIdSet);

      // All offers were duplicates
      if (!groupedOffers.length) {
        onGetData?.(newOffers.length, offsetAndLimit.limit);

        // No more pages → stop
        if (newOffers.length < offsetAndLimit.limit) {
          return;
        }

        // Try next page
        dispatch(
          getGroupedByMerchantOffers({
            page: pageVal + 1,
            onGetData,
          })
        );
        return;
      }

      onGetData?.(newOffers.length, offsetAndLimit.limit);

      dispatch(
        setOffers({
          data: groupedOffers,
          page: pageVal,
          concat: true,
          merchantIdsToGroup: Object.fromEntries(
            [...nextMerchantIds].map((id) => [id, true])
          ),
        })
      );
    } catch (error) {
      console.error("getGroupedByMerchantOffers error:", error);
    } finally {
      dispatch(setIsOffersLoading(false));
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

    if (merchant_id)
      dispatch(
        setMerchantOffers(
          workStatus === CONTENT_DISABLED ? [] : res.data.result,
        ),
      );
    else {
      const concat = !page || pageVal === 1 ? false : true;
      const data = res.data.result;

      onGetData?.(data?.length, params.limit);

      dispatch(
        setOffers({
          data: workStatus === CONTENT_DISABLED ? [] : data,
          page: pageVal,
          concat,
        }),
      );
    }

    dispatch(setIsOffersLoading(false));
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
    console.log(err, 'get offer by id error');
  } finally {
    dispatch(setClickedNotificationData(null));
  }
};

export const getProducts =
  ({ merchant_id, page }) =>
  async (dispatch, getState) => {
    const { workStatus } = getState().authReducer;
    const { token } = getState().authReducer;

    const params = {
      token,
      fields:
        "['name', 'lst_price', 'default_code','description', 'barcode', 'image_url']",
      domain: `[['merchant_id', '=', ${merchant_id}]]`,
    };

    let pageVal = page;

    if (pageVal) {
      if (pageVal === 1) {
        params = { ...params, ...getOffsetAndLimit(1) };
      }

      if (page === 'next') {
        const { merchantProductsPage } = getState().merchantReducer;

        pageVal = merchantProductsPage + 1;
        params = { ...params, ...getOffsetAndLimit(pageVal) };
      }
    }

    const res = await merchantApi.getProducts({
      params,
    });

    dispatch(
      setMerchantProducts({
        merchantProducts:
          workStatus === CONTENT_DISABLED ? [] : res.data.result,
        merchantProductsPage: pageVal,
      }),
    );
  };

export const getFavoriteOffers =
  (isHideLoading, selectedCategory, isVouchers) =>
  async (dispatch, getState) => {
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

    if (!isHideLoading) dispatch(setIsOffersLoading(false));
    dispatch(
      setFavoriteOffers(workStatus === CONTENT_DISABLED ? [] : res.data.result),
    );
  };

export const getLocalClients = () => async (dispatch, getState) => {
  const token = await AsyncStorage.getItem('token');
  try {
    const res = await merchantApi.getMerchant({
      params: {
        token: token,
        domain: "[ ['local_client', '=', True]]",
        fields: "['id','name','image_url','x_sequence', 'create_date']",
        ...getOffsetAndLimit(1),
      },
    });

    dispatch(
      setLocalClients(
        res.data.result.sort((a, b) =>
          new Date(a.create_date) > new Date(b.create_date) ? -1 : 1,
        ),
      ),
    );
  } catch (e) {
    console.log(e);
  }
};
export const getInternationalClients = () => async (dispatch, getState) => {
  const token = await AsyncStorage.getItem('token');
  try {
    const res = await merchantApi.getMerchant({
      params: {
        token: token,
        domain: "[ ['int_client', '=', True]]",
        fields: "['id','name','image_url','x_sequence', 'create_date']",
      },
    });
    dispatch(
      setInternationalClients(
        res.data.result.sort((a, b) => (a.x_sequence > b.x_sequence ? 1 : -1)),
      ),
    );
  } catch (e) {
    console.log(e);
  }
};

export const getOrganizations =
  ({ transform }) =>
  async (dispatch, getState) => {
    const { token } = getState().authReducer;
    try {
      dispatch(setIsMerchantsLoading(true));
      const res = await merchantApi.getOrganizations({
        params: {
          token,
        },
      });

      const data = res.data.result
        .map(d => ({
          ...d,
          merchant_logo: d.org_logo,
          banner_image: d.org_banner,
          merchant_id: d.org_id,
          merchant_name: d.org_name,
          name: d.org_name,
          isOrganization: true,
        }))
        .sort((a, b) => (a.x_sequence > b.x_sequence ? 1 : -1));

      dispatch(setOrganizations(transform ? transform(data) : data));
      dispatch(setIsMerchantsLoading(false));
    } catch (e) {
      console.log(e);
    }
  };

export const bookNow =
  (body, t, setIsSuccessBook) => async (dispatch, getState) => {
    const { token } = getState().authReducer;

    try {
      const res = await axios.post(
        'https://golalitatwffer.com/api/go/sendinblue_email/V2',
        {
          params: {
            ...body,
            token,
          },
        },
      );

      console.log(res.data, 'res');

      if (res.data?.result?.success) {
        showMessage({
          message: t('Profile.submitSuccess'),
          type: 'success',
        });

        setIsSuccessBook(true);
      } else {
        showMessage({
          message: t('Login.somethingWrong'),
          type: 'success',
        });
      }
    } catch (e) {
      console.log(e.message, 'error');
      console.log(e);
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
    console.log(e);
  }
};

export const getAdvert = () => async (dispatch, getState) => {
  const { token } = getState().authReducer;
  try {
    const res = await merchantApi.getAdvert({
      params: { token },
    });

    dispatch(
      setAdvert({
        ad_1: res.data.result.ad_1
          .filter(
            item =>
              !item.is_sjc &&
              (Platform.OS === 'android' ? item.x_android : item.x_ios),
          )
          .sort((a, b) => a.sequence - b.sequence),
        ad_2: res.data.result.ad_2
          .filter(
            item =>
              !item.is_sjc &&
              (Platform.OS === 'android' ? item.x_android : item.x_ios),
          )
          .sort((a, b) => a.sequence - b.sequence),
        ad_3: res.data.result.ad_3
          .filter(
            item =>
              !item.is_sjc &&
              (Platform.OS === 'android' ? item.x_android : item.x_ios),
          )
          .sort((a, b) => a.sequence - b.sequence),
      }),
    );
  } catch (e) {
    console.log(e);
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
    console.log(e);
  }
};

export const getSocialMedia = () => async (dispatch, getState) => {
  const { token } = getState().authReducer;
  try {
    const res = await merchantApi.getSocialMedia({
      params: {
        token,
      },
    });
    dispatch(setSocialMedia(res.data.result[0]));
  } catch (e) {
    console.log(e);
  }
};

export const saveOffer =
  (offer_id, t, isVoucher) => async (dispatch, getState) => {
    const { token } = getState().authReducer;
    const { favoriteOffers } = getState().merchantReducer;

    const is_save =
      favoriteOffers?.find?.(o => o?.id === offer_id) !== undefined;

    console.log(!is_save, offer_id, '!is_save');

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
      console.log(e);
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
    console.log(e);
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
    console.log(e);
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
        console.log('send email', res.data);
        onFinishCallBack?.();
      } else {
        const res = await merchantApi.track(body);
        console.log('track', res.data);
        onFinishCallBack?.();
      }
    } catch (e) {
      console.log(e);
    }
  };
