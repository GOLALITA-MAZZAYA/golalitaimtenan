import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TypographyText } from '../../../components/Typography';
import { colors } from '../../../components/colors';
import { useTheme } from '../../../components/ThemeProvider';
import { LUSAIL_BOLD, LUSAIL_REGULAR } from '../../../redux/types';
import { useTranslation } from 'react-i18next';

const RedemptionHistoryItem = ({ item }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#F9FAFB';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const textMuted = isDark ? '#9CA3AF' : '#6B7280';
  const activeColor = colors.main || '#C29F54';

  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor }]}>
      <View style={styles.topRow}>
        <View style={styles.leftCol}>
          <TypographyText
            title={item.date || '—'}
            size={13}
            font={LUSAIL_BOLD}
            textColor={isDark ? colors.white : colors.black}
          />
          {Boolean(item.invoice_ref) && (
            <TypographyText
              title={`${t('DiscountCards.invoice', 'Invoice')}: #${item.invoice_ref}`}
              size={11}
              font={LUSAIL_REGULAR}
              textColor={textMuted}
              style={styles.subText}
            />
          )}
        </View>

        <View style={styles.rightCol}>
          {item.amount !== undefined && item.amount !== null && (
            <TypographyText
              title={`${Number(item.amount).toFixed(2)} QAR`}
              size={14}
              font={LUSAIL_BOLD}
              textColor={activeColor}
            />
          )}
          <View style={[styles.stampBadge, { backgroundColor: isDark ? 'rgba(194, 159, 84, 0.15)' : '#FBF7EE' }]}>
            <TypographyText
              title={`-${item.stamps_used || 1} ${t('DiscountCards.coupons', t('DiscountCards.stamps', 'Coupons'))}`}
              size={11}
              font={LUSAIL_BOLD}
              textColor={activeColor}
            />
          </View>
        </View>
      </View>

      {Boolean(item.tx_ref) && (
        <View style={styles.txRow}>
          <TypographyText
            title={`${t('DiscountCards.ref', 'Ref')}: ${item.tx_ref}`}
            size={10}
            font={LUSAIL_REGULAR}
            textColor={textMuted}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flex: 1,
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  subText: {
    marginTop: 2,
  },
  stampBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  txRow: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(150,150,150,0.1)',
  },
});

export default RedemptionHistoryItem;
