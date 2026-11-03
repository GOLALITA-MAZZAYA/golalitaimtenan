import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TypographyText } from '../../../components/Typography';
import { colors } from '../../../components/colors';
import { useTheme } from '../../../components/ThemeProvider';
import { LUSAIL_BOLD, LUSAIL_REGULAR } from '../../../redux/types';
import { useTranslation } from 'react-i18next';
import Svg, { Path, Rect } from 'react-native-svg';
import CardStatusBadge from './CardStatusBadge';
import { getCardState, STATUS_COLORS } from '../cardStatus';

const CardIcon = ({ size = 22, color = '#C29F54' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="2"
      y="5"
      width="20"
      height="14"
      rx="3"
      stroke={color}
      strokeWidth="2"
    />
    <Path d="M2 10H22" stroke={color} strokeWidth="2" />
    <Rect x="6" y="14" width="4" height="2" rx="1" fill={color} />
  </Svg>
);

const ChevronRight = ({ size = 18, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 5L16 12L9 19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const StampCardItem = ({ card, onPress }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const { total, used, status, isUsable } = getCardState(card);
  const progressRatio = total > 0 ? Math.min(1, used / total) : 0;
  const expiryDate = card.expiry_date;

  const cardBg = isDark ? colors.modalDarkBackground || '#1E1E24' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const activeColor = colors.main || '#C29F54';
  const progressColor = isUsable ? activeColor : STATUS_COLORS[status] || STATUS_COLORS.used;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.cardContainer,
        {
          backgroundColor: cardBg,
          borderColor,
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.3 : 0.07,
          opacity: isUsable ? 1 : 0.6,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.merchantInfo}>
          <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(194, 159, 84, 0.15)' : '#FBF7EE' }]}>
            <CardIcon size={20} color={activeColor} />
          </View>
          <View style={styles.nameWrapper}>
            <TypographyText
              title={card.merchant_name || 'Merchant Card'}
              size={16}
              font={LUSAIL_BOLD}
              textColor={isDark ? colors.white : colors.black}
              numberOfLines={1}
            />
            {Boolean(expiryDate) && (
              <TypographyText
                title={`${t('DiscountCards.expiresOn', 'Expires')}: ${expiryDate}`}
                size={12}
                font={LUSAIL_REGULAR}
                textColor={status === 'expired' ? STATUS_COLORS.expired : (isDark ? '#9CA3AF' : '#6B7280')}
                style={styles.expiryText}
              />
            )}
          </View>
        </View>

        <CardStatusBadge status={status} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <TypographyText
            title={`${used} / ${total} ${t('DiscountCards.used', 'Used')}`}
            size={12}
            font={LUSAIL_BOLD}
            textColor={isDark ? colors.white : colors.black}
            style={{ flex: 1, marginRight: 8 }}
            numberOfLines={1}
          />
          <TypographyText
            title={`${Math.round(progressRatio * 100)}%`}
            size={12}
            font={LUSAIL_BOLD}
            textColor={progressColor}
          />
        </View>
        <View style={[styles.progressBarTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6' }]}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progressRatio * 100}%`,
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>
      </View>

      {/* Footer CTA */}
      <View style={styles.footerRow}>
        <TypographyText
          title={t('DiscountCards.cardDetail', 'Coupon Detail')}
          size={13}
          font={LUSAIL_BOLD}
          textColor={activeColor}
        />
        <ChevronRight size={16} color={activeColor} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  merchantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nameWrapper: {
    flex: 1,
  },
  expiryText: {
    marginTop: 2,
  },
  progressSection: {
    marginTop: 14,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(150,150,150,0.15)',
    gap: 4,
  },
});

export default StampCardItem;
