import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Platform, Linking } from 'react-native';
import MainLayout from '../../components/MainLayout';
import { colors } from '../../components/colors';
import { useTheme } from '../../components/ThemeProvider';
import { connect } from 'react-redux';
import useBannerPress from '../../hooks/useBannerPress';
import { handleNotificationClick } from '../../pushNotifications/notificationClickHandler';
import AdwertSwiper from '../../components/AdwertSwiper/AdwertSwiper';
import { setIsSplashScreenVisible } from '../../redux/auth/auth-actions';
import Categories from './components/Categories';
import NotificationModal from '../../components/NotificationModal/NotificationModal';
import MarketingPopupModal from '../../components/MarketingPopupModal/MarketingPopupModal';
import { getMarketingPopupThunk } from '../../redux/global/global-thunks';
import MerchantListHeader from '../MerchantsPage/components/MerchantsHeader';
import NotificationsBtn from '../../components/Header/components/NotificationsBtn';
import FloatingAiChatButton from '../../components/FloatingAiChatButton';
import { isRTL } from '../../../utils';

const MainScreen = ({
  advert,
  clickedNotification,
  setIsSplashScreenVisible,
  getMarketingPopupThunk,
  hasShownMarketingPopup
}) => {
  const { isDark } = useTheme();
  const isLoaded = !!advert && hasShownMarketingPopup;

  useEffect(() => {
    if (clickedNotification) {
      handleNotificationClick(clickedNotification);
    }
  }, [clickedNotification]);

  useEffect(() => {
    getMarketingPopupThunk();
  }, []);

  const handleBannerPress = useBannerPress({ pageName: 'home' });

  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      console.log('DEEP LINK RECEIVED:', url);
    });

    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setIsSplashScreenVisible(false);
    }
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
    <View style={{ flex: 1 }}>
      <MainLayout
        outsideScroll={true}
        headerChildren={
          <View
            style={{
              flexDirection: isRTL() ? 'row-reverse' : 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 8,
              justifyContent: 'space-between',
            }}
          >
            <MerchantListHeader isHome={true} style={{ flex: 1 }} />
            <View
              style={{
                marginLeft: isRTL() ? 0 : 12,
                marginRight: isRTL() ? 12 : 0,
              }}
            >
              <NotificationsBtn />
            </View>
          </View>
        }
        headerHeight={64}
        contentStyle={{ flex: 1, paddingHorizontal: 20 }}
      >
        {advert !== null && advert.ad_1 && advert.ad_1.length > 0 && (
          <AdwertSwiper
            data={advert.ad_1}
            onBannerPress={handleBannerPress}
            isDark={isDark}
            style={{
              marginTop: 8,
              overflow: 'hidden',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
            }}
          />
        )}

        <Categories />

        <NotificationModal />
        <MarketingPopupModal />
      </MainLayout>

      <FloatingAiChatButton />
    </View>
  );
};

const mapStateToProps = state => ({
  advert: state.merchantReducer.advert,
  clickedNotification: state.notificationsReducer.clickedNotification,
  hasShownMarketingPopup: state.globalReducer.hasShownMarketingPopup
});

export default connect(mapStateToProps, {
  setIsSplashScreenVisible,
  getMarketingPopupThunk,
})(MainScreen);
