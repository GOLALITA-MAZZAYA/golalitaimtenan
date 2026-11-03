import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Image from "../../../../components/AppImage";
import { TypographyText } from '../../../../components/Typography';
import { colors } from '../../../../components/colors';
import { BALOO_2 } from '../../../../redux/types';

const RedeemGridCard = ({ icon, onPress, title, isDark, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.card,
        {
          backgroundColor: isDark ? colors.loyaltyCardBackground : '#FFFFFF',
          borderColor: isDark ? '#3A3A3C' : 'rgba(0, 0, 0, 0.04)',
        },
        style,
      ]}
    >
      <View style={styles.iconWrapper}>
        <Image
          source={typeof icon === 'string' ? { uri: icon } : icon}
          style={styles.icon}
          contentFit="contain"
        />
      </View>

      <TypographyText
        title={title}
        font={BALOO_2}
        size={12}
        textColor={isDark ? colors.white : '#000000'}
        style={styles.title}
        numberOfLines={2}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: '31.33%',
    minHeight: 120,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginHorizontal: '1%',
    // Soft card shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 46,
    height: 46,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 16,
  },
});

export default RedeemGridCard;
