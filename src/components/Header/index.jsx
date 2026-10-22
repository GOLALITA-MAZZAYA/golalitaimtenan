import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../colors';
import { LUSAIL_REGULAR } from '../../redux/types';
import { TypographyText } from '../Typography';
import NotificationsBtn from './components/NotificationsBtn';
import { useTheme } from '../ThemeProvider';
import BackBtn from './components/BackBtn';
import FilterBtn from './components/FilterBtn';
import CartBtn from "./components/CartBtn";
import MyBookingsBtn from "./components/MyBookingsBtn";

const Header = ({
  btns = ['back', 'notifications'],
  label,
  style,
  additionalBtnsProps,
  rightChildren,
}) => {
  const { isDark } = useTheme();
  const hasMultipleRightBtns =
    (rightChildren ? 1 : 0) +
    (additionalBtnsProps?.cart ? 1 : 0) +
    (additionalBtnsProps?.myBookings ? 1 : 0) +
    (btns.includes('filter') ? 1 : 0) +
    (btns.includes('notifications') ? 1 : 0) > 1;

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.leftBtns}>
        {btns.includes('back') && <BackBtn {...additionalBtnsProps?.back} />}
      </View>

      <View style={styles.titleWrapper}>
        <TypographyText
          textColor={isDark ? colors.white : '#202226'}
          size={18}
          font={LUSAIL_REGULAR}
          style={{ flex: 1, textAlign: "center" }}
          title={label}
        />
      </View>
      <View style={[styles.rightBtns, hasMultipleRightBtns && styles.rightBtnsWide]}>
        {rightChildren}
        {additionalBtnsProps?.myBookings && (
          <MyBookingsBtn {...additionalBtnsProps.myBookings} />
        )}
        {additionalBtnsProps?.cart && (
          <CartBtn {...additionalBtnsProps.cart} />
        )}
        {btns.includes("filter") && (
          <FilterBtn {...additionalBtnsProps?.filter} />
        )}
        {btns.includes('notifications') && (
          <NotificationsBtn {...additionalBtnsProps?.notifications} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  leftBtns: {
    width: 44,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 44,
    height: 44,
    overflow: 'visible',
  },
  rightBtnsWide: {
    width: 90,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default Header;
