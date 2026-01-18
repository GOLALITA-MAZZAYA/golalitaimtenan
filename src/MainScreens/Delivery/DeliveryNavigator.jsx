import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RestaurantList from "./screens/RestaurantList";
import RestaurantView from "./screens/RestaurantView";
import CartSummary from "./screens/CartSummary";
import Checkout from "./screens/Checkout";
import LocationsNavigator from "../Locations";
import OrderHistoryList from "./screens/OrderHistoryList";
import OrderHistoryView from "./screens/OrderHistoryView";

const Stack = createNativeStackNavigator();

const DeliveryNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="restaurantList"
        component={RestaurantList}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="restaurantView"
        component={RestaurantView}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="cartSummary"
        component={CartSummary}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Checkout"
        component={Checkout}
      />

      <Stack.Screen
        name="locations"
        options={{ headerShown: false }}
        component={LocationsNavigator}
      />

      <Stack.Screen
        name="orderHistoryList"
        options={{ headerShown: false }}
        component={OrderHistoryList}
      />

      <Stack.Screen
        name="orderHistoryView"
        options={{ headerShown: false }}
        component={OrderHistoryView}
      />
    </Stack.Navigator>
  );
};

export default DeliveryNavigator;
