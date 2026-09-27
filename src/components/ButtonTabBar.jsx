import React, { useEffect, useState } from 'react';
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
import {
  goHome,
  openTab,
  navigationRef,
  getActiveTabRouteName,
} from '../Navigation/RootNavigation';
import AnimatedIcon from './AnimatedIcon';
import useIsGuest from '../hooks/useIsGuest';
import { showMessage } from 'react-native-flash-message';

const HomeIcon = sized(HomeSvg, 28, 30);
const CardIcon = sized(CardSvg, 28, 30);
const ProfileIcon = sized(ProfileSvg, 30, 28);

/**
 * App bottom bar overlay (not a real Tabs navigator).
 * Subscribes to navigation state so the selected icon stays in sync.
 */
export const ButtonTabBar = () => {
  const { t } = useTranslation();
  const isGuest = useIsGuest();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState(() => getActiveTabRouteName());

  useEffect(() => {
    const syncActiveTab = () => {
      setActiveTab(getActiveTabRouteName());
    };

    syncActiveTab();

    if (!navigationRef.isReady()) {
      return undefined;
    }

    const unsubscribe = navigationRef.addListener('state', syncActiveTab);
    return unsubscribe;
  }, []);

  const activeColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const passiveColor = isDark ? 'white' : 'black';

  const getColor = screenName =>
    activeTab === screenName ? activeColor : passiveColor;

  return (
    <View style={styles.TabView__wrapper}>
      <View
        style={[
          styles.TabView,
          { backgroundColor: isDark ? '#2E2E2E' : '#fff' },
        ]}
      >
        <TouchableOpacity style={styles.TabView__item} onPress={() => goHome()}>
          <View style={styles.iconWrapper}>
            <HomeIcon color={getColor('Main')} />
          </View>
          <TypographyText
            textColor={colors.lightGrey}
            size={13}
            font={LUSAIL_REGULAR}
            title={t('TabBar.home')}
            style={{ color: getColor('Main') }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.TabView__item}
          onPress={() => openTab('MapPage')}
        >
          <AnimatedIcon color={getColor('MapPage')} />
          <TypographyText
            textColor={colors.lightGrey}
            size={13}
            font={LUSAIL_REGULAR}
            title={t('TabBar.map')}
            style={{ color: getColor('MapPage') }}
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
            openTab('card');
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
            style={{ color: getColor('card') }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.TabView__item}
          onPress={() => openTab('Profile')}
        >
          <View style={styles.iconWrapper}>
            <ProfileIcon color={getColor('Profile')} />
          </View>
          <TypographyText
            textColor={colors.lightGrey}
            size={13}
            font={LUSAIL_REGULAR}
            title={t('TabBar.profile')}
            style={{ color: getColor('Profile') }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  TabView__wrapper: {
    backgroundColor: 'transparent',
  },
  TabView: {
    ...mainStyles.shadow,
    backgroundColor: '#FFFFFF',
    height: 65,
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 21 : 8,
  },
  TabView__item: {
    width: '25%',
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'relative',
  },
});
