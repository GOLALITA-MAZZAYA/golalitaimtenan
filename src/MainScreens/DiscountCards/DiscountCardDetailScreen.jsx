import React, { useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { useTheme } from '../../components/ThemeProvider';
import { colors } from '../../components/colors';
import Header from '../../components/Header';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_BOLD, LUSAIL_REGULAR } from '../../redux/types';
import StampGrid from './components/StampGrid';
import BranchItem from './components/BranchItem';
import RedemptionHistoryItem from './components/RedemptionHistoryItem';
import CardStatusBadge from './components/CardStatusBadge';
import HTMLRenderer from '../../components/HTMLRenderer';
import { getCardState, STATUS_COLORS } from './cardStatus';
import { fetchCustomerCardDetail } from '../../redux/discountCard/discountCard-thunks';
import { resetDiscountCardDetail } from '../../redux/discountCard/discountCard-actions';
import Svg, { Circle, Path } from 'react-native-svg';

const RefreshIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.5 2V7H16.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.5 22V17H7.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20.49 15C19.9828 16.4812 19.0664 17.7846 17.8466 18.7573C16.6268 19.73 15.1517 20.3344 13.5934 20.4996C12.0352 20.6648 10.4563 20.3842 9.04016 19.6911C7.62402 18.9979 6.42777 17.9202 5.59 16.58L2.5 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.51 9C4.01717 7.51882 4.93361 6.21539 6.15344 5.24272C7.37326 4.27005 8.84831 3.66557 10.4066 3.50041C11.9648 3.33525 13.5437 3.61578 14.9598 4.30891C16.376 5.00204 17.5722 6.07977 18.41 7.42L21.5 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CheckIcon = ({ size = 24, color = '#10B981' }) => (
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

const ClockIcon = ({ size = 24, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path d="M12 7V12L15 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DiscountCardDetailScreen = ({ route, navigation }) => {
  const { cardId, merchantName } = route.params || {};
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const { cardDetail, cardDetailLoading } = useSelector(
    (state) => state.discountCardReducer || { cardDetail: null, cardDetailLoading: false }
  );

  const loadDetail = useCallback(() => {
    dispatch(fetchCustomerCardDetail(cardId));
  }, [dispatch, cardId]);

  // Load when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadDetail();
    }, [loadDetail])
  );

  // Auto-refresh when a push notification (e.g. transaction confirmation) arrives
  useEffect(() => {
    try {
      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        console.log('[DiscountCardDetail] Push notification received while on screen, auto-refreshing detail...', remoteMessage?.notification?.title);
        loadDetail();
      });
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    } catch (e) {
      console.log('[DiscountCardDetail] messaging listener error:', e);
    }
  }, [loadDetail]);

  useEffect(() => {
    return () => {
      dispatch(resetDiscountCardDetail());
    };
  }, [dispatch]);

  const card = cardDetail;
  const activeColor = colors.main || '#C29F54';
  const backgroundColor = isDark ? colors.darkModeBackground : colors.white;
  const cardBg = isDark ? colors.modalDarkBackground || '#1E1E24' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const textMuted = isDark ? '#9CA3AF' : '#6B7280';

  const title = card?.merchant_name || merchantName || t('DiscountCards.cardDetail', 'Coupon Detail');
  const { total, used, balance, status, isUsable } = getCardState(card);
  const isExpired = status === 'expired';

  // Server renders the rolling QR (encodes the card's qr_token) and blanks it once the card is used.
  // Force https (http 301-redirects) and cache-bust per fetched card object so a refresh shows the
  // rolled QR, not a cached image.
  const qrImageUri = React.useMemo(() => {
    if (!card?.qr_image_url) return null;
    const url = String(card.qr_image_url).replace(/^http:\/\//i, 'https://');
    return `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
  }, [card]);
  const [qrImageFailed, setQrImageFailed] = React.useState(false);
  useEffect(() => setQrImageFailed(false), [qrImageUri]);

  const unusableTitle = isExpired
    ? t('DiscountCards.expiredTitle', 'Coupon Expired')
    : t('DiscountCards.allUsedTitle', 'Program Completed');
  const unusableDesc =
    card?.message ||
    (isExpired
      ? t('DiscountCards.expiredDesc', 'This coupon has expired and can no longer be redeemed.')
      : t('DiscountCards.allUsedDesc', 'All coupons have been completed and 0 remaining.'));

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Header
        label={title}
        btns={['back']}
        additionalBtnsProps={{
          back: {
            onPress: () => navigation.goBack(),
          },
        }}
        rightChildren={
          <TouchableOpacity
            onPress={loadDetail}
            disabled={cardDetailLoading}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[styles.headerRefreshBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6' }]}
          >
            {cardDetailLoading ? (
              <ActivityIndicator size="small" color={activeColor} />
            ) : (
              <RefreshIcon size={18} color={isDark ? colors.white : colors.black} />
            )}
          </TouchableOpacity>
        }
      />

      {cardDetailLoading && !card ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={activeColor} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={cardDetailLoading}
              onRefresh={loadDetail}
              tintColor={activeColor}
              colors={[activeColor]}
            />
          }
        >
          {/* Top Summary Card */}
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: cardBg,
                borderColor,
                shadowColor: '#000',
                shadowOpacity: isDark ? 0.3 : 0.08,
              },
            ]}
          >
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <TypographyText
                  title={card?.merchant_name || merchantName || 'Coupon'}
                  size={18}
                  font={LUSAIL_BOLD}
                  textColor={isDark ? colors.white : colors.black}
                />
              </View>
              {Boolean(card) && <CardStatusBadge status={status} />}
            </View>

            {Boolean(card?.expiry_date) && (
              <TypographyText
                title={`${t('DiscountCards.expiresOn', 'Valid until')}: ${card.expiry_date}`}
                size={12}
                font={LUSAIL_REGULAR}
                textColor={isExpired ? STATUS_COLORS.expired : textMuted}
                style={styles.expirySub}
              />
            )}

            {total > 0 && (
              <StampGrid totalStamps={total} balanceStamps={balance} usedStamps={used} />
            )}
          </View>

          {/* QR Code Presentation Box OR Used/Expired Notice */}
          {card && !isUsable ? (
            <View
              style={[
                styles.qrBox,
                {
                  backgroundColor: isDark ? '#141419' : '#F9FAFB',
                  borderColor,
                  alignItems: 'center',
                  paddingVertical: 26,
                  paddingHorizontal: 20,
                },
              ]}
            >
              <View
                style={[
                  styles.completedCheckCircle,
                  {
                    backgroundColor: isExpired
                      ? (isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2')
                      : (isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5'),
                  },
                ]}
              >
                {isExpired ? (
                  <ClockIcon size={30} color={STATUS_COLORS.expired} />
                ) : (
                  <CheckIcon size={30} color="#10B981" />
                )}
              </View>

              <TypographyText
                title={unusableTitle}
                size={17}
                font={LUSAIL_BOLD}
                textColor={isDark ? colors.white : colors.black}
                style={{ marginTop: 14 }}
              />

              <TypographyText
                title={unusableDesc}
                size={13}
                font={LUSAIL_REGULAR}
                textColor={textMuted}
                style={{ textAlign: 'center', marginTop: 6, paddingHorizontal: 12, lineHeight: 18 }}
              />
            </View>
          ) : (
            <View
              style={[
                styles.qrBox,
                {
                  backgroundColor: isDark ? '#141419' : '#F9FAFB',
                  borderColor,
                },
              ]}
            >
              <TypographyText
                title={t('DiscountCards.scanToRedeemCoupon', 'Scan to Redeem Coupon')}
                size={15}
                font={LUSAIL_BOLD}
                textColor={isDark ? colors.white : colors.black}
                style={{ marginBottom: 12 }}
              />

              <View style={styles.qrInnerWhiteCard}>
                {qrImageUri && !qrImageFailed ? (
                  <Image
                    source={{ uri: qrImageUri }}
                    style={styles.qrImage}
                    resizeMode="contain"
                    onError={() => setQrImageFailed(true)}
                  />
                ) : (
                  <View style={styles.qrPlaceholder}>
                    {cardDetailLoading ? (
                      <ActivityIndicator size="small" color={activeColor} />
                    ) : (
                      <TypographyText
                        title={t('DiscountCards.qrUnavailable', 'QR code unavailable. Tap refresh to try again.')}
                        size={13}
                        font={LUSAIL_REGULAR}
                        textColor="#6B7280"
                        style={{ textAlign: 'center', paddingHorizontal: 12 }}
                      />
                    )}
                  </View>
                )}
              </View>

              <TypographyText
                title={t('DiscountCards.showQrPrompt', 'Show this QR code to the cashier at checkout')}
                size={13}
                font={LUSAIL_REGULAR}
                textColor={textMuted}
                style={styles.qrPromptText}
              />

              <TouchableOpacity
                style={[styles.refreshButton, { backgroundColor: activeColor }]}
                onPress={loadDetail}
                activeOpacity={0.8}
              >
                <RefreshIcon size={16} color="#FFFFFF" />
                <TypographyText
                  title={t('DiscountCards.refreshQr', 'Refresh QR')}
                  size={13}
                  font={LUSAIL_BOLD}
                  textColor="#FFFFFF"
                  style={styles.refreshBtnText}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Description & Terms (HTML) */}
          {Boolean(card?.description) && (
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: cardBg,
                  borderColor,
                  shadowColor: '#000',
                  shadowOpacity: isDark ? 0.3 : 0.08,
                },
              ]}
            >
              <TypographyText
                title={t('DiscountCards.aboutOffer', 'About this Offer')}
                size={15}
                font={LUSAIL_BOLD}
                textColor={isDark ? colors.white : colors.black}
                style={{ marginBottom: 8 }}
              />
              <HTMLRenderer value={card.description} color={textMuted} />
            </View>
          )}

          {/* Branches Section */}
          {Boolean(card?.branches && card.branches.length > 0) && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <TypographyText
                  title={t('DiscountCards.branches', 'Available Branches')}
                  size={16}
                  font={LUSAIL_BOLD}
                  textColor={isDark ? colors.white : colors.black}
                />
                <View style={[styles.countBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6' }]}>
                  <TypographyText
                    title={`${card.branches.length}`}
                    size={12}
                    font={LUSAIL_BOLD}
                    textColor={isDark ? colors.white : colors.black}
                  />
                </View>
              </View>

              {card.branches.map((branch, index) => (
                <BranchItem key={branch.branch_id || index} branch={branch} />
              ))}
            </View>
          )}

          {/* Redemption History Section */}
          {Boolean(card?.redemption_history && card.redemption_history.length > 0) && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <TypographyText
                  title={t('DiscountCards.redemptionHistory', 'Redemption History')}
                  size={16}
                  font={LUSAIL_BOLD}
                  textColor={isDark ? colors.white : colors.black}
                />
                <View style={[styles.countBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6' }]}>
                  <TypographyText
                    title={`${card.redemption_history.length}`}
                    size={12}
                    font={LUSAIL_BOLD}
                    textColor={isDark ? colors.white : colors.black}
                  />
                </View>
              </View>

              {card.redemption_history.map((tx, index) => (
                <RedemptionHistoryItem key={tx.tx_ref || index} item={tx} />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  expirySub: {
    marginTop: 4,
    marginBottom: 8,
  },
  qrBox: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 20,
  },
  qrInnerWhiteCard: {
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  qrImage: {
    width: 190,
    height: 190,
  },
  qrPlaceholder: {
    width: 190,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPromptText: {
    marginTop: 14,
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginTop: 14,
    gap: 8,
  },
  refreshBtnText: {
    marginLeft: 4,
  },
  sectionContainer: {
    marginTop: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerRefreshBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCheckCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DiscountCardDetailScreen;
