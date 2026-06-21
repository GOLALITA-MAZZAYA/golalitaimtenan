import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import MainLayout from '../../components/MainLayout';
import { SCREEN_HEIGHT } from '../../styles/mainStyles';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import { connect } from 'react-redux';
import {
  getMerchantDetails,
  trackBanner,
} from '../../redux/merchant/merchant-thunks';
import { useTranslation } from 'react-i18next';
import { onBannerPress } from '../../../utils';
import { handleNotificationClick } from '../../pushNotifications/notificationClickHandler';
import AdwertSwiper from '../../components/AdwertSwiper/AdwertSwiper';
import { ScrollView } from 'react-native-gesture-handler';
import { setIsSplashScreenVisible } from '../../redux/auth/auth-actions';
import Categories from './components/Categories';
import NotificationModal from '../../components/NotificationModal/NotificationModal';
import MarketingPopupModal from '../../components/MarketingPopupModal/MarketingPopupModal';
import { getMarketingPopupThunk } from '../../redux/global/global-thunks';
import MerchantListHeader from '../MerchantsPage/components/MerchantsHeader';
import Header from '../../components/Header';
import AdwertisementModal from './components/AdwertisementModal';
import { CHARITY_MERCHANT_IDS } from '../../constants';

const MainScreen = ({
  navigation,
  user,
  getMerchantDetails,
  advert,
  clickedNotification,
  trackBanner,
  setIsSplashScreenVisible,
  getMarketingPopupThunk,
  hasShownMarketingPopup,
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const isLoaded = !!advert && hasShownMarketingPopup;

  useEffect(() => {
    getMarketingPopupThunk();
  }, []);

  useEffect(() => {
    if (clickedNotification) {
      handleNotificationClick(clickedNotification);
    }
  }, [clickedNotification]);

  const handleBannerPress = item => {
    if (item.name == 'Mumayizat') {
      navigation.navigate('MumayzInfo', {
        params: { title: 'Mumayizat Oman' },
      });
    } else if (item.internal) {
      if (item.merchant_id) {
        if (CHARITY_MERCHANT_IDS.includes(+item.merchant_id)) {
          navigation.navigate('Charities', { merchantId: item.merchant_id });

          return
        }

        getMerchantDetails(item.merchant_id, navigation, t);
      }
    } else {
      onBannerPress(
        item.banner_url,
        getMerchantDetails,
        navigation,
        t,
        trackBanner,
        user,
        item.tracking_code,
      );
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsSplashScreenVisible(false);
    }, 1000);
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <ActivityIndicator
          size={'large'}
          color={isDark ? colors.mainDarkMode : colors.darkBlue}
        />
      </View>
    );
  }

  return (
    <>
      <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={t('TabBar.home')} btns={['notifications']} />
        }
        headerHeight={50}
        contentStyle={{ height: SCREEN_HEIGHT - 120, paddingHorizontal: 20 }}
      >
        <MerchantListHeader isHome={true} />

        {advert !== null && advert.ad_1 && advert.ad_1.length > 0 && (
          <AdwertSwiper
            data={advert.ad_1}
            onBannerPress={handleBannerPress}
            isDark={isDark}
            style={{ marginTop: 16, overflow: 'hidden', borderRadius: 16 }}
          />
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30, flexGrow: 1 }}
        >
          <Categories />

          <NotificationModal />
          <MarketingPopupModal />

          {/* <AdwertisementModal /> */}
        </ScrollView>
      </MainLayout>
    </>
  );
};

const mapStateToProps = state => ({
  user: state.authReducer.user,
  advert: state.merchantReducer.advert,
  clickedNotification: state.notificationsReducer.clickedNotification,
  hasShownMarketingPopup: state.globalReducer.hasShownMarketingPopup,
});

export default connect(mapStateToProps, {
  trackBanner,
  setIsSplashScreenVisible,
  getMerchantDetails,
  getMarketingPopupThunk,
})(MainScreen);
