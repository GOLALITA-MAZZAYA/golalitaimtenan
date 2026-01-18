import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LocationsMap from "./LocationsMap";
import LocationsForm from "./LocationsForm";

const Stack = createStackNavigator();

const LocationsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTruncatedBackTitle: "back",
        headerShown: false,
      }}
    >
      <Stack.Screen name="locations-map" component={LocationsMap} />

      <Stack.Screen name="locations-form" component={LocationsForm} />
    </Stack.Navigator>
  );
};

export default LocationsNavigator;
