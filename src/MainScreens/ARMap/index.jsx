import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ARMerchants from './ARMerchants';
import ARCategories from './ARCategories';
import ARHowToUse from './ARHowToUse';

const Stack = createStackNavigator();

const ARMapNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTruncatedBackTitle: 'back',
        headerShown: false,
      }}
    >
      <Stack.Screen name="ARMerchants" component={ARMerchants} />
      <Stack.Screen name="ARHowToUse" component={ARHowToUse} />
      <Stack.Screen name="ARCategories" component={ARCategories} />
    </Stack.Navigator>
  );
};

export default ARMapNavigator;
