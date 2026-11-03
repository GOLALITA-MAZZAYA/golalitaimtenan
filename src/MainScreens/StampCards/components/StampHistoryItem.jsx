import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TypographyText } from '../../../components/Typography';
import { colors } from '../../../components/colors';
import { useTheme } from '../../../components/ThemeProvider';
import { LUSAIL_BOLD, LUSAIL_REGULAR } from '../../../redux/types';
import { useTranslation } from 'react-i18next';
import Svg, { Path, Rect } from 'react-native-svg';

const ReceiptIcon = ({ size = 16, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 12H15M9 16H13M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21L8.5 19L12 21L15.5 19L19 21Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const StampHistoryItem = ({ card }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const activeColor = colors.main || '#C29F54';
  const cardBg = isDark ? colors.modalDarkBackground || '#1E1E24' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  const redemptions = Array.isArray(card.redemption_history) ? card.redemption_history : [];

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: cardBg,
          borderColor,
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.3 : 0.08,
        },
      ]}
    >
      {/* Header: Merchant Name & Completed Badge */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrapper}>
          <TypographyText
            title={card.merchant_name || t('StampCards.merchant', 'Merchant')}
            size={15}
            font={LUSAIL_BOLD}
            textColor={isDark ? colors.white : colors.black}
            numberOfLines={1}
          />
          {card.rule_name ? (
            <TypographyText
              title={card.rule_name}
              size={12}
              font={LUSAIL_REGULAR}
              textColor={activeColor}
              numberOfLines={1}
              style={{ marginTop: 2 }}
            />
          ) : null}
        </View>

        <View style={styles.badgeRow}>
          {Boolean(card.cycle_number) && (
            <View style={[styles.cycleBadge, { backgroundColor: isDark ? 'rgba(194, 159, 84, 0.18)' : '#F5EEDD' }]}>
              <TypographyText
                title={`${t('StampCards.cycle', 'Cycle')} ${card.cycle_number}`}
                size={10}
                font={LUSAIL_BOLD}
                textColor={activeColor}
              />
            </View>
          )}

          <View style={[styles.statusPill, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
            <TypographyText
              title={t('StampCards.completed', 'Completed').toUpperCase()}
              size={10}
              font={LUSAIL_BOLD}
              textColor="#10B981"
            />
          </View>
        </View>
      </View>

      {/* Summary Counters */}
      <View style={[styles.summaryBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F9FAFB' }]}>
        <View style={styles.counterCol}>
          <TypographyText
            title={String(card.rewards_earned_count ?? 1)}
            size={16}
            font={LUSAIL_BOLD}
            textColor={activeColor}
          />
          <TypographyText
            title={t('StampCards.rewardsEarned', 'Earned')}
            size={11}
            font={LUSAIL_REGULAR}
            textColor={isDark ? '#9CA3AF' : '#6B7280'}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB' }]} />

        <View style={styles.counterCol}>
          <TypographyText
            title={String(card.rewards_redeemed_count ?? redemptions.length ?? 1)}
            size={16}
            font={LUSAIL_BOLD}
            textColor="#10B981"
          />
          <TypographyText
            title={t('StampCards.rewardsRedeemed', 'Redeemed')}
            size={11}
            font={LUSAIL_REGULAR}
            textColor={isDark ? '#9CA3AF' : '#6B7280'}
          />
        </View>
      </View>

      {/* Redemption Records List */}
      {redemptions.length > 0 ? (
        <View style={styles.redemptionsList}>
          <TypographyText
            title={t('StampCards.redemptionHistory', 'Redemption Records')}
            size={12}
            font={LUSAIL_BOLD}
            textColor={isDark ? '#D1D5DB' : '#374151'}
            style={{ marginBottom: 8 }}
          />

          {redemptions.map((item, idx) => (
            <View
              key={item.redemption_ref || String(idx)}
              style={[
                styles.recordItem,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FAFAFA',
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#EEEEEE',
                },
              ]}
            >
              <View style={styles.recordHeader}>
                <View style={styles.refRow}>
                  <ReceiptIcon size={14} color="#10B981" />
                  <TypographyText
                    title={item.redemption_ref || `RED-#${idx + 1}`}
                    size={12}
                    font={LUSAIL_BOLD}
                    textColor={isDark ? colors.white : colors.black}
                  />
                </View>
                <View style={styles.discountBadge}>
                  <TypographyText
                    title={`- ${item.discount_applied || 0} QAR`}
                    size={11}
                    font={LUSAIL_BOLD}
                    textColor="#10B981"
                  />
                </View>
              </View>

              <View style={styles.recordDetails}>
                {Boolean(item.bill_amount) && (
                  <TypographyText
                    title={`${t('StampCards.billAmount', 'Bill')}: ${item.bill_amount} QAR`}
                    size={11}
                    font={LUSAIL_REGULAR}
                    textColor={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                )}
                {Boolean(item.invoice_ref) && (
                  <TypographyText
                    title={`${t('StampCards.invoice', 'Invoice')}: ${item.invoice_ref}`}
                    size={11}
                    font={LUSAIL_REGULAR}
                    textColor={isDark ? '#9CA3AF' : '#6B7280'}
                  />
                )}
              </View>

              {Boolean(item.date) && (
                <TypographyText
                  title={item.date}
                  size={10}
                  font={LUSAIL_REGULAR}
                  textColor={isDark ? '#6B7280' : '#9CA3AF'}
                  style={{ marginTop: 4 }}
                />
              )}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleWrapper: {
    flex: 1,
    marginRight: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cycleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  summaryBox: {
    flexDirection: 'row',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  counterCol: {
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 24,
  },
  redemptionsList: {
    marginTop: 4,
  },
  recordItem: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginBottom: 6,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  refRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  discountBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  recordDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
});

export default StampHistoryItem;
