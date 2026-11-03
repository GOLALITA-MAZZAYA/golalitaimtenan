import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../components/ThemeProvider';
import { colors } from '../../../components/colors';
import { TypographyText } from '../../../components/Typography';
import { LUSAIL_BOLD, LUSAIL_REGULAR } from '../../../redux/types';
import { getCustomerStampsApi } from '../../../api/stampCard';
import Svg, { Path, Rect } from 'react-native-svg';

const StampIcon = ({ size = 20, color = '#C29F54' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="4" stroke={color} strokeWidth="1.8" />
    <Path d="M8 12L11 15L16 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRight = ({ size = 16, color = '#9CA3AF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MerchantStampWidget = ({ merchantId, style }) => {
  const { isDark } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [stampCard, setStampCard] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!merchantId) return;

    let isMounted = true;
    setLoading(true);

    getCustomerStampsApi(merchantId)
      .then((cards) => {
        if (!isMounted) return;
        if (Array.isArray(cards) && cards.length > 0) {
          setStampCard(cards[0]);
        } else {
          setStampCard(null);
        }
      })
      .catch(() => {
        if (isMounted) setStampCard(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [merchantId]);

  if (!stampCard && !loading) {
    return null;
  }

  const activeColor = colors.main || '#C29F54';
  const cardBg = isDark ? colors.modalDarkBackground || '#1E1E24' : '#FFFFFF';
  const isReady = Boolean(stampCard?.reward_ready || Number(stampCard?.rewards_available) > 0);

  const target = Math.max(1, Number(stampCard?.target_stamps) || 5);
  const current = Math.min(target, Math.max(0, Number(stampCard?.current_stamps) || 0));
  const progressPercent = Math.min(100, Math.round((current / target) * 100));

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: cardBg,
          borderColor: isReady ? '#10B981' : (isDark ? 'rgba(255,255,255,0.08)' : '#E5E7EB'),
          borderWidth: isReady ? 1.5 : 1,
        },
        style,
      ]}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('StampCards')}
    >
      <View style={styles.leftIcon}>
        <StampIcon size={22} color={isReady ? '#10B981' : activeColor} />
      </View>

      <View style={styles.infoWrapper}>
        <View style={styles.topRow}>
          <TypographyText
            title={
              isReady
                ? `🎉 ${t('StampCards.ready', 'Reward Ready')} (${stampCard?.reward_amount || 100} QAR)`
                : (stampCard?.rule_name || t('StampCards.title', 'Loyalty Stamps'))
            }
            size={13}
            font={LUSAIL_BOLD}
            textColor={isReady ? '#10B981' : (isDark ? colors.white : colors.black)}
            numberOfLines={1}
            style={{ flex: 1 }}
          />
          <View
            style={[
              styles.pill,
              {
                backgroundColor: isReady
                  ? 'rgba(16, 185, 129, 0.15)'
                  : (isDark ? 'rgba(194, 159, 84, 0.15)' : '#F5EEDD'),
              },
            ]}
          >
            <TypographyText
              title={`${current}/${target}`}
              size={11}
              font={LUSAIL_BOLD}
              textColor={isReady ? '#10B981' : activeColor}
            />
          </View>
        </View>

        {/* Progress Bar */}
        <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#E5E7EB' }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercent}%`,
                backgroundColor: isReady ? '#10B981' : activeColor,
              },
            ]}
          />
        </View>

        <TypographyText
          title={
            stampCard?.rolling_text ||
            (isReady
              ? t('StampCards.redeemHint', 'Cashier can apply your reward during checkout.')
              : `${current} done, ${target - current} to go!`)
          }
          size={11}
          font={LUSAIL_REGULAR}
          textColor={isDark ? '#9CA3AF' : '#6B7280'}
          numberOfLines={1}
          style={{ marginTop: 4 }}
        />
      </View>

      <View style={styles.rightArrow}>
        <ChevronRight size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  leftIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoWrapper: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  pill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  rightArrow: {
    marginLeft: 8,
  },
});

export default MerchantStampWidget;
