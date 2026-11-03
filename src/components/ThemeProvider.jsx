import * as React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { charitiesDarkColors, charitiesLightColors, colors, loyaltyDarkColors, loyaltyLightColors, mainDarkColors, mainLightColors } from './colors';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { org } from '../org/config';

const darkColors = {
  mainBg: '#2F1539',
};

const lightColors = {
  mainBg: '#FFFFFF',
  secondaryBg: '#F4F3F5',
};

export const ThemeContext = React.createContext({
  isDark: true,
  colors: darkColors,
  setScheme: () => {},
});

export const ThemeProvider = props => {
  // Getting the device color theme, this will also work with react-native-web
  const colorScheme = useColorScheme(); // 'dark' | 'light' | null
  /*
   * To enable changing the app theme dynamicly in the app (run-time)
   * we're gonna use useState so we can override the default device theme
   */
  const [isDark, setIsDark] = React.useState(org.defaultTheme === 'dark');

  const setDefaultTheme = async () => {
    const storedIsDark = await AsyncStorage.getItem('isDark');

    if (storedIsDark === null) {
      // No explicit user choice saved yet — default to org.defaultTheme
      // regardless of the OS theme.
      setScheme(org.defaultTheme);
      return;
    }

    setScheme(storedIsDark === 'false' ? 'light' : 'dark');
  };

  // Listening to changes of device appearance while in run-time
  React.useEffect(() => {
    setDefaultTheme();
  }, [colorScheme]);

  const setScheme = React.useCallback(scheme => {
    if (scheme === 'dark') {
      Object.entries(charitiesDarkColors).forEach(([key, value]) => {
        colors[key] = value
      })
      
      Object.entries(loyaltyDarkColors).forEach(([key, value]) => {
        colors[key] = value
      })

      Object.entries(mainDarkColors).forEach(([key, value]) => {
        colors[key] = value
      })

      colors.darkBlue = org.colors.dark.base.darkBlue;
      colors.navyBlue = org.colors.dark.base.navyBlue;
    } else {

      Object.entries(charitiesLightColors).forEach(([key, value]) => {
        colors[key] = value
      })

      Object.entries(loyaltyLightColors).forEach(([key, value]) => {
        colors[key] = value
      })

      Object.entries(mainLightColors).forEach(([key, value]) => {
        colors[key] = value
      })

      colors.darkBlue = org.colors.light.base.darkBlue;
      colors.navyBlue = org.colors.light.base.navyBlue;

    }
    setIsDark(scheme === 'dark');
  }, []);

  // Memoized so the 188+ consumers of useTheme() only re-render when isDark
  // actually changes, not on every ThemeProvider render (setScheme is
  // stable via useCallback above, so it's safe to include here).
  const defaultTheme = React.useMemo(
    () => ({
      isDark,
      // Chaning color schemes according to theme
      colors: isDark ? darkColors : lightColors,
      // Overrides the isDark value will cause re-render inside the context.
      setScheme,
    }),
    [isDark, setScheme],
  );

  const backgroundColor = isDark ? colors.darkModeBackground : '#fff';

  return (
    <ThemeContext.Provider value={defaultTheme}>
      <SafeAreaProvider>
        <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor }}>
          <StatusBar translucent={false} backgroundColor={backgroundColor} />
          {props.children}
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to get the theme object returns {isDark, colors, setScheme}
export const useTheme = () => React.useContext(ThemeContext);
