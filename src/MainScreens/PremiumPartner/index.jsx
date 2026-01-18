import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Menu from "./Menu";
import MerchantInfo from "./MerchantInfo";

const Stack = createStackNavigator();

const MerchantNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTruncatedBackTitle: "back",
        headerShown: false,
      }}
    >
      <Stack.Screen name="merchant-info" component={MerchantInfo} />

      <Stack.Screen name="merchant-menu" component={Menu} />
    </Stack.Navigator>
  );
};

export default MerchantNavigator;
