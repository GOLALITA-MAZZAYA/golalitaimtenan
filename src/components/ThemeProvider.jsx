import * as React from 'react';
// import {useColorScheme} from 'react-native-appearance';
import { StatusBar, Text, TouchableOpacity } from 'react-native';
import { colors } from './colors';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

colors.darkBlue = '#000';
colors.navyBlue = '#000';

export const ThemeProvider = props => {
  // Getting the device color theme, this will also work with react-native-web
  // const colorScheme = useColorScheme(); // Can be dark | light | no-preference
  const colorScheme = 'dark';
  /*
   * To enable changing the app theme dynamicly in the app (run-time)
   * we're gonna use useState so we can override the default device theme
   */
  const [isDark, setIsDark] = React.useState(false);

  const setDefaultTheme = async () => {
    const isDark = await AsyncStorage.getItem('isDark');

    if (!isDark) {
      setScheme('dark');
    }

    const scheme = isDark === 'false' ? 'light' : 'dark';

    setScheme(scheme);
  };

  // Listening to changes of device appearance while in run-time
  React.useEffect(() => {
    setDefaultTheme();
  }, [colorScheme]);

  const setScheme = scheme => {
    if (scheme === 'dark') {
      colors.darkBlue = '#000';
      colors.navyBlue = '#000';
    } else {
      colors.darkBlue = '#940037';
      colors.navyBlue = '#072536';
    }
    //#072536
    setIsDark(scheme === 'dark');
  };

  const defaultTheme = {
    isDark,
    // Chaning color schemes according to theme
    colors: isDark ? darkColors : lightColors,
    // Overrides the isDark value will cause re-render inside the context.
    setScheme,
  };

  const backgroundColor = isDark ? colors.darkModeBackground : '#fff';

  return (
    <ThemeContext.Provider value={defaultTheme}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
          <StatusBar translucent={false} backgroundColor={backgroundColor} />
          {props.children}
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to get the theme object returns {isDark, colors, setScheme}
export const useTheme = () => React.useContext(ThemeContext);
