import React, { useState } from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../../components/colors';
import { useTheme } from '../../../../components/ThemeProvider';
import TermsAndConditions from './TermsAndConditions';
import ContractBtn from './ContractBtn';
import ComplaintBtn from './ComplaintBtn';
import MapViewBtn from './MapViewBtn';
import RateBtn from './RateBtn';
import RatingSummary from './RatingSummary';
import WeeklyHours from './WeeklyHours';
import { TypographyText } from '../../../../components/Typography';
import { BALOO_2, BALOO_SEMIBOLD } from '../../../../redux/types';
import { isRTL } from '../../../../../utils';
import { useTranslation } from 'react-i18next';
import CallSvg from '../../../../assets/loyaltyPoints/partners/phone.svg';
import EmailSvg from '../../../../assets/mailf.svg';
import PlanetSvg from '../../../../assets/planet.svg';
import InstructionSvg from '../../../../assets/loyaltyPoints/instruction.svg';
import LocationSvg from '../../../../assets/location.svg';
import { sized } from '../../../../Svg';
import trackActivity from '../../../../api/activityTracker';

const PhoneIcon = sized(CallSvg, 18, 18);
const TimeIcon = sized(InstructionSvg, 18, 18);
const MailIcon = sized(EmailSvg, 18, 18);
const WebIcon = sized(PlanetSvg, 18, 18);
const PinIcon = sized(LocationSvg, 18, 18);

