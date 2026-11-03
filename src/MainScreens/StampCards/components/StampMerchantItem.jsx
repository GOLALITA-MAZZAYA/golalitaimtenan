import React, { useState, useEffect, useMemo, memo } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CardWithNesetedItems from '../../../components/CardWithNestedItems';
import { userLocationSelector } from '../../../redux/global/global-selectors';
import useRoadDistance from '../../../hooks/useRoadDistance';
import { handleMerchantCardPress } from '../../MerchantsPage/helpers';
import { toggleFavourites } from '../../../redux/merchant/merchant-thunks';
import { getMerchantStampProgramsApi } from '../../../api/stampCard';
import { TypographyText } from '../../../components/Typography';
import { LUSAIL_BOLD, LUSAIL_REGULAR } from '../../../redux/types';
import { colors } from '../../../components/colors';
import { useTheme } from '../../../components/ThemeProvider';
import HTMLRenderer from '../../../components/HTMLRenderer';

// CardWithNestedItems renders children inside a horizontal ScrollView, which doesn't constrain
// width — so long content (terms) would stretch past the screen. Pin the dropdown to the card's
// inner width: screen - cardWrapper margins (16*2) - card padding (12*2) - card border (1*2).
const CARD_HORIZONTAL_INSET = 16 * 2 + 12 * 2 + 1 * 2;

const looksLikeHtml = (text) => /<[a-z][\s\S]*>/i.test(text);

