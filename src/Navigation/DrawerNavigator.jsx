import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { View } from 'react-native';
import { MainStackScreen } from './MainStack';
import CustomDrawerContent from '../components/CustomDrawer/CustomDrawerContent';
import { SCREEN_WIDTH } from '../styles/mainStyles';
import { isRTL } from '../../utils';
import { colors } from '../components/colors';
import { useTheme } from '../components/ThemeProvider';

const { Navigator, Screen } = createDrawerNavigator();

/**
 * Authorized app shell.
 * Drawer → MainStack (no empty Tabs wrapper).
 */
export const DrawerNavigator = () => {
  const { isDark } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? colors.darkBlue : colors.white,
      }}
    >
      <Navigator
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: SCREEN_WIDTH,
            paddingHorizontal: 0,
          },
          drawerPosition: isRTL() ? 'right' : 'left',
        }}
        drawerContent={CustomDrawerContent}
      >
        <Screen name="Home" component={MainStackScreen} />
      </Navigator>
    </View>
  );
};
