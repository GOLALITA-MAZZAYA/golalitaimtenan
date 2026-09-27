// src/Navigation/Root.jsx
import React from 'react';
import {
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { Authorization } from './Authorization';
import { DrawerNavigator } from './DrawerNavigator';
import { navigationRef } from './RootNavigation';
import { linking } from './config';
import { useTheme } from '../components/ThemeProvider';
import { colors } from '../components/colors';
import { useDeepLinking } from '../hooks/useDeepLinking';
import { useHardwareBackButton } from '../hooks/useHardwareBackButton';

export const Root = ({ isAuthorized }) => {
  const { isDark } = useTheme();

  useDeepLinking();
  useHardwareBackButton();

  const MyCustomTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: isDark ? colors.darkModeBackground : '#fff',
    },
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      theme={MyCustomTheme}
    >
      {isAuthorized ? <DrawerNavigator /> : <Authorization />}
    </NavigationContainer>
  );
};
