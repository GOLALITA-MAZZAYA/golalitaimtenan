import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';
import { userSelector } from '../../../redux/auth/auth-selectors';
import { TypographyText } from '../../../components/Typography';
import { colors } from '../../../components/colors';
import { useTheme } from '../../../components/ThemeProvider';
import { LUSAIL_BOLD, LUSAIL_REGULAR } from '../../../redux/types';
import { useTranslation } from 'react-i18next';
import Svg, { Path, Rect } from 'react-native-svg';

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

const GiftIcon = ({ size = 18, color = '#C29F54' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="8" width="18" height="4" rx="1" stroke={color} strokeWidth="1.8" />
    <Path d="M12 8V20M5 12V20H19V12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Path d="M12 8C12 8 10 4 7.5 4C5.5 4 5 5.5 5.5 6.5C6 7.5 12 8 12 8Z" stroke={color} strokeWidth="1.8" />
    <Path d="M12 8C12 8 14 4 16.5 4C18.5 4 19 5.5 18.5 6.5C18 7.5 12 8 12 8Z" stroke={color} strokeWidth="1.8" />
  </Svg>
);

const QrScanIcon = ({ size = 16, color = '#C29F54' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 7V5C3 3.89543 3.89543 3 5 3H7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M17 3H19C20.1046 3 21 3.89543 21 5V7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M21 17V19C21 20.1046 20.1046 21 19 21H17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M7 21H5C3.89543 21 3 20.1046 3 19V17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Rect x="7" y="7" width="3" height="3" fill={color} />
    <Rect x="14" y="7" width="3" height="3" fill={color} />
    <Rect x="7" y="14" width="3" height="3" fill={color} />
    <Path d="M14 14H17V17H14V14Z" fill={color} />
  </Svg>
);

const ChevronDown = ({ size = 16, color = '#9CA3AF', isOpen }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
  >
    <Path
      d="M6 9L12 15L18 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const StampCardItem = ({ card }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const user = useSelector(userSelector);
  const [showTerms, setShowTerms] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Field mapping with full backward compatibility
  const targetVal = card.target_stamps !== undefined ? card.target_stamps : card.total_stamps;
  const target = Math.max(1, Number(targetVal) || 5);
  const currentVal = card.current_stamps !== undefined ? card.current_stamps : card.used_stamps;
  const current = Math.min(target, Math.max(0, Number(currentVal) || 0));
  const toGoVal = card.stamps_to_go !== undefined ? card.stamps_to_go : (card.balance_stamps !== undefined ? card.balance_stamps : Math.max(0, target - current));
  const stampsToGo = Number(toGoVal);
  const rewardsAvailable = Number(card.rewards_available) || (card.reward_ready ? 1 : 0);
  const isRewardReady = Boolean(card.reward_ready || rewardsAvailable > 0);
  const activeColor = colors.main || '#C29F54';

  const rewardAmount = card.reward_amount ? Number(card.reward_amount) : null;
  const maxAmount = card.max_amount ? Number(card.max_amount) : null;
  const cycleNumber = card.cycle_number ? Number(card.cycle_number) : null;

  const validUntil = card.valid_until || card.expiry_date;
  const validFrom = card.valid_from;

  const memberBarcode = user?.barcode || user?.go_barcode || (user?.id ? String(user.id) : '');
  const memberQrValue = memberBarcode || String(card.customer_id || user?.id || '');

  const cardBg = isDark ? colors.modalDarkBackground || '#1E1E24' : '#FFFFFF';
  const borderColor = isRewardReady
    ? '#10B981'
    : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)');

  // Generate stamp slots
  const stampSlots = Array.from({ length: target }, (_, i) => ({
    index: i,
    isStamped: i < current,
    isTarget: i === target - 1,
  }));

  // Date formatting string
  let validityText = '';
  if (validFrom && validUntil) {
    validityText = `${validFrom} — ${validUntil}`;
  } else if (validUntil) {
    validityText = `${t('StampCards.validUntil', 'Valid until')}: ${validUntil}`;
  }

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: cardBg,
          borderColor,
          borderWidth: isRewardReady ? 1.5 : 1,
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.3 : 0.08,
        },
      ]}
    >
      {/* Header: Merchant Logo, Name, Cycle, and Status Badge */}
      <View style={styles.headerRow}>
        <View style={styles.merchantInfo}>
          {card.merchant_logo ? (
            <Image
              source={{ uri: card.merchant_logo }}
              style={styles.logoImage}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.logoPlaceholder, { backgroundColor: isDark ? 'rgba(194, 159, 84, 0.15)' : '#FBF7EE' }]}>
              <TypographyText
                title={(card.merchant_name || 'M').charAt(0).toUpperCase()}
                size={16}
                font={LUSAIL_BOLD}
                textColor={activeColor}
              />
            </View>
          )}

          <View style={styles.nameWrapper}>
            <View style={styles.titleRow}>
              <TypographyText
                title={card.merchant_name || t('StampCards.merchant', 'Merchant')}
                size={15}
                font={LUSAIL_BOLD}
                textColor={isDark ? colors.white : colors.black}
                numberOfLines={1}
                style={{ flexShrink: 1 }}
              />
              {Boolean(cycleNumber && cycleNumber > 0) && (
                <View style={[styles.cycleBadge, { backgroundColor: isDark ? 'rgba(194, 159, 84, 0.18)' : '#F5EEDD' }]}>
                  <TypographyText
                    title={`${t('StampCards.cycle', 'Cycle')} ${cycleNumber}`}
                    size={10}
                    font={LUSAIL_BOLD}
                    textColor={activeColor}
                  />
                </View>
              )}
            </View>
            {card.rule_name ? (
              <TypographyText
                title={card.rule_name}
                size={12}
                font={LUSAIL_REGULAR}
                textColor={activeColor}
                numberOfLines={1}
              />
            ) : null}
          </View>
        </View>

        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: isRewardReady
                ? 'rgba(16, 185, 129, 0.15)'
                : (isDark ? 'rgba(194, 159, 84, 0.15)' : '#F5EEDD'),
            },
          ]}
        >
          <TypographyText
            title={
              isRewardReady
                ? rewardsAvailable > 1
                  ? `🎉 ${rewardsAvailable} ${t('StampCards.readyPlural', 'REWARDS READY')}`
                  : t('StampCards.ready', '🎉 READY')
                : `${current}/${target}`
            }
            size={12}
            font={LUSAIL_BOLD}
            textColor={isRewardReady ? '#10B981' : activeColor}
          />
        </View>
      </View>

      {/* Visual Stamp Circles Grid */}
      <View style={styles.stampsGrid}>
        {stampSlots.map((slot) => {
          return (
            <View
              key={slot.index}
              style={[
                styles.stampCircle,
                slot.isStamped
                  ? {
                      backgroundColor: activeColor,
                      borderColor: activeColor,
                    }
                  : {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB',
                      borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#E5E7EB',
                      borderStyle: 'dashed',
                    },
              ]}
            >
              {slot.isStamped ? (
                <CheckIcon size={16} color="#FFFFFF" />
              ) : slot.isTarget ? (
                <GiftIcon size={16} color={activeColor} />
              ) : (
                <TypographyText
                  title={`${slot.index + 1}`}
                  size={12}
                  font={LUSAIL_BOLD}
                  textColor={isDark ? '#6B7280' : '#9CA3AF'}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* Rolling Status / Reward Alert Banner */}
      {isRewardReady ? (
        <View style={styles.rewardBanner}>
          <TypographyText
            title={
              card.rolling_text ||
              `🎁 ${t('StampCards.unlocked', 'Reward Unlocked!')} ${rewardAmount || ''} QAR`
            }
            size={13}
            font={LUSAIL_BOLD}
            textColor="#065F46"
          />
          <TypographyText
            title={t('StampCards.redeemHint', 'Cashier can apply your reward during checkout.')}
            size={11}
            font={LUSAIL_REGULAR}
            textColor="#047857"
            style={{ marginTop: 2 }}
          />
        </View>
      ) : (
        <View style={[styles.progressBanner, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB' }]}>
          <TypographyText
            title={card.rolling_text || `${current} done, ${stampsToGo} to go for reward!`}
            size={12}
            font={LUSAIL_REGULAR}
            textColor={isDark ? '#D1D5DB' : '#4B5563'}
          />
        </View>
      )}

      {/* Checkout Action: Show Member QR / Barcode for POS Cashier */}
      <TouchableOpacity
        style={[
          styles.scanBtn,
          {
            backgroundColor: isRewardReady
              ? '#10B981'
              : (isDark ? 'rgba(194, 159, 84, 0.15)' : '#F5EEDD'),
            borderColor: isRewardReady ? '#10B981' : activeColor,
          },
        ]}
        onPress={() => setShowQrModal(true)}
        activeOpacity={0.8}
      >
        <QrScanIcon size={18} color={isRewardReady ? '#FFFFFF' : activeColor} />
        <TypographyText
          title={
            isRewardReady
              ? t('StampCards.scanToRedeem', 'Scan to Redeem Reward')
              : t('StampCards.scanToCollect', 'Show Member QR at Checkout')
          }
          size={13}
          font={LUSAIL_BOLD}
          textColor={isRewardReady ? '#FFFFFF' : activeColor}
        />
      </TouchableOpacity>

      {/* Expiry & Terms Footer */}
      <View style={styles.footerRow}>
        <TypographyText
          title={validityText}
          size={11}
          font={LUSAIL_REGULAR}
          textColor={isDark ? '#6B7280' : '#9CA3AF'}
          style={{ flex: 1, marginRight: 8 }}
          numberOfLines={1}
        />

        {card.terms_and_conditions ? (
          <TouchableOpacity
            style={styles.termsToggle}
            onPress={() => setShowTerms(!showTerms)}
            activeOpacity={0.7}
          >
            <TypographyText
              title={t('StampCards.terms', 'Terms & Conditions')}
              size={11}
              font={LUSAIL_REGULAR}
              textColor={activeColor}
            />
            <ChevronDown size={14} color={activeColor} isOpen={showTerms} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Collapsible Terms & Conditions */}
      {showTerms && card.terms_and_conditions ? (
        <View style={[styles.termsBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F9FAFB' }]}>
          <TypographyText
            title={card.terms_and_conditions}
            size={11}
            font={LUSAIL_REGULAR}
            textColor={isDark ? '#9CA3AF' : '#6B7280'}
            style={{ lineHeight: 16 }}
          />
          {Boolean(maxAmount && maxAmount !== rewardAmount) && (
            <TypographyText
              title={`• ${t('StampCards.maxDiscount', 'Max discount ceiling')}: ${maxAmount} QAR`}
              size={11}
              font={LUSAIL_REGULAR}
              textColor={activeColor}
              style={{ marginTop: 4 }}
            />
          )}
          {Boolean(card.reward_frequency && card.reward_frequency !== 'no_limit') && (
            <TypographyText
              title={`• ${t('StampCards.limit', 'Limit')}: ${card.max_rewards_per_frequency || 1} ${t('StampCards.per', 'per')} ${card.reward_frequency}`}
              size={11}
              font={LUSAIL_REGULAR}
              textColor={activeColor}
              style={{ marginTop: 4 }}
            />
          )}
          {Boolean(card.max_rewards_per_customer && card.max_rewards_per_customer > 0) && (
            <TypographyText
              title={`• ${t('StampCards.lifetimeLimit', 'Lifetime limit')}: ${card.max_rewards_per_customer} ${t('StampCards.rewards', 'rewards')}`}
              size={11}
              font={LUSAIL_REGULAR}
              textColor={activeColor}
              style={{ marginTop: 4 }}
            />
          )}
        </View>
      ) : null}

      {/* Member Barcode / QR Modal */}
      <Modal
        visible={showQrModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQrModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: cardBg }]}>
            <View style={styles.modalHeader}>
              <TypographyText
                title={card.merchant_name || t('StampCards.title', 'Loyalty Stamps')}
                size={16}
                font={LUSAIL_BOLD}
                textColor={isDark ? colors.white : colors.black}
                style={{ flexShrink: 1 }}
              />
              <TouchableOpacity
                onPress={() => setShowQrModal(false)}
                style={styles.closeBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <TypographyText
                  title="✕"
                  size={16}
                  font={LUSAIL_BOLD}
                  textColor={isDark ? '#9CA3AF' : '#6B7280'}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.qrWrapper}>
              <QRCode
                value={memberQrValue || 'GOLALITA-MEMBER'}
                size={180}
                backgroundColor="#FFFFFF"
                color="#000000"
              />
            </View>

            <TypographyText
              title={user?.name || user?.full_name || ''}
              size={15}
              font={LUSAIL_BOLD}
              textColor={isDark ? colors.white : colors.black}
              style={{ marginTop: 14, textAlign: 'center' }}
            />
            <TypographyText
              title={`${t('StampCards.memberId', 'Member ID')}: ${user?.id || user?.partner_id || card.customer_id || 'N/A'}`}
              size={13}
              font={LUSAIL_REGULAR}
              textColor={activeColor}
              style={{ marginTop: 4, textAlign: 'center' }}
            />
            {memberBarcode ? (
              <TypographyText
                title={`${t('StampCards.barcode', 'Barcode')}: ${memberBarcode}`}
                size={12}
                font={LUSAIL_REGULAR}
                textColor={isDark ? '#9CA3AF' : '#6B7280'}
                style={{ marginTop: 2, textAlign: 'center' }}
              />
            ) : null}

            <TypographyText
              title={t(
                'StampCards.qrHint',
                'Show this QR code or Member ID to the cashier at checkout to collect stamps or redeem rewards.'
              )}
              size={12}
              font={LUSAIL_REGULAR}
              textColor={isDark ? '#9CA3AF' : '#6B7280'}
              style={{ textAlign: 'center', marginTop: 14, lineHeight: 17 }}
            />

            <TouchableOpacity
              style={[styles.doneBtn, { backgroundColor: activeColor }]}
              onPress={() => setShowQrModal(false)}
            >
              <TypographyText
                title={t('StampCards.done', 'Done')}
                size={14}
                font={LUSAIL_BOLD}
                textColor="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  merchantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F3F4F6',
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  nameWrapper: {
    flex: 1,
  },
  titleRow: {
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stampsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  stampCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardBanner: {
    backgroundColor: '#D1FAE5',
    borderColor: '#6EE7B7',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 6,
    marginBottom: 8,
  },
  progressBanner: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 6,
    marginBottom: 8,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(156, 163, 175, 0.2)',
  },
  termsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  termsBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  closeBtn: {
    padding: 4,
  },
  qrWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  doneBtn: {
    height: 44,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
});

export default StampCardItem;

