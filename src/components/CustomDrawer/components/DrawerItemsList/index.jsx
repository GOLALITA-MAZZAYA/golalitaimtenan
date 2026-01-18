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
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../../colors';
import {
  getGoPointMerchatnsCount,
  getPremiumMerchantsCount,
} from '../../../../api/merchants';

const DrawerItemList = () => {
  const { isDark } = useTheme();
  const isMainUser = useSelector(state => state.authReducer.isMainUser);
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  const iconColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const FavoritesIcon = sized(FavoritesSvg, 20, 20, iconColor);
  const SettingsIcon = sized(SettingsSvg, 20, 20, iconColor);
  const ContactUsIcon = sized(ContactUsSvg, 20, 20, iconColor);
  const GopointIcon = sized(Gopoint, 20, 20, iconColor);
  const PremiumIcon = sized(PremiumSvg, 20, 20, iconColor);
  const ScanIcon = sized(ScanSvg, 20, 20, iconColor);
  const PlanetIcon = sized(PlanetSvg, 20, 20, iconColor);
  const MerchantsIcon = sized(MerchantsSvg, 20, 20, iconColor);
  const FamilyIcon = sized(FamilySvg, 20, 20, iconColor);
  const ARIcon = sized(ARSvg, 20, 20, iconColor);

  const [premiumMerchantsCount, setPremiumMerchantsCount] = useState(0);
  const [goPointsMerchantsCount, setGoPointsMerchantsCount] = useState(0);

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
    // {
    //   icon: () => <VouchersIcon style={styles.iconWrapper} />, //routeName === 'Cart' ? <BagActiveIcon /> : <BagIcon />,
    //   title: "GlobalTix",
    //   onPress: () => navigation.navigate("GlobalTix"),
    // },
    {
      icon: () => <ARIcon style={styles.iconWrapper} />, //routeName === 'Cart' ? <BagActiveIcon /> : <BagIcon />,
      title: t('Drawer.offersAroundYou'),
      onPress: () => navigation.navigate('ARMap',{
        screen: 'ARHowToUse'
      }),
      hidden: !isMainUser,
    },
    {
      icon: () => <FamilyIcon style={styles.iconWrapper} />, //routeName === 'Cart' ? <BagActiveIcon /> : <BagIcon />,
      title: t('Drawer.familyMembers'),
      onPress: () => navigation.navigate('Family'),
      hidden: !isMainUser,
    },
    {
      icon: () => <PremiumIcon style={styles.iconWrapper} />, //routeName === 'Discount' ? <DiscountsActiveIcon /> : <DiscountsIcon />,
      title: t('Drawer.premiumMerchants'),
      onPress: () =>
        navigation.navigate('merchants', {
          screen: 'premiumMerchants-list',
          params: { selectedCategory: null },
        }),
      counts: premiumMerchantsCount,
      hidden: premiumMerchantsCount == 0,
    },
    {
      icon: () => <GopointIcon style={styles.iconWrapper} />, //routeName === 'Discount' ? <DiscountsActiveIcon /> : <DiscountsIcon />,
      title: t('Drawer.goPoints'),
      onPress: () =>
        navigation.navigate('merchants', {
          screen: 'GoPointsMerchants-list',
          params: { selectedCategory: null },
        }),
      counts: goPointsMerchantsCount,
      hidden: goPointsMerchantsCount == 0,
    },
    {
      icon: () => <MerchantsIcon style={styles.iconWrapper} />, //routeName === 'Discount' ? <DiscountsActiveIcon /> : <DiscountsIcon />,
      title: t('Drawer.newMerchants'),
      onPress: () =>
        navigation.navigate('merchants', {
          screen: 'newMerchants-list',
          params: { selectedCategory: null },
        }),
    },
    {
      icon: () => <GopointIcon style={styles.iconWrapper} />, //routeName === 'Discount' ? <DiscountsActiveIcon /> : <DiscountsIcon />,
      title: t('Drawer.loyaltyPoints'),
      onPress: () =>
        navigation.navigate('loyaltyPoints', {
          screen: 'loyaltyPoints-main',
        }),
    },
    {
      icon: () => <FavoritesIcon style={styles.iconWrapper} />, //routeName === 'Discount' ? <DiscountsActiveIcon /> : <DiscountsIcon />,
      title: t('Drawer.allOffers'),
      onPress: () => navigation.navigate('AllOffers'),
    },
    {
      icon: () => <FavoritesIcon style={styles.iconWrapper} />, //routeName === 'Discount' ? <DiscountsActiveIcon /> : <DiscountsIcon />,
      title: t('Drawer.b1g1'),
      onPress: () => navigation.navigate('B1G1'),
    },
    {
      icon: () => <FavoritesIcon style={styles.iconWrapper} />, //routeName === 'Discount' ? <DiscountsActiveIcon /> : <DiscountsIcon />,
      title: t('Favorites.favorites'),
      onPress: () => navigation.navigate('favouriteMerchants'),
    },
    {
      icon: () => <SettingsIcon style={styles.iconWrapper} />, //routeName === 'ToUser' ? <InfoActiveIcon /> : <InfoIcon />,
      title: t('Settings.settings'),
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: () => <PlanetIcon style={styles.iconWrapper} />, //routeName === 'ToUser' ? <InfoActiveIcon /> : <InfoIcon />,
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
      icon: () => <ContactUsIcon style={styles.iconWrapper} />,
      title: t('ContactUs.contactUs'),
      onPress: () => navigation.navigate('ContactUs'),
    },
    {
      icon: () => <ScanIcon style={styles.iconWrapper} />,
      title: t('Drawer.scanBill'),
      onPress: () =>
        navigation.navigate('BillScannerHoToUse', {
          title: t('Drawer.scanBill'),
        }),
    },
  ];

  const filteredDrawerItems = useMemo(() => {
    return drawerItems.filter(item => !item.hidden);
  }, [
    isMainUser,
    i18n.language,
    isDark,
    premiumMerchantsCount,
    goPointsMerchantsCount,
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
