import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import useMerchantFeedbackSummary, {
  refreshMerchantFeedbackSummary,
} from '../../../../../hooks/useMerchantFeedbackSummary';
import { useTheme } from '../../../../../components/ThemeProvider';
import { TypographyText } from '../../../../../components/Typography';
import { colors } from '../../../../../components/colors';
import { BALOO_REGULAR, BALOO_SEMIBOLD } from '../../../../../redux/types';
import { isRTL } from '../../../../../../utils';
import { sized } from '../../../../../Svg';
import StarFilledSvg from '../../../../../assets/star-filled.svg';
import StarSvg from '../../../../../assets/star.svg';

const STAR_COLOR = '#FFB800';
const STARS = [5, 4, 3, 2, 1];

const RatingSummary = ({
  merchantId,
  refreshKey,
  onRatePress,
  fallbackRating,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const isArabic = isRTL();
  const { summary } = useMerchantFeedbackSummary(merchantId);

  // refreshKey bumps after a rating is submitted; refetch so the banner badge
  // and this card both pick up the new average.
  useEffect(() => {
    if (refreshKey) {
      refreshMerchantFeedbackSummary(merchantId);
    }
  }, [refreshKey]);

  if (!summary) {
    return null;
  }

  const total = Number(summary.total_feedback_count) || 0;
  const average = Number(summary.average_rating) || 0;
  const breakdown = summary.rating_breakdown || {};

  const textColor = isDark ? colors.white : '#111827';
  const mutedColor = isDark ? '#9CA3AF' : '#6B7280';
  const trackColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB';
  const cardBg = isDark ? 'rgba(255, 255, 255, 0.04)' : '#F9FAFB';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const rowDirection = isArabic ? 'row-reverse' : 'row';

  // --- State A: No Reviews Yet ---
  if (total === 0) {
    const StarBigIcon = sized(StarFilledSvg, 22, 22, STAR_COLOR);
    const StarSmallIcon = sized(
      StarSvg,
      13,
      13,
      isDark ? colors.mainDarkMode : colors.darkBlue,
    );

    return (
      <View
        style={[
          styles.emptyCard,
          {
            flexDirection: rowDirection,
            backgroundColor: cardBg,
            borderColor: cardBorder,
          },
        ]}
      >
        <View
          style={[
            styles.emptyBadge,
            {
              backgroundColor: isDark
                ? 'rgba(255, 184, 0, 0.12)'
                : 'rgba(255, 184, 0, 0.14)',
            },
          ]}
        >
          <StarBigIcon />
        </View>

        <View
          style={[
            styles.emptyContent,
            {
              alignItems: isArabic ? 'flex-end' : 'flex-start',
              marginHorizontal: 12,
            },
          ]}
        >
          <View style={[styles.emptyTitleRow, { flexDirection: rowDirection }]}>
            <TypographyText
              title={t('MerchantFeedback.noReviews')}
              textColor={textColor}
              font={BALOO_SEMIBOLD}
              size={15}
            />
            {!!fallbackRating && (
              <View
                style={[
                  styles.fallbackBadge,
                  {
                    flexDirection: rowDirection,
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.05)',
                  },
                ]}
              >
                <StarFilledSvg color={STAR_COLOR} width={11} height={11} />
                <TypographyText
                  title={`${Number(fallbackRating).toFixed(1)}`}
                  textColor={textColor}
                  font={BALOO_SEMIBOLD}
                  size={12}
                  style={isArabic ? { marginRight: 3 } : { marginLeft: 3 }}
                />
              </View>
            )}
          </View>

          <TypographyText
            title={t('MerchantFeedback.beFirstToReview')}
            textColor={mutedColor}
            font={BALOO_REGULAR}
            size={12}
            style={styles.emptySubtitle}
          />
        </View>

        {onRatePress && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onRatePress}
            style={[
              styles.emptyRateBtn,
              {
                flexDirection: rowDirection,
                borderColor: isDark
                  ? 'rgba(255, 221, 0, 0.4)'
                  : 'rgba(10, 37, 64, 0.2)',
                backgroundColor: isDark
                  ? 'rgba(255, 221, 0, 0.1)'
                  : 'rgba(10, 37, 64, 0.05)',
              },
            ]}
          >
            <StarSmallIcon />
            <TypographyText
              title={t('MerchantFeedback.rateNow')}
              textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
              font={BALOO_SEMIBOLD}
              size={12}
              style={isArabic ? { marginRight: 5 } : { marginLeft: 5 }}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // --- State B: Reviews Exist ---
  return (
    <View
      style={[
        styles.card,
        {
          flexDirection: rowDirection,
          backgroundColor: cardBg,
          borderColor: cardBorder,
        },
      ]}
    >
      {/* Left Column: Average Score & Stars */}
      <View style={styles.averageBox}>
        <View style={[styles.scoreRow, { flexDirection: rowDirection }]}>
          <TypographyText
            title={average.toFixed(1)}
            textColor={textColor}
            font={BALOO_REGULAR}
            size={36}
            style={styles.averageText}
          />
          <TypographyText
            title="/5"
            textColor={mutedColor}
            font={BALOO_REGULAR}
            size={14}
            style={styles.maxScore}
          />
        </View>

        <View style={[styles.starsRow, { flexDirection: rowDirection }]}>
          {[1, 2, 3, 4, 5].map(star => {
            const StarIcon = sized(
              StarFilledSvg,
              13,
              13,
              star <= Math.round(average) ? STAR_COLOR : trackColor,
            );
            return <StarIcon key={star} />;
          })}
        </View>

        <View
          style={[
            styles.countPill,
            {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.06)'
                : 'rgba(0, 0, 0, 0.04)',
            },
          ]}
        >
          <TypographyText
            title={`${total} ${total === 1 ? t('MerchantFeedback.review', 'review') : t('MerchantFeedback.reviews', 'reviews')}`}
            textColor={mutedColor}
            font={BALOO_REGULAR}
            size={11}
          />
        </View>
      </View>

      {/* Subtle Divider */}
      <View
        style={[
          styles.divider,
          {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.06)',
          },
        ]}
      />

      {/* Right Column: 5-Star Breakdown */}
      <View
        style={[
          styles.bars,
          isArabic ? { marginRight: 14 } : { marginLeft: 14 },
        ]}
      >
        {STARS.map(star => {
          const count = Number(breakdown[`${star}_star`]) || 0;
          const percent = total ? Math.min((count / total) * 100, 100) : 0;

          return (
            <View
              key={star}
              style={[styles.barRow, { flexDirection: rowDirection }]}
            >
              <View style={[styles.barLabelWrapper, { flexDirection: rowDirection }]}>
                <TypographyText
                  title={`${star}`}
                  textColor={textColor}
                  font={BALOO_SEMIBOLD}
                  size={12}
                />
                <StarFilledSvg
                  color={STAR_COLOR}
                  width={9}
                  height={9}
                  style={isArabic ? { marginRight: 2 } : { marginLeft: 2 }}
                />
              </View>

              <View style={[styles.barTrack, { backgroundColor: trackColor }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${percent}%`,
                      alignSelf: isArabic ? 'flex-end' : 'flex-start',
                    },
                  ]}
                />
              </View>

              <TypographyText
                title={`${count}`}
                textColor={mutedColor}
                font={BALOO_REGULAR}
                size={11}
                style={styles.barCount}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  divider: {
    width: 1,
    height: '80%',
    marginHorizontal: 4,
  },
  averageBox: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  scoreRow: {
    alignItems: 'baseline',
  },
  averageText: {
    fontWeight: '700',
    lineHeight: 40,
  },
  maxScore: {
    marginLeft: 3,
    marginBottom: 4,
  },
  starsRow: {
    gap: 3,
    marginTop: 2,
    marginBottom: 6,
  },
  countPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
  },
  bars: {
    flex: 1,
    gap: 5,
  },
  barRow: {
    alignItems: 'center',
  },
  barLabelWrapper: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barTrack: {
    flex: 1,
    height: 7,
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: STAR_COLOR,
  },
  barCount: {
    minWidth: 20,
    textAlign: 'center',
  },

  // Empty state styles
  emptyCard: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    marginBottom: 6,
  },
  emptyBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContent: {
    flex: 1,
  },
  emptyTitleRow: {
    alignItems: 'center',
    gap: 6,
  },
  emptySubtitle: {
    marginTop: 2,
  },
  fallbackBadge: {
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  emptyRateBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
});

export default RatingSummary;
