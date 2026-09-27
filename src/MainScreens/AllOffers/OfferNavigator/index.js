import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AllOffers from '../AllOffers';
import OfferInfo from '../OfferInfo';
import Menu from '../../PremiumPartner/Menu';
import ApplyCodeConfirmation from '../ApplyCodeConfirmation';
import MerchantCodeConfirmation from '../MerchantCodeConfirmation';

const Stack = createStackNavigator();

/**
 * Offers feature stack.
 * Nested list is `offers-list` (not `AllOffers`) so it does not collide with
 * the MainStack parent route name `AllOffers`.
 */
const OffersNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="offers-list"
      screenOptions={{
        headerTruncatedBackTitle: 'back',
        headerShown: false,
      }}
    >
      <Stack.Screen name="offers-list" component={AllOffers} />
      <Stack.Screen name="offer-info" component={OfferInfo} />
      <Stack.Screen name="offer-menu" component={Menu} />
      <Stack.Screen
        name="offer-apply-code-confirmation"
        component={ApplyCodeConfirmation}
      />
      <Stack.Screen
        name="merchant-code-confirmation"
        component={MerchantCodeConfirmation}
      />
    </Stack.Navigator>
  );
};

export default OffersNavigator;
