import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { TypographyText } from '../../../Typography';
import { BALOO_SEMIBOLD } from '../../../../redux/types';
import { colors } from '../../../colors';
import { useTheme } from '../../../ThemeProvider';
import { globalTixCartTotalQuantitySelector } from '../../../../redux/globalTix/globalTix-cart-selectors';

const CartBtn = ({ onPress, ...props }) => {
  const { isDark } = useTheme();
  const cartQuantity = useSelector(globalTixCartTotalQuantitySelector);


  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      {...props}
    >
      <View style={styles.cartIcon}>
        <TypographyText
          title="🛒"
          size={20}
        />
        {cartQuantity > 0 && (
          <View style={[
            styles.badge,
            { backgroundColor: colors.orange }
          ]}>
            <TypographyText
              title={cartQuantity.toString()}
              size={10}
              font={BALOO_SEMIBOLD}
              textColor={colors.white}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
});

export default CartBtn;
