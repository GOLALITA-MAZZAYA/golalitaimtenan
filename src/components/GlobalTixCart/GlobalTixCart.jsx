import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { TypographyText } from '../Typography';
import { BALOO_SEMIBOLD } from '../../redux/types';
import { colors } from '../colors';
import { useTheme } from '../ThemeProvider';
import { useTranslation } from 'react-i18next';
import { 
  globalTixCartItemsSelector, 
  globalTixCartTotalPriceSelector, 
  globalTixCartTotalQuantitySelector 
} from '../../redux/globalTix/globalTix-cart-selectors';
import { clearGlobalTixCart } from '../../redux/globalTix/globalTix-cart-actions';

const GlobalTixCart = ({ onPress }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const cartItems = useSelector(globalTixCartItemsSelector);
  const totalPrice = useSelector(globalTixCartTotalPriceSelector);
  const totalQuantity = useSelector(globalTixCartTotalQuantitySelector);

  const handleClearCart = () => {
    dispatch(clearGlobalTixCart());
  };

  if (totalQuantity === 0) {
    return null;
  }

  return (
    <TouchableOpacity 
      style={[
        styles.cartContainer,
        { backgroundColor: isDark ? colors.darkBlue : colors.green }
      ]}
      onPress={onPress}
    >
      <View style={styles.cartContent}>
        <View style={styles.cartInfo}>
          <TypographyText
            title={`${totalQuantity} ${totalQuantity === 1 ? 'item' : 'items'} in cart`}
            size={14}
            font={BALOO_SEMIBOLD}
            textColor={colors.white}
          />
          <TypographyText
            title={`${totalPrice} QAR`}
            size={16}
            font={BALOO_SEMIBOLD}
            textColor={colors.white}
          />
        </View>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={handleClearCart}
        >
          <TypographyText
            title="Clear"
            size={12}
            textColor={colors.white}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartInfo: {
    flex: 1,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
  },
});

export default GlobalTixCart;



