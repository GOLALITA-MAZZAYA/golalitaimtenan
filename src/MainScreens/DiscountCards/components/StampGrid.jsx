import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TypographyText } from '../../../components/Typography';
import { colors } from '../../../components/colors';
import { useTheme } from '../../../components/ThemeProvider';
import { LUSAIL_BOLD, LUSAIL_REGULAR } from '../../../redux/types';
import Svg, { Path } from 'react-native-svg';

const CheckIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17L4 12"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const StampGrid = ({ totalStamps = 10, balanceStamps = 0, usedStamps }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  // Normalize numbers
  const total = Math.max(1, Number(totalStamps) || 1);
  const balance = Math.max(0, Number(balanceStamps) || 0);
  const calculatedUsed = usedStamps !== undefined ? Number(usedStamps) : Math.max(0, total - balance);

  const stamps = Array.from({ length: total }, (_, i) => ({
    index: i,
    isUsed: i < calculatedUsed,
  }));

  const activeColor = colors.main || '#C29F54';
  const inactiveBorder = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)';
  const inactiveBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const textMuted = isDark ? '#9CA3AF' : '#6B7280';

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {stamps.map((item) => {
          const isStamped = item.isUsed;
          return (
            <View
              key={item.index}
              style={[
                styles.stampCircle,
                isStamped
                  ? {
                      backgroundColor: activeColor,
                      borderColor: activeColor,
                      shadowColor: activeColor,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.35,
                      shadowRadius: 4,
                      elevation: 3,
                    }
                  : {
                      backgroundColor: inactiveBg,
                      borderColor: inactiveBorder,
                      borderStyle: 'dashed',
                    },
              ]}
            >
              {isStamped ? (
                <CheckIcon size={18} color="#FFFFFF" />
              ) : (
                <TypographyText
                  title={`${item.index + 1}`}
                  size={13}
                  font={LUSAIL_BOLD}
                  textColor={textMuted}
                />
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.badge}>
          <TypographyText
            title={`${calculatedUsed} / ${total}`}
            size={13}
            font={LUSAIL_BOLD}
            textColor={isDark ? colors.white : colors.black}
          />
          <TypographyText
            title={` ${t('DiscountCards.couponsCompleted', 'Coupons Completed')}`}
            size={12}
            font={LUSAIL_REGULAR}
            textColor={textMuted}
          />
        </View>

        <View style={[styles.badge, { backgroundColor: isDark ? 'rgba(194, 159, 84, 0.15)' : '#FBF7EE' }]}>
          <TypographyText
            title={`${balance}`}
            size={13}
            font={LUSAIL_BOLD}
            textColor={activeColor}
          />
          <TypographyText
            title={` ${t('DiscountCards.remaining', 'Remaining')}`}
            size={12}
            font={LUSAIL_REGULAR}
            textColor={activeColor}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  stampCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingHorizontal: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
});

export default StampGrid;
