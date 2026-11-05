import { StyleSheet, View } from 'react-native';
import DrawerItem from '../DrawerItem';
import { useTheme } from '../../../ThemeProvider';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { sized } from '../../../../Svg';
import FavoritesSvg from '../../../../assets/favorites.svg';
import HeartSvg from '../../../../assets/heart.svg';
import DiscountSvg from '../../../../assets/discountLabel.svg';
import BookingsSvg from '../../../../assets/menu-book.svg';
import SettingsSvg from '../../../../assets/settings.svg';
import FamilySvg from '../../../../assets/family.svg';
import ARSvg from '../../../../assets/aricon.svg';
import ContactUsSvg from '../../../../assets/contact_us.svg';
import ScanSvg from '../../../../assets/scan.svg';
import PremiumSvg from '../../../../assets/premium2.svg';
import Gopoint from '../../../../assets/goPoints.svg';
import MerchantsSvg from '../../../../assets/merchants.svg';
import AiChatSvg from '../../../../assets/ai_chat.svg';
import CardSvg from '../../../../assets/card.svg';
import { navigate } from '../../../../Navigation/RootNavigation';

import VouchersSvg from '../../../../assets/vouchers.svg';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../colors';
import {
  getPremiumMerchantsCount,
} from '../../../../api/merchants';
import useDrawerMenuVisibility from '../../../../hooks/useDrawerMenuVisibility';
import { DRAWER_SCREEN_NAMES } from '../../drawerConfig';

