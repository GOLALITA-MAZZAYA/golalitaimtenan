import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  getMerchantDetails,
  trackBanner,
} from '../redux/merchant/merchant-thunks';
import { onBannerPress } from '../../utils';
import { CHARITY_MERCHANT_IDS } from '../constants';
import { handleRedirectScreen } from '../utils/redirectScreen';
import trackActivity from '../api/activityTracker';

// Shared tap handling for AdwertSwiper banners (Home and Global country screens).
const useBannerPress = ({ pageName, slot = 'ad_1' }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector(state => state.authReducer.user);

  return useCallback(
    item => {
      const openMerchant = (...args) => dispatch(getMerchantDetails(...args));

      trackActivity('home_banner_click', {
        reference: item.tracking_code || item.id,
        page_name: pageName,
        merchant_id: item.merchant_id || undefined,
        product_id: item.product_id || undefined,
        metadata: { slot },
      });

      if (
        item.redirectScreen &&
        handleRedirectScreen(item.redirectScreen, navigation.navigate)
      ) {
        return;
      }

      if (item.product_id) {
        navigation.navigate('AllOffers', {
          screen: 'offer-info',
          params: {
            productId: item.product_id,
            title: item.name,
          },
        });
        return;
      }

      if (item.name == 'Mumayizat') {
        navigation.navigate('MumayzInfo', {
          title: 'Mumayizat Oman',
        });
      } else if (item.internal) {
        if (item.merchant_id) {
          if (CHARITY_MERCHANT_IDS.includes(+item.merchant_id)) {
            navigation.navigate('Charities', { merchantId: item.merchant_id });
            return;
          }

          openMerchant(item.merchant_id, navigation, t);
        }
      } else {
        onBannerPress(
          item.banner_url,
          openMerchant,
          navigation,
          t,
          body => dispatch(trackBanner(body)),
          user,
          item.tracking_code,
        );
      }
    },
    [dispatch, navigation, pageName, slot, t, user],
  );
};

export default useBannerPress;
