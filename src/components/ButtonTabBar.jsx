import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { sized } from '../Svg';
import { TypographyText } from './Typography';
import { colors } from './colors';
import HomeSvg from '../assets/home.svg';
import CardSvg from '../assets/card.svg';
import { LUSAIL_REGULAR } from '../redux/types';
import { mainStyles } from '../styles/mainStyles';
import { useTheme } from './ThemeProvider';
import { useTranslation } from 'react-i18next';
import ProfileSvg from '../assets/Profile.svg';
import { navigate } from '../Navigation/RootNavigation';
import AnimatedIcon from './AnimatedIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { NO_TAB_BAR_ROUTES } from '../Navigation/MainStack';
import { showMessage } from 'react-native-flash-message';
import useIsGuest from '../hooks/useIsGuest';

const HomeIcon = sized(HomeSvg, 26, 27);
const CardIcon = sized(CardSvg, 28, 23);
const ProfileIcon = sized(ProfileSvg, 24, 27);

export let ButtonTabBar = ({ state }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const isGuest = useIsGuest();

  const focusedRoute = state.routes[state.index];
  const currentRouteName = getFocusedRouteNameFromRoute(focusedRoute) || 'Main';

  if (NO_TAB_BAR_ROUTES.includes(currentRouteName)) {
    return null;
  }

  const activeColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const passiveColor = isDark ? 'white' : 'black';

  const getColor = screenName => {
    return currentRouteName === screenName ? activeColor : passiveColor;
  };

  return (
    <View style={styles.TabView__wrapper}>
      <View
        style={[
          styles.TabView,
          {
            backgroundColor: isDark ? '#1C1C1E' : '#fff',
            borderTopColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.TabView__item}
          onPress={() => {
            navigate('Main');
          }}
        >
          <View style={styles.iconWrapper}>
            <HomeIcon color={getColor('Main')} />
          </View>
          <TypographyText
            textColor={colors.lightGrey}
            size={13}
            font={LUSAIL_REGULAR}
            title={t('TabBar.home')}
            style={{
              color: getColor('Main'),
              marginTop: 4,
              fontWeight: '600',
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.TabView__item}
          onPress={() => navigate('MapPage')}
        >
          <View style={styles.iconWrapper}>
            <AnimatedIcon color={getColor('MapPage')} />
          </View>
          <TypographyText
            textColor={colors.lightGrey}
            size={13}
            font={LUSAIL_REGULAR}
            title={t('TabBar.map')}
            style={{
              color: getColor('MapPage'),
              marginTop: 4,
              fontWeight: '600',
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.TabView__item}
          onPress={() => {
            if (isGuest) {
              showMessage({
                type: 'warning',
                message: t('Drawer.notForGuest'),
              });
              return;
            }
            navigate('card');
          }}
        >
          <View style={styles.iconWrapper}>
            <CardIcon color={getColor('card')} />
          </View>
          <TypographyText
            textColor={colors.lightGrey}
            size={13}
            font={LUSAIL_REGULAR}
            title={t('TabBar.card')}
            style={{
              color: getColor('card'),
              marginTop: 4,
              fontWeight: '600',
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.TabView__item}
          onPress={() => {
            navigate('Profile');
          }}
        >
          <View style={styles.iconWrapper}>
            <ProfileIcon color={getColor('Profile')} />
          </View>
          <TypographyText
            textColor={colors.lightGrey}
            size={13}
            font={LUSAIL_REGULAR}
            title={t('TabBar.profile')}
            style={{
              color: getColor('Profile'),
              marginTop: 4,
              fontWeight: '600',
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  TabView__wrapper: {},
  TabView: {
    ...mainStyles.shadow,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    zIndex: -1,
  },
  TabView__item: {
    width: '22%',
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'relative',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ButtonTabBar;
