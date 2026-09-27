import { StyleSheet, View } from 'react-native';
import DrawerItem from '../DrawerItem';
import { useTheme } from '../../../ThemeProvider';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { sized } from '../../../../Svg';
import FavoritesSvg from '../../../../assets/favorites.svg';
import SettingsSvg from '../../../../assets/settings.svg';
import FamilySvg from '../../../../assets/family.svg';
import ARSvg from '../../../../assets/aricon.svg';
import ContactUsSvg from '../../../../assets/contact_us.svg';
import ScanSvg from '../../../../assets/scan.svg';
import PlanetSvg from '../../../../assets/planet.svg';
import PremiumSvg from '../../../../assets/premium2.svg';
import Gopoint from '../../../../assets/goPoints.svg';
import MerchantsSvg from '../../../../assets/merchants.svg';
import GiftSvg from '../../../../assets/gift.svg';
import VouchersSvg from '../../../../assets/vouchers.svg';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import OffersSvg from '../../../../assets/offers.svg';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../../colors';
import {
  getGoPointMerchatnsCount,
  getPremiumMerchantsCount,
} from '../../../../api/merchants';
import { showMessage } from 'react-native-flash-message';
import useIsGuest from '../../../../hooks/useIsGuest';
import useDrawerMenuVisibility from '../../../../hooks/useDrawerMenuVisibility';
import { DRAWER_SCREEN_NAMES } from '../../drawerConfig';
import { openScreen } from '../../../../Navigation/RootNavigation';

const DrawerItemList = () => {
  const { isDark } = useTheme();
  const isMainUser = useSelector(state => state.authReducer.isMainUser);
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const isGuest = useIsGuest();
  const { isScreenVisible } = useDrawerMenuVisibility();

  const iconColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const FavoritesIcon = sized(FavoritesSvg, 20, 20, iconColor);
  const SettingsIcon = sized(SettingsSvg, 20, 20, iconColor);
  const ContactUsIcon = sized(ContactUsSvg, 20, 20, iconColor);
  const PlanetIcon = sized(PlanetSvg, 20, 20, iconColor);
  const FamilyIcon = sized(FamilySvg, 20, 20, iconColor);
  const OffersIcon = sized(OffersSvg, 20, 20, iconColor);
  const VouchersIcon = sized(VouchersSvg, 20, 20, iconColor);

  const [premiumMerchantsCount, setPremiumMerchantsCount] = useState(0);
  const [goPointsMerchantsCount, setGoPointsMerchantsCount] = useState(0);

  // openScreen pushes on MainStack and does not auto-close the drawer.
  const openFromDrawer = (name, params) => {
    navigation.dispatch(DrawerActions.closeDrawer());
    openScreen(name, params);
  };

  useEffect(() => {
    getPremiumMerchantsCount()
      .then(async i => {
        setPremiumMerchantsCount(i.total_premium_merchants);
      })
      .catch(error => {
        console.error('Error :', error);
      });

    getGoPointMerchatnsCount()
      .then(async i => {
        setGoPointsMerchantsCount(i.total_gpoint_merchants);
      })
      .catch(error => {
        console.error('Error :', error);
      });
  }, []);

  const drawerItems = [
    {
      screenName: DRAWER_SCREEN_NAMES.FAMILY_MEMBERS,
      icon: () => <FamilyIcon style={styles.iconWrapper} />,
      title: t('Drawer.familyMembers'),
      onPress: () => {
        if (isGuest) {
          showMessage({
            type: 'warning',
            message: t('Drawer.notForGuest'),
          });
          return;
        }
        openFromDrawer('Family');
      },
      hidden: !isMainUser || isGuest,
    },
    {
      screenName: DRAWER_SCREEN_NAMES.VOUCHERS,
      icon: () => <VouchersIcon style={styles.iconWrapper} />,
      title: t('Drawer.vouchersAndGiftCards'),
      onPress: () =>
        openFromDrawer('myVouchers', {
          screen: 'myVouchers-list',
        }),
    },
    {
      screenName: DRAWER_SCREEN_NAMES.ALL_OFFERS,
      icon: () => <OffersIcon style={styles.iconWrapper} />,
      title: t('Drawer.allOffers'),
      onPress: () => openFromDrawer('AllOffers'),
    },
    {
      screenName: DRAWER_SCREEN_NAMES.FAVORITES,
      icon: () => <FavoritesIcon style={styles.iconWrapper} />,
      title: t('Favorites.favorites'),
      onPress: () => openFromDrawer('favouriteMerchants'),
      hidden: isGuest,
    },
    {
      screenName: DRAWER_SCREEN_NAMES.SETTINGS,
      icon: () => <SettingsIcon style={styles.iconWrapper} />,
      title: t('Settings.settings'),
      onPress: () => openFromDrawer('Settings'),
    },
    {
      screenName: DRAWER_SCREEN_NAMES.LANGUAGE,
      icon: () => <PlanetIcon style={styles.iconWrapper} />,
      title: t('Drawer.language'),
      onPress: () => {
        const newLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18next.changeLanguage(newLang);
        AsyncStorage.setItem('lang', newLang);
      },
      isActive: false,
      languages: ['en', 'ar'],
    },
    {
      screenName: DRAWER_SCREEN_NAMES.CONTACT_US,
      icon: () => <ContactUsIcon style={styles.iconWrapper} />,
      title: t('ContactUs.contactUs'),
      onPress: () => openFromDrawer('ContactUs'),
    },
  ];

  const filteredDrawerItems = useMemo(() => {
    return drawerItems.filter(
      item =>
        !item.hidden &&
        (!item.screenName || isScreenVisible(item.screenName)),
    );
  }, [
    isMainUser,
    i18n.language,
    isDark,
    premiumMerchantsCount,
    goPointsMerchantsCount,
    isScreenVisible,
    isGuest,
  ]);

  return (
    <View style={styles.drawerItems}>
      {filteredDrawerItems.map((item, index) => (
        <DrawerItem
          isDark={isDark}
          key={index}
          icon={item.icon}
          title={item.title}
          onPress={item.onPress}
          languages={item.languages}
          counts={item.counts}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  drawerItems: {
    marginTop: 25,
  },
});

export default DrawerItemList;
