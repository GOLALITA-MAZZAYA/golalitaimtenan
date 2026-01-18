import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AllOffers from "../AllOffers";
import OfferInfo from "../OfferInfo";
import Menu from "../../PremiumPartner/Menu";
import ApplyCodeConfirmation from "../ApplyCodeConfirmation";

const Stack = createStackNavigator();

const OffersNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTruncatedBackTitle: "back",
        headerShown: false,
      }}
    >
      <Stack.Screen name="AllOffers" component={AllOffers} />
      <Stack.Screen name="offer-info" component={OfferInfo} />
      <Stack.Screen name="offer-menu" component={Menu} />
      <Stack.Screen
        name="offer-apply-code-confirmation"
        component={ApplyCodeConfirmation}
      />
    </Stack.Navigator>
  );
};

export default OffersNavigator;
