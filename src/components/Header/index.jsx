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
import { isRTL } from '../../../utils';

const Header = ({
  btns = ['back', 'notifications'],
  label,
  subLabel,
  titleChildren,
  align = 'center',
  style,
  additionalBtnsProps,
  rightChildren,
}) => {
  const { isDark } = useTheme();
  const isRtl = isRTL();
  const isLeft = align === 'left';

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

      <View
        style={[
          styles.titleWrapper,
          isLeft && {
            justifyContent: isRtl ? 'flex-end' : 'flex-start',
            paddingHorizontal: 8,
          },
        ]}
      >
        {titleChildren ? (
          titleChildren
        ) : subLabel ? (
          <View
            style={{
              alignItems: isLeft ? (isRtl ? 'flex-end' : 'flex-start') : 'center',
              justifyContent: 'center',
            }}
          >
            <TypographyText
              textColor={isDark ? colors.white : '#202226'}
              size={16.5}
              font={LUSAIL_REGULAR}
              style={{
                textAlign: isLeft ? (isRtl ? 'right' : 'left') : 'center',
                fontWeight: '700',
              }}
              title={label}
            />
            <TypographyText
              textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
              size={11.5}
              font={LUSAIL_REGULAR}
              style={{
                textAlign: isLeft ? (isRtl ? 'right' : 'left') : 'center',
                marginTop: 2,
                fontWeight: '500',
              }}
              title={subLabel}
            />
          </View>
        ) : (
          <TypographyText
            textColor={isDark ? colors.white : '#202226'}
            size={18}
            font={LUSAIL_REGULAR}
            style={{
              flex: 1,
              textAlign: isLeft ? (isRtl ? 'right' : 'left') : 'center',
            }}
            title={label}
          />
        )}
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
