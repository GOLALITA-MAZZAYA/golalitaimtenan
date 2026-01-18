// src/Navigation/Root.jsx
import React from 'react';
import {
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { Authorization } from './Authorization';
import { DrawerNavigator } from './DrawerNavigator';
import { navigationRef, flushPendingActions } from './RootNavigation';
import { linking } from './config';
import { useTheme } from '../components/ThemeProvider';
import { colors } from '../components/colors';

export const Root = ({ isAuthorized }) => {
  const { isDark } = useTheme();

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
      onReady={flushPendingActions} // 👈 вот эта строка
    >
      {isAuthorized ? <DrawerNavigator /> : <Authorization />}
    </NavigationContainer>
  );
};
