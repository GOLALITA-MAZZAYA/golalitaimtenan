import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import Image from "../../../../components/AppImage";
import Carousel from "react-native-reanimated-carousel";
import ImageViewerModal from "./ImageViewerModal";
import { useTheme } from "../../../../components/ThemeProvider";
import Header from "../../../../components/Header";
import { useTranslation } from "react-i18next";
import MerchantCard from "./MerchantCard";
import ShareIcon from "./ShareIcon";
import NotificationIcon from "./NotificationIcon";
import { colors } from "../../../../components/colors";
import { SCREEN_WIDTH } from "../../../../styles/mainStyles";
import { TypographyText } from "../../../../components/Typography";
import { BALOO_2 } from "../../../../redux/types";
import StarFilledSvg from '../../../../assets/star-filled.svg';
import { useState } from "react";
import CommonButton from "../../common/CommonButton";
import trackActivity from "../../../../api/activityTracker";
import useMerchantFeedbackSummary from "../../../../hooks/useMerchantFeedbackSummary";

const BANNER_ASPECT_RATIO = 23 / 10;
const BANNER_WIDTH = SCREEN_WIDTH - 40;
const BANNER_HEIGHT = BANNER_WIDTH / BANNER_ASPECT_RATIO;

const TabHeader = ({ merchantDetails, onShare, ribbonText, title }) => {

  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const banners = merchantDetails?.banners || [];

  const merchantId =
    merchantDetails?.merchant_id ||
    merchantDetails?.id ||
    merchantDetails?.partner_id?.[0];
  const { summary, status: summaryStatus } = useMerchantFeedbackSummary(merchantId);

  // Live average from feedback summary. Hidden when there are no reviews yet;
  // falls back to the static merchant rating only if the summary call fails.
  const feedbackCount = Number(summary?.total_feedback_count) || 0;
  const bannerRating =
    summaryStatus === 'error'
      ? merchantDetails?.rating
      : feedbackCount > 0
        ? (Number(summary.average_rating) || 0).toFixed(1)
        : null;

  const handleLogoPress = (index) => {
    setSelectedIndex(index);
    setIsModalVisible(true)
  };

  const imageViewerData = banners.map(banner => ({
    url: banner.banner_image,
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
  }));

  return (
    <View
      style={{
        backgroundColor: isDark ? colors.darkModeBackground : colors.white,
        width: '100%',
      }}
    >
      <Header label={title} btns={['back']} />

      <View
        style={[
          styles.merchantLogoBlock,
          {
            backgroundColor: isDark ? '#1C1C1E' : '#F5F5F7',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          }
        ]}
      >
        <Carousel
          loop={banners.length > 1}
          width={BANNER_WIDTH}
          height={BANNER_HEIGHT}
          autoPlay={banners.length > 1}
          autoPlayInterval={3500}
          data={banners}
          scrollAnimationDuration={800}
          onSnapToItem={setActiveSlide}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.merchantLogo}
              activeOpacity={0.9}
              onPress={() => handleLogoPress(index)}
            >
              <Image
                source={{ uri: item?.banner_image }}
                style={styles.merchantLogo}
                contentFit="cover"
              />
            </TouchableOpacity>
          )}
        />

        {!!bannerRating && (
          <View
            style={[
              styles.ratingBlock,
              {
                flexDirection: isArabic ? 'row-reverse' : 'row',
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                left: isArabic ? 14 : 'auto',
                right: isArabic ? 'auto' : 14,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }
            ]}
          >
            <StarFilledSvg color={colors.primary} width={14} height={14} />

            <TypographyText
              title={`${bannerRating}`}
              font={BALOO_2}
              size={13}
              style={styles.ratingText}
              textColor={'#FFFFFF'}
            />
          </View>
        )}

        {banners.length > 1 && (
          <View style={styles.pagination} pointerEvents="none">
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeSlide && styles.dotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.actionIcons}>
        <ShareIcon onShare={onShare} />

        {/* <NotificationIcon
            isSubscribe={merchantDetails.is_subscribe}
            merchantId={
              merchantDetails.merchant_id ??
              merchantDetails.partner_id?.[0] ??
              merchantDetails.id
            }
          /> */}
      </View>

      <MerchantCard
        uri={merchantDetails.merchant_logo ?? merchantDetails.org_logo}
        ribbonText={ribbonText}
        merchantName={
          isArabic
            ? merchantDetails?.merchant_name_arabic
            : merchantDetails.merchant_name
        }
      />

      {merchantDetails.x_online_store && (
        <CommonButton
          text={t('PremiumPartner.openOnlineStore')}
          onPress={() => {
            trackActivity('page_visit', {
              merchant_id: merchantDetails.id ?? merchantDetails.merchant_id,
              page_name: 'merchant_website',
              metadata: { link_type: 'website', link_value: merchantDetails.website, source: 'tab_header' },
            });
            Linking.openURL(merchantDetails.website);
          }}
          wrapperStyle={styles.onlineStoreBtn}
          textStyle={styles.storeText}
        />
      )}

      <ImageViewerModal
        onClose={() => setIsModalVisible(false)}
        isVisible={isModalVisible}
        data={imageViewerData}
        initialIndex={selectedIndex}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerSwiper: {
    marginTop: 14,
    paddingHorizontal: 20
  },

  onlineStoreBtn: {
    backgroundColor: '#00A3FF',
    borderWidth: 0,
    marginTop: 25,
    marginHorizontal: 20
  },

  storeText: {
    color: '#fff'
  },

  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 8
  },

  merchantLogo: {
    width: '100%',
    height: '100%',
  },

  merchantLogoBlock: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 10,
    marginHorizontal: 20,
  },

  ratingBlock: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    position: 'absolute',
    top: 14,
    borderWidth: 1,
    gap: 6
  },

  ratingText: {
    fontWeight: '700'
  },

  pagination: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },

  dotActive: {
    width: 16,
    backgroundColor: '#FFFFFF',
  },
});

export default TabHeader;