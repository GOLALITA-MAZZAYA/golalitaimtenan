import React from 'react';
import { colors } from '../colors';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Header from '../Header';
import UserInfo from './components/UserInfo';
import DrawerItemList from './components/DrawerItemsList';
import LogOutBtn from './components/LogOutBtn';
import { useTheme } from '../ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TypographyText } from '../Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { org } from '../../org/config';

const CustomDrawer = ({ navigation, styles: passedStyles, routeName }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const backgroundColor = isDark ? colors.darkModeBackground : colors.white;

  return (
    <View
      style={[
        localStyles.wrapper,
        {
          backgroundColor,
          paddingTop: 0,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          localStyles.scrollContent,
          { paddingBottom: insets.bottom > 0 ? insets.bottom + 30 : 50 },
        ]}
      >
        <Header
          style={{ paddingHorizontal: 0 }}
          btns={['back']}
          additionalBtnsProps={{
            back: {
              onPress: () => {
                navigation?.closeDrawer?.();
              },
            },
          }}
        />

        <UserInfo />

        <DrawerItemList navigation={navigation} routeName={routeName} />

        <LogOutBtn />

        <View style={localStyles.footer}>
          <TypographyText
            title={org.displayName}
            textColor={isDark ? '#52525B' : '#9CA3AF'}
            size={12}
            font={LUSAIL_REGULAR}
            style={localStyles.footerText}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 18,
  },
  scrollContent: {
    flexGrow: 1,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontWeight: '500',
  },
});

export default CustomDrawer;
