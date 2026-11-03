// src/Navigation/Root.jsx
import React from 'react';
import {
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { useAuthOnboarding } from './Authorization';
import { DrawerNavigator } from './DrawerNavigator';
import { navigationRef, flushPendingActions } from './RootNavigation';
import { linking } from './config';
import { useTheme } from '../components/ThemeProvider';
import { colors } from '../components/colors';
import {useDeepLinking} from '../hooks/useDeepLinking';
import usePushNotifications from '../pushNotifications/usePushNotifications';
import Login from '../AuthScreens/Login';
import ForgotPassword from '../AuthScreens/ForgotPassword';
import Register from '../AuthScreens/Register/Register';
import CreatePassword from '../AuthScreens/CreatePassword/CreatePassword';
import Verification from '../AuthScreens/Verification/Verification';
import OnBoarding from '../AuthScreens/OnBoarding/OnBoarding';
import RegCodeVerification from '../AuthScreens/Register/RegCodeVerification';
import PrivacyPolicy from '../MainScreens/PrivacyPolicy';
import CodeConfirmation from '../AuthScreens/Register/CodeConfirmation';

// Created once at module scope: this Navigator must stay mounted across the
// isAuthorized flip (see Authorization.jsx for why) — only its Screen
// children should change, never the Navigator instance itself.
const RootStack = createStackNavigator();

const BootScreen = () => null;

export const Root = ({ isAuthorized }) => {
  const { isDark } = useTheme();
  const { isOnBoarding } = useAuthOnboarding();

  const MyCustomTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: isDark ? colors.darkModeBackground : '#fff',
    },
  };

  useDeepLinking();
  // Must live here, not in Login: Login unmounts the instant isAuthorized
  // flips true (see RootStack.Navigator below), which would tear down every
  // push-notification listener for the rest of the authenticated session.
  usePushNotifications();

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      theme={MyCustomTheme}
      onReady={flushPendingActions} 
    >
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        {isAuthorized ? (
          <RootStack.Screen name="Main" component={DrawerNavigator} />
        ) : isOnBoarding === null ? (
          <RootStack.Screen name="Boot" component={BootScreen} />
        ) : isOnBoarding ? (
          <>
            <RootStack.Screen name="OnBoarding" component={OnBoarding} />
            <RootStack.Screen name="Login" component={Login} />
            <RootStack.Screen name="ForgotPassword" component={ForgotPassword} />
            <RootStack.Screen name="Register" component={Register} />
            <RootStack.Screen name="RegCodeVerification" component={RegCodeVerification} />
            <RootStack.Screen name="CodeConfirmation" component={CodeConfirmation} />
            <RootStack.Screen name="CreatePassword" component={CreatePassword} />
            <RootStack.Screen name="Verification" component={Verification} />
            <RootStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          </>
        ) : (
          <>
            <RootStack.Screen name="Login" component={Login} />
            <RootStack.Screen name="OnBoarding" component={OnBoarding} />
            <RootStack.Screen name="ForgotPassword" component={ForgotPassword} />
            <RootStack.Screen name="Register" component={Register} />
            <RootStack.Screen name="RegCodeVerification" component={RegCodeVerification} />
            <RootStack.Screen name="CodeConfirmation" component={CodeConfirmation} />
            <RootStack.Screen name="CreatePassword" component={CreatePassword} />
            <RootStack.Screen name="Verification" component={Verification} />
            <RootStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
