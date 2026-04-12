import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NewMerchantsPage from "../NewMerchantsPage";
import MerchantsFilters from "../MerchantsFilters";
import PremiumMerchantsPage from "../PremiumMerchantsPage";
import AllMerchantsPage from "../AllMerchantsPage";

const Stack = createStackNavigator();

const MerchantsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTruncatedBackTitle: "back",
        headerShown: false,
      }}
    >
      <Stack.Screen name="merchants-list" component={AllMerchantsPage} />
      <Stack.Screen name="newMerchants-list" component={NewMerchantsPage} />
      <Stack.Screen
        name="premiumMerchants-list"
        component={PremiumMerchantsPage}
      />
      <Stack.Screen name="merchants-filters" component={MerchantsFilters} />
    </Stack.Navigator>
  );
};

export default MerchantsNavigator;