const ChevronDown = ({ size = 14, color, isOpen }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
  >
    <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const StampMerchantItem = ({ merchant }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const dropdownWidth = windowWidth - CARD_HORIZONTAL_INSET;

  const userLocation = useSelector(userLocationSelector);
  const { favouriteMerchants } = useSelector(
    (state) => state.favouriteMerchantsReducer || { favouriteMerchants: [] }
  );

  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [hasLoadedPrograms, setHasLoadedPrograms] = useState(false);
  const [expandedRuleIds, setExpandedRuleIds] = useState({});

  const toggleDetails = (ruleId) =>
    setExpandedRuleIds((prev) => ({ ...prev, [ruleId]: !prev[ruleId] }));

  const isArabic = i18n.language === 'ar';
  const displayName = isArabic && merchant.x_arabic_name ? merchant.x_arabic_name : merchant.merchant_name;

  const isFavorite = useMemo(() => {
    return Array.isArray(favouriteMerchants) &&
      favouriteMerchants.some((m) => String(m.merchant_id) === String(merchant.merchant_id));
  }, [favouriteMerchants, merchant.merchant_id]);

  const { distance, distaceLoading } = useRoadDistance(
    userLocation?.longitude,
    userLocation?.latitude,
    merchant?.partner_longitude,
    merchant?.partner_latitude
  );

  // Toggle button for showing stamp programs
  const toggleBtns = useMemo(() => {
    return [
      {
        type: 'stamps',
        showText: t('StampCards.showPrograms', 'Show Stamp Programs'),
        hideText: t('StampCards.hidePrograms', 'Hide Stamp Programs'),
      },
    ];
  }, [t]);

  const loadPrograms = async () => {
    if (hasLoadedPrograms) return;
    setLoadingPrograms(true);
    try {
      const res = await getMerchantStampProgramsApi(merchant.merchant_id);
      const data = res?.data || res;
      setPrograms(Array.isArray(data?.programs) ? data.programs : []);
      setHasLoadedPrograms(true);
    } catch (err) {
      console.warn('Failed to load merchant programs:', err);
      setPrograms([]);
    } finally {
      setLoadingPrograms(false);
    }
  };

  const activeCount = merchant.active_programs_count || 1;
  const descriptionText = `${activeCount} ${t('StampCards.offers', 'Offers')}`;
  const activeColor = colors.main || '#C29F54';

  return (
    <View style={styles.cardWrapper}>
      <CardWithNesetedItems
        toggleBtns={toggleBtns}
        parentProps={{
          onPress: () => {
            handleMerchantCardPress(merchant);
          },
          onPressFavourite: () => {
            dispatch(toggleFavourites(merchant.merchant_id));
          },
          uri: merchant.merchant_logo,
          name: displayName,
          description: descriptionText,
          loadingDescription: false,
          distance,
          distaceLoading,
          isSaved: isFavorite,
        }}
      >
        {[
          <View key="stamps" type="stamps" style={[styles.programsDropdown, { width: dropdownWidth }]}>
            {programs.length === 0 && !hasLoadedPrograms ? (
              <ProgramsLoader onMount={loadPrograms} />
            ) : programs.length === 0 ? (
              <TypographyText
                title={t('StampCards.noActivePrograms', 'No active stamp programs at this store right now.')}
                size={12}
                font={LUSAIL_REGULAR}
                textColor={isDark ? '#9CA3AF' : '#6B7280'}
                style={styles.emptyText}
              />
            ) : (
              programs.map((prog) => {
                const targetVisits = Number(prog.target_visits) || 1;
                const currentStamps = Number(prog.current_stamps) || 0;
                const hasCard = Boolean(prog.has_card);
                const isRewardReady = Boolean(prog.reward_ready);
                const progressPercent = Math.min(100, Math.max(0, (currentStamps / targetVisits) * 100));
                const ruleKey = String(prog.rule_id);
                const isExpanded = Boolean(expandedRuleIds[ruleKey]);
                const terms = typeof prog.terms_and_conditions === 'string' ? prog.terms_and_conditions.trim() : '';
                const rewardAmount = Number(prog.reward_amount) || 0;
                const maxAmount = Number(prog.max_amount) || 0;
                const validity =
                  prog.valid_from && prog.valid_until
                    ? `${prog.valid_from} — ${prog.valid_until}`
                    : prog.valid_until
                    ? `${t('StampCards.validUntil', 'Valid until')}: ${prog.valid_until}`
                    : '';
                const hasDetails = Boolean(terms || validity || (maxAmount && maxAmount !== rewardAmount));
                const mutedColor = isDark ? '#9CA3AF' : '#6B7280';

                return (
                  <View
                    key={ruleKey}
                    style={[
                      styles.programCard,
                      {
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F9FAFB',
                        borderColor: isRewardReady
                          ? '#10B981'
                          : isDark
                          ? 'rgba(255, 255, 255, 0.08)'
                          : '#E5E7EB',
                      },
                    ]}
                  >
                    <View style={styles.programHeaderRow}>
                      <TypographyText
                        title={prog.program_name}
                        size={13}
                        font={LUSAIL_BOLD}
                        textColor={isDark ? '#FFFFFF' : '#111827'}
                        numberOfLines={1}
                        style={{ flex: 1, marginRight: 8 }}
                      />
                      <TypographyText
                        title={`🎁 ${prog.reward_amount || 100} QAR`}
                        size={12}
                        font={LUSAIL_BOLD}
                        textColor="#10B981"
                      />
                    </View>

                    {isRewardReady ? (
                      <View
                        style={[
                          styles.rewardReadyBadge,
                          { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5' },
                        ]}
                      >
                        <TypographyText
                          title={`🎉 ${t('StampCards.rewardReady', 'Reward Ready to Redeem!')}`}
                          size={11}
                          font={LUSAIL_BOLD}
                          textColor="#10B981"
                        />
                      </View>
                    ) : hasCard ? (
                      <View style={styles.progressSection}>
                        <View style={styles.progressTextRow}>
                          <TypographyText
                            title={
                              prog.rolling_text ||
                              `${currentStamps} / ${targetVisits} ${t('StampCards.visits', 'visits')} (${prog.stamps_to_go ?? (targetVisits - currentStamps)} ${t('StampCards.toGo', 'to go')})`
                            }
                            size={11}
                            font={LUSAIL_REGULAR}
                            textColor={activeColor}
                          />
                          <TypographyText
                            title={`${Math.round(progressPercent)}%`}
                            size={10}
                            font={LUSAIL_BOLD}
                            textColor={isDark ? '#9CA3AF' : '#6B7280'}
                          />
                        </View>
                        <View
                          style={[
                            styles.progressTrack,
                            { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB' },
                          ]}
                        >
                          <View
                            style={[
                              styles.progressFill,
                              { width: `${progressPercent}%`, backgroundColor: activeColor },
                            ]}
                          />
                        </View>
                      </View>
                    ) : (
                      <TypographyText
                        title={`🎯 ${targetVisits} ${t('StampCards.visitsNeeded', 'visits required')} • ${t('StampCards.notStartedYet', 'Not started yet')}`}
                        size={11}
                        font={LUSAIL_REGULAR}
                        textColor={isDark ? '#9CA3AF' : '#6B7280'}
                        style={{ marginTop: 4 }}
                      />
                    )}

                    {hasDetails && (
                      <TouchableOpacity
                        style={styles.detailsToggle}
                        onPress={() => toggleDetails(ruleKey)}
                        activeOpacity={0.7}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                      >
                        <TypographyText
                          title={
                            isExpanded
                              ? t('StampCards.lessDetails', 'Less Details')
                              : t('StampCards.moreDetails', 'More Details')
                          }
                          size={11}
                          font={LUSAIL_BOLD}
                          textColor={activeColor}
                        />
                        <ChevronDown size={14} color={activeColor} isOpen={isExpanded} />
                      </TouchableOpacity>
                    )}

                    {isExpanded && (
                      <View
                        style={[
                          styles.detailsBox,
                          { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF' },
                        ]}
                      >
                        {Boolean(validity) && (
                          <TypographyText
                            title={`📅 ${validity}`}
                            size={11}
                            font={LUSAIL_REGULAR}
                            textColor={mutedColor}
                          />
                        )}
                        {Boolean(maxAmount && maxAmount !== rewardAmount) && (
                          <TypographyText
                            title={`• ${t('StampCards.maxDiscount', 'Max discount')}: ${maxAmount} QAR`}
                            size={11}
                            font={LUSAIL_REGULAR}
                            textColor={activeColor}
                            style={{ marginTop: 4 }}
                          />
                        )}
                        {Boolean(terms) && (
                          <View style={{ marginTop: validity ? 8 : 0 }}>
                            <TypographyText
                              title={t('StampCards.terms', 'Terms & Conditions')}
                              size={12}
                              font={LUSAIL_BOLD}
                              textColor={isDark ? '#FFFFFF' : '#111827'}
                              style={{ marginBottom: 4 }}
                            />
                            {looksLikeHtml(terms) ? (
                              <HTMLRenderer value={terms} color={mutedColor} />
                            ) : (
                              <TypographyText
                                title={terms}
                                size={11}
                                font={LUSAIL_REGULAR}
                                textColor={mutedColor}
                                style={{ lineHeight: 16 }}
                              />
                            )}
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>
        ]}
      </CardWithNesetedItems>
    </View>
  );
};

const ProgramsLoader = ({ onMount }) => {
  useEffect(() => {
    onMount();
  }, []);

  return (
    <View style={styles.loaderBox}>
      <ActivityIndicator size="small" color={colors.main || '#C29F54'} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  programsDropdown: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
  },
  loaderBox: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    paddingVertical: 10,
    textAlign: 'center',
  },
  programCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginVertical: 4,
  },
  programHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardReadyBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  progressSection: {
    marginTop: 6,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 4,
  },
  detailsBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
  },
});

export default memo(StampMerchantItem);