// Every drawer item routes through RootNavigation's global navigate() — the
// same function every other screen/thunk/deep-link in the app uses to reach
// a MainStack screen (Main > Home > TabsBar > screenName). It also closes
// the Drawer itself, so items here don't need their own navigation prop or
// closeDrawer() call.
const DrawerItemList = ({ routeName }) => {
  const { isDark } = useTheme();
  const isMainUser = useSelector(state => state.authReducer.isMainUser);
  const { t, i18n } = useTranslation();
  const { loading: menuLoading, isScreenVisible } = useDrawerMenuVisibility();

  const iconColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const FavoritesIcon = sized(HeartSvg, 20, 20, iconColor);
  const OffersIcon = sized(DiscountSvg, 20, 20, iconColor);
  const BookingsIcon = sized(BookingsSvg, 20, 20, iconColor);
  const SettingsIcon = sized(SettingsSvg, 20, 20, iconColor);
  const ContactUsIcon = sized(ContactUsSvg, 20, 20, iconColor);
  const GopointIcon = sized(Gopoint, 20, 20, iconColor);
  const PremiumIcon = sized(PremiumSvg, 20, 20, iconColor);
  const FamilyIcon = sized(FamilySvg, 20, 20, iconColor);
  const AiChatIcon = sized(AiChatSvg, 20, 20, iconColor);
  const DiscountCardsIcon = sized(CardSvg, 20, 20, iconColor);
  const StampCardsIcon = sized(DiscountSvg, 20, 20, iconColor);
  const VouchersIcon = sized(VouchersSvg, 20, 20, iconColor);
  const [premiumMerchantsCount, setPremiumMerchantsCount] = useState(0);
  const isPremiumMerchantsVisible =
    !menuLoading && isScreenVisible(DRAWER_SCREEN_NAMES.PREMIUM_MERCHANTS);

  useEffect(() => {
    if (!isPremiumMerchantsVisible) {
      return;
    }

    getPremiumMerchantsCount()
      .then(i => {
        setPremiumMerchantsCount(i.total_premium_merchants);
      })
      .catch(error => {
        console.error('Error :', error);
      });
  }, [isPremiumMerchantsVisible]);

  const drawerItems = [
    {
      screenName: DRAWER_SCREEN_NAMES.FAMILY_MEMBERS,
      route: 'Family',
      icon: () => <FamilyIcon style={styles.iconWrapper} />,
      title: t('Drawer.familyMembers'),
      onPress: () => navigate('Family'),
      hidden: !isMainUser,
    },
    {
      screenName: DRAWER_SCREEN_NAMES.GIFT_CARDS,
      icon: () => <VouchersIcon style={styles.iconWrapper} />,
      title: t('Drawer.vouchersAndGiftCards'),
      onPress: () =>
        navigate('loyaltyPoints', {
          screen: 'loyaltyPoints-giftCards-list',
        }),
    },
    {
      screenName: DRAWER_SCREEN_NAMES.ALL_OFFERS,
      route: 'AllOffers',
      icon: () => <OffersIcon style={styles.iconWrapper} />,
      title: t('Drawer.allOffers'),
      onPress: () => navigate('AllOffers'),
    },
    {
      screenName: DRAWER_SCREEN_NAMES.PREMIUM_MERCHANTS,
      route: 'merchants',
      icon: () => <PremiumIcon style={styles.iconWrapper} />,
      title: t('Drawer.premiumMerchants'),
      onPress: () =>
        navigate('merchants', {
          screen: 'premiumMerchants-list',
          params: { selectedCategory: null },
        }),
      counts: premiumMerchantsCount,
      hidden: premiumMerchantsCount == 0,
    },
    {
      screenName: DRAWER_SCREEN_NAMES.AI_CHAT,
      route: 'AiChat',
      icon: () => <AiChatIcon style={styles.iconWrapper} />,
      title: t('Drawer.aiChat'),
      onPress: () => navigate('AiChat'),
    },
    {
      screenName: DRAWER_SCREEN_NAMES.LOYALTY_POINTS,
      route: 'loyaltyPoints',
      icon: () => <GopointIcon style={styles.iconWrapper} />,
      title: t('Drawer.loyaltyPoints'),
      onPress: () =>
        navigate('loyaltyPoints', {
          screen: 'loyaltyPoints-main',
        }),
    },
    {
      screenName: DRAWER_SCREEN_NAMES.DISCOUNT_CARDS,
      route: 'DiscountCardsList',
      icon: () => <DiscountCardsIcon style={styles.iconWrapper} />,
      title: t('Drawer.discountCards', 'Complimentary Coupons'),
      onPress: () => navigate('DiscountCardsList'),
    },
    {
      screenName: DRAWER_SCREEN_NAMES.STAMP_CARDS,
      route: 'StampCards',
      icon: () => <StampCardsIcon style={styles.iconWrapper} />,
      title: t('Drawer.stampCards', 'Loyalty Stamps'),
      onPress: () => navigate('StampCards'),
    },
    {
      screenName: DRAWER_SCREEN_NAMES.FAVORITES,
      route: 'favouriteMerchants',
      icon: () => <FavoritesIcon style={styles.iconWrapper} />,
      title: t('Favorites.favorites'),
      onPress: () => navigate('favouriteMerchants'),
    },
    {
      screenName: DRAWER_SCREEN_NAMES.MY_BOOKINGS,
      route: 'myBookings',
      icon: () => <BookingsIcon style={styles.iconWrapper} />,
      title: t('Drawer.myBookings'),
      onPress: () => navigate('myBookings'),
    },
    {
      screenName: DRAWER_SCREEN_NAMES.SETTINGS,
      route: 'Settings',
      icon: () => <SettingsIcon style={styles.iconWrapper} />,
      title: t('Settings.settings'),
      onPress: () => navigate('Settings'),
    },
    {
      screenName: DRAWER_SCREEN_NAMES.CONTACT_US,
      route: 'ContactUs',
      icon: () => <ContactUsIcon style={styles.iconWrapper} />,
      title: t('ContactUs.contactUs'),
      onPress: () => navigate('ContactUs'),
    },
    // {
    //   icon: () => <ScanIcon style={styles.iconWrapper} />,
    //   title: t('Drawer.scanBill'),
    //   onPress: () =>
    //     navigation.navigate('BillScannerHoToUse', {
    //       title: t('Drawer.scanBill'),
    //     }),
    // },
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
    isScreenVisible,
    premiumMerchantsCount,
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
          focused={!!item.route && item.route === routeName}
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
