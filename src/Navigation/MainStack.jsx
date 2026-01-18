import React, { useLayoutEffect } from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { MainScreen } from '../MainScreens';
import Notifications from '../MainScreens/Notifications/Notifications';
import ChangePassword from '../MainScreens/Profile/ChangePassword';
import Family from '../MainScreens/Family/Family';
import Transactions from '../MainScreens/Transactions';
import Favorites from '../MainScreens/Favorites/Favorites';
import NotificationSettings from '../MainScreens/Notifications/NotificationSettings/NotificationSettings';
import ContactUs from '../MainScreens/ContactUs/ContactUs';
import Dashboard from '../MainScreens/Dashboard/Dashboard';
import MerchantsNavigator from '../MainScreens/MerchantsPage/MerchantsNavigator/index';
import AddFamilyMember from '../MainScreens/Family/AddFamilyMember/AddFamilyMember';
import BookHotel from '../MainScreens/BookHotel/BookHotel';
import SocialMedia from '../MainScreens/SocialMedia/SocialMedia';
import Promocode from '../MainScreens/Promocode/Promocode';
import Voucher from '../MainScreens/Promocode/Voucher';
import OnlineStores from '../MainScreens/OnlineStores/OnlineStores';
import Settings from '../MainScreens/Settings/Settings';
import ProductPage from '../MainScreens/ProductPage/ProductPage';
import MapPage from '../MainScreens/MapPage/MapPage';
import PrivacyPolicy from '../MainScreens/PrivacyPolicy';
import DeliveryNavigator from '../MainScreens/Delivery/DeliveryNavigator';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Website from '../MainScreens/Website';
import FavouriteMerchants from '../MainScreens/FavouriteMerchants';
import Profile from '../MainScreens/Profile/Profile';
import CategoriesNavigator from '../MainScreens/Categories';
import ChildCategories from '../MainScreens/Categories/ChildCategories';
import BillScanner from '../MainScreens/BillScanner';
import OffersNavigator from '../MainScreens/AllOffers/OfferNavigator';
import B1G1 from '../MainScreens/B1G1';
import CodeConfirmation from '../AuthScreens/Register/CodeConfirmation';
import ProfileEmailVerification from '../MainScreens/Profile/ProfileEmailVerification';
import MumayzInfo from '../MainScreens/MumayzInfo';
import GlobalTix from '../MainScreens/GlobalTix';
import ProductDetails from '../MainScreens/GlobalTix/ProductDetails';
import CardPage from '../MainScreens/CardPage';
import GlobalTixCartScreen from '../MainScreens/GlobalTix/GlobalTixCartScreen';
import ARMapNavigator from '../MainScreens/ARMap';
import LoyaltyPointsNavigator from '../MainScreens/LoyaltyPoints';
import BillScannerHowToUse from '../MainScreens/BillScannerHoToUse';
import MerchantNavigator from '../MainScreens/PremiumPartner';

const MainStack = createStackNavigator();

export const MainStackScreen = ({ navigation, route }) => {
  useLayoutEffect(() => {
    let routes = ['ProductItemPage', 'Cart', 'OrderConfirmation']; // routes without tabbar
    const routeName = getFocusedRouteNameFromRoute(route);
    navigation.setOptions({ currentRoute: routeName });
    if (routes.indexOf(routeName) !== -1 && routeName !== undefined) {
      navigation.setOptions({ tabBarVisible: false });
    } else {
      navigation.setOptions({ tabBarVisible: true });
    }
  }, [navigation, route]);
  return (
    <MainStack.Navigator
      initialRouteName={'Main'}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <MainStack.Screen name={'Main'} component={MainScreen} />
      <MainStack.Screen
        name={'merchant'}
        component={MerchantNavigator}
      />

      <MainStack.Screen name="ARMap" component={ARMapNavigator} />

      <MainStack.Screen name={'AllOffers'} component={OffersNavigator} />
      <MainStack.Screen name={'B1G1'} component={B1G1} />
      <MainStack.Screen name={'ProductPage'} component={ProductPage} />
      <MainStack.Screen name={'card'} component={CardPage} />
      <MainStack.Screen name={'MapPage'} component={MapPage} />
      <MainStack.Screen name={'Notifications'} component={Notifications} />
      <MainStack.Screen name={'Profile'} component={Profile} />
      <MainStack.Screen name={'ChangePassword'} component={ChangePassword} />
      <MainStack.Screen name={'Family'} component={Family} />
      <MainStack.Screen name={'Favorites'} component={Favorites} />
      <MainStack.Screen name={'Transactions'} component={Transactions} />
      <MainStack.Screen name={'Settings'} component={Settings} />
      <MainStack.Screen
        name={'NotificationSettings'}
        component={NotificationSettings}
      />
      <MainStack.Screen name={'ContactUs'} component={ContactUs} />
      <MainStack.Screen name={'Dashboard'} component={Dashboard} />
      <MainStack.Screen name={'merchants'} component={MerchantsNavigator} />
      <MainStack.Screen name={'loyaltyPoints'} component={LoyaltyPointsNavigator} />
      <MainStack.Screen
        name={'favouriteMerchants'}
        component={FavouriteMerchants}
      />

      <MainStack.Screen name={'AddFamilyMember'} component={AddFamilyMember} />
      <MainStack.Screen name={'BookHotel'} component={BookHotel} />
      <MainStack.Screen name={'SocialMedia'} component={SocialMedia} />
      <MainStack.Screen name={'Promocode'} component={Promocode} />
      <MainStack.Screen name={'Voucher'} component={Voucher} />
      <MainStack.Screen name={'OnlineStores'} component={OnlineStores} />
      {/* <MainStack.Screen name={"B1G1"} component={OnlineStores} /> */}
      <MainStack.Screen name={'GlobalTix'} component={GlobalTix} />
      <MainStack.Screen name={'ProductDetails'} component={ProductDetails} />
      <MainStack.Screen
        name={'GlobalTixCartScreen'}
        component={GlobalTixCartScreen}
      />
      <MainStack.Screen name={'PrivacyPolicy'} component={PrivacyPolicy} />
      <MainStack.Screen name={'delivery'} component={DeliveryNavigator} />
      <MainStack.Screen name={'Website'} component={Website} />

      <MainStack.Screen name={'BillScanner'} component={BillScanner} />
      <MainStack.Screen name={'BillScannerHoToUse'} component={BillScannerHowToUse} />
      <MainStack.Screen name={'categories'} component={CategoriesNavigator} />
      <MainStack.Screen name={'MumayzInfo'} component={MumayzInfo} />
      <MainStack.Screen
        name={'ProfileEmailVerification'}
        component={ProfileEmailVerification}
      />
      <MainStack.Screen
        name={'CodeConfirmation'}
        component={CodeConfirmation}
      />
      <MainStack.Screen
        name="categories-child-mainstack"
        component={ChildCategories}
      />
    </MainStack.Navigator>
  );
};