const InfoTab = ({ merchantDetails }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const isArabic = isRTL();
  const backgroundColor = isDark ? colors.darkModeBackground : colors.white;
  const iconColor = isDark ? colors.mainDarkMode : colors.darkBlue;

  const merchantId =
    merchantDetails?.merchant_id ||
    merchantDetails?.id ||
    merchantDetails?.partner_id?.[0];

  const [summaryRefreshKey, setSummaryRefreshKey] = useState(0);
  const [isRateModalVisible, setIsRateModalVisible] = useState(false);
  // null = loading, true = weekly timetable shown, false = fall back to open_from/open_till
  const [hasTimetable, setHasTimetable] = useState(null);

  const address = isArabic
    ? `${merchantDetails.x_arabic_name || ''} ${merchantDetails.x_street_ar ? `${merchantDetails.x_street_ar}, ` : ''}${merchantDetails.x_city_ar ? `${merchantDetails.x_city_ar}, ` : ''}${merchantDetails.x_country_ar || ''}`
    : merchantDetails.address;

  const hasHours = merchantDetails.open_from && merchantDetails.open_till;

  const cleanWebsite = merchantDetails.website
    ? merchantDetails.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
    : null;

  const detailsList = [
    merchantDetails.phone && {
      key: 'phone',
      title: t('Merchants.phone') || 'Phone',
      value: merchantDetails.phone,
      icon: <PhoneIcon color={iconColor} />,
      onPress: () => {
        trackActivity('merchant_detail_link_click', {
          merchant_id: merchantId,
          page_name: 'merchant_detail',
          metadata: { link_type: 'phone', link_value: merchantDetails.phone, source: 'info_tab' },
        });
        Linking.openURL(`tel:${merchantDetails.phone}`);
      },
    },
    hasTimetable !== false && { key: 'weeklyHours', custom: true },
    hasTimetable === false && hasHours && {
      key: 'hours',
      title: t('ProductPage.workingHours') || 'Working hours',
      value: `${merchantDetails.open_from} - ${merchantDetails.open_till}`,
      icon: <TimeIcon color={iconColor} />,
    },
    merchantDetails.email && {
      key: 'email',
      title: t('ProductPage.email') || 'Email',
      value: merchantDetails.email,
      icon: <MailIcon color={iconColor} />,
      onPress: () => {
        trackActivity('merchant_detail_link_click', {
          merchant_id: merchantId,
          page_name: 'merchant_detail',
          metadata: { link_type: 'email', link_value: merchantDetails.email, source: 'info_tab' },
        });
        Linking.openURL(`mailto:${merchantDetails.email}`);
      },
    },
    merchantDetails.website && {
      key: 'website',
      title: t('ProductPage.website') || 'Website',
      value: cleanWebsite,
      icon: <WebIcon color={iconColor} />,
      onPress: () => {
        trackActivity('page_visit', {
          merchant_id: merchantId,
          page_name: 'merchant_website',
          metadata: { link_type: 'website', link_value: merchantDetails.website, source: 'info_tab' },
        });
        Linking.openURL(merchantDetails.website);
      },
    },
    address && {
      key: 'address',
      title: t('ProductPage.address') || 'Address',
      value: address,
      icon: <PinIcon color={iconColor} />,
    },
  ].filter(Boolean);

  return (
    <View style={[styles.wrapper, { backgroundColor }]}>
      {/* Top Action Pills (Rate, Complaint & Contract) */}
      <View
        style={[
          styles.actionsRow,
          { flexDirection: isArabic ? 'row-reverse' : 'row' },
        ]}
      >
        <RateBtn
          merchantDetails={merchantDetails}
          visible={isRateModalVisible}
          onOpen={() => setIsRateModalVisible(true)}
          onClose={() => setIsRateModalVisible(false)}
          onSubmitted={() => setSummaryRefreshKey(key => key + 1)}
        />
        <ComplaintBtn merchantDetails={merchantDetails} />
        <ContractBtn merchantId={merchantId} />
      </View>

      {/* Terms and Conditions (if any) */}
      <TermsAndConditions merchantId={merchantId} />

      {/* Clean Spacious Details List */}
      <View style={styles.listContainer}>
        {detailsList.map((item, index) => {
          const isLast = index === detailsList.length - 1;
          const isClickable = !!item.onPress;

          if (item.custom) {
            return (
              <WeeklyHours
                key={item.key}
                merchantId={merchantId}
                isLast={isLast}
                onLoaded={setHasTimetable}
              />
            );
          }

          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={isClickable ? 0.7 : 1}
              onPress={item.onPress}
              disabled={!isClickable}
              style={[
                styles.rowItem,
                {
                  flexDirection: isArabic ? 'row-reverse' : 'row',
                  borderBottomColor: isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.06)',
                  borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                },
              ]}
            >
              <View style={styles.iconBox}>
                {item.icon}
              </View>

              <View
                style={[
                  styles.textBox,
                  {
                    alignItems: isArabic ? 'flex-end' : 'flex-start',
                    marginRight: isArabic ? 16 : 0,
                    marginLeft: isArabic ? 0 : 16,
                  },
                ]}
              >
                <TypographyText
                  title={item.title}
                  textColor={isDark ? '#8E8E93' : '#6B7280'}
                  font={BALOO_2}
                  size={12}
                  style={styles.label}
                />
                <TypographyText
                  title={item.value}
                  textColor={isDark ? '#FFFFFF' : '#111827'}
                  font={BALOO_2}
                  size={15}
                  style={styles.value}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Map Preview Banner */}
      <MapViewBtn
        style={styles.mapBlock}
        merchantLatitude={merchantDetails.partner_latitude}
        merchantLongitude={merchantDetails.partner_longitude}
      />

      {/* Customer Ratings & Reviews */}
      <View style={styles.reviewsSection}>
        <TypographyText
          title={t('MerchantFeedback.ratingsAndReviews', 'Ratings & Reviews')}
          textColor={isDark ? colors.white : '#111827'}
          font={BALOO_SEMIBOLD}
          size={16}
          style={[styles.sectionTitle, { textAlign: isArabic ? 'right' : 'left' }]}
        />
        <RatingSummary
          merchantId={merchantId}
          refreshKey={summaryRefreshKey}
          fallbackRating={merchantDetails?.rating}
          onRatePress={() => setIsRateModalVisible(true)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexGrow: 1,
    marginTop: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  listContainer: {
    marginTop: 4,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  iconBox: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBox: {
    flex: 1,
  },
  label: {
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  value: {
    fontWeight: '600',
    lineHeight: 22,
  },
  mapBlock: {
    marginTop: 18,
  },
  reviewsSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    marginBottom: 4,
  },
});

export default InfoTab;
