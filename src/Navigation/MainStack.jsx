import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { MainScreen } from '../MainScreens';
import Notifications from '../MainScreens/Notifications/Notifications';
import ChangePassword from '../MainScreens/Profile/ChangePassword';
import Family from '../MainScreens/Family/Family';
import ContactUs from '../MainScreens/ContactUs/ContactUs';
import MerchantsNavigator from '../MainScreens/MerchantsPage/MerchantsNavigator/index';
import AddFamilyMember from '../MainScreens/Family/AddFamilyMember/AddFamilyMember';
import FamilyEmailVerification from '../MainScreens/Family/FamilyEmailVerification';
import Promocode from '../MainScreens/Promocode/Promocode';
import OnlineStores from '../MainScreens/OnlineStores/OnlineStores';
import Settings from '../MainScreens/Settings/Settings';
import MapPage from '../MainScreens/MapPage/MapPage';
import PrivacyPolicy from '../MainScreens/PrivacyPolicy';
import Website from '../MainScreens/Website';
import FavouriteMerchants from '../MainScreens/FavouriteMerchants';
import Profile from '../MainScreens/Profile/Profile';
import CategoriesNavigator from '../MainScreens/Categories';
import BillScanner from '../MainScreens/BillScanner';
import OffersNavigator from '../MainScreens/AllOffers/OfferNavigator';
import CodeConfirmation from '../AuthScreens/Register/CodeConfirmation';
import ProfileEmailVerification from '../MainScreens/Profile/ProfileEmailVerification';
import MumayzInfo from '../MainScreens/MumayzInfo';
import GlobalTix from '../MainScreens/GlobalTix';
import ProductDetails from '../MainScreens/GlobalTix/ProductDetails';
import CardPage from '../MainScreens/CardPage';
import GlobalTixCartScreen from '../MainScreens/GlobalTix/GlobalTixCartScreen';
import GlobalTixMyBookings from '../MainScreens/GlobalTix/GlobalTixMyBookings';
import ARMapNavigator from '../MainScreens/ARMap';
import LoyaltyPointsNavigator from '../MainScreens/LoyaltyPoints';
import BillScannerHowToUse from '../MainScreens/BillScannerHoToUse';
import MerchantNavigator from '../MainScreens/PremiumPartner';
import Charities from '../MainScreens/Charities';
import MyBookingsNavigator from '../MainScreens/MyBookings/navigator';
import ESimNavigator from '../MainScreens/ESim';
import AiChat from '../MainScreens/AiChat/AiChat';
import {
  DiscountCardsListScreen,
  DiscountCardDetailScreen,
} from '../MainScreens/DiscountCards';
import { StampCardsScreen } from '../MainScreens/StampCards';

const MainStack = createStackNavigator();

// Screens that should hide ButtonTabBar. Read directly by ButtonTabBar from
// the focused route name on every render — setting this via
// navigation.setOptions() from a useLayoutEffect here was tried first, but
// the effect only fires once on initial mount and never again on subsequent
// navigation within MainStack (confirmed via devtools logging), so
// tabBarVisible never actually updated after the first screen.
export const NO_TAB_BAR_ROUTES = ['ProductItemPage', 'Cart', 'OrderConfirmation', 'AiChat'];

export const MainStackScreen = () => {
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
      <MainStack.Screen name={'card'} component={CardPage} />
      <MainStack.Screen name={'MapPage'} component={MapPage} />
      <MainStack.Screen name={'Notifications'} component={Notifications} />
      <MainStack.Screen name={'Profile'} component={Profile} />
      <MainStack.Screen name={'ChangePassword'} component={ChangePassword} />
      <MainStack.Screen name={'Family'} component={Family} />
      <MainStack.Screen name={'Settings'} component={Settings} />
      <MainStack.Screen name={'ContactUs'} component={ContactUs} />
      <MainStack.Screen name={'merchants'} component={MerchantsNavigator} />
      <MainStack.Screen name={'loyaltyPoints'} component={LoyaltyPointsNavigator} />
      <MainStack.Screen
        name={'favouriteMerchants'}
        component={FavouriteMerchants}
      />

      <MainStack.Screen name={'AddFamilyMember'} component={AddFamilyMember} />
      <MainStack.Screen
        name={'FamilyEmailVerification'}
        component={FamilyEmailVerification}
      />
      <MainStack.Screen name={'Promocode'} component={Promocode} />
      <MainStack.Screen name={'OnlineStores'} component={OnlineStores} />
      <MainStack.Screen name={'GlobalTix'} component={GlobalTix} />
      <MainStack.Screen name={'ProductDetails'} component={ProductDetails} />
      <MainStack.Screen
        name={'GlobalTixCartScreen'}
        component={GlobalTixCartScreen}
      />
      <MainStack.Screen name={'GlobalTixMyBookings'} component={GlobalTixMyBookings} />
      <MainStack.Screen name={'PrivacyPolicy'} component={PrivacyPolicy} />
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
        name="Charities"
        component={Charities}
      />
    
      <MainStack.Screen name="myBookings" component={MyBookingsNavigator} />
      <MainStack.Screen name="ESim" component={ESimNavigator} />
      <MainStack.Screen name={'AiChat'} component={AiChat} />
      <MainStack.Screen
        name={'DiscountCardsList'}
        component={DiscountCardsListScreen}
      />
      <MainStack.Screen
        name={'DiscountCardDetail'}
        component={DiscountCardDetailScreen}
      />
      <MainStack.Screen
        name={'StampCards'}
        component={StampCardsScreen}
      />

    </MainStack.Navigator>
  );
};
