import { StyleSheet, View, Linking } from "react-native";
import ImageViewerModal from "./ImageViewerModal";
import { useTheme } from "../../../../components/ThemeProvider";
import BannerSwiper from "../../../../components/BannerSwiper";
import Header from "../../../../components/Header";
import { useTranslation } from "react-i18next";
import MerchantCard from "./MerchantCard";
import ShareIcon from "./ShareIcon";
import NotificationIcon from "./NotificationIcon";
import { colors } from "../../../../components/colors";
import { TypographyText } from "../../../../components/Typography";
import { BALOO_SEMIBOLD } from "../../../../redux/types";
import StarFilledSvg from "../../../../assets/star-filled.svg";

import CommonButton from "../../../../components/CommonButton/CommonButton";
import useIsGuest from "../../../../hooks/useIsGuest";
import {isRTL} from "../../../../../utils";

const getOnlineStoreText = (merchantDetails, t) => {
  const isArabic = isRTL();

  const merchantName = isArabic
    ? merchantDetails?.x_arabic_name ||
      merchantDetails?.merchant_name_arabic ||
      merchantDetails.merchant_name
    : merchantDetails.merchant_name;

  const displayName = merchantName || '';

  return isArabic
    ? t('ProductPage.openOnlineStore', { name: displayName }) +
        ` ${t('TabBar.onlineStore')}`
    : `${t('ProductPage.openOnlineStore')} ${displayName} ${t('TabBar.onlineStore')}`;
};

const TabHeader = ({ setIsModalVisible, isModalVisible, merchantDetails, onShare, ribbonText, title, bannerRating }) => {

  const { isDark } = useTheme();
  const isGuest = useIsGuest();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <View
      style={{
        backgroundColor: isDark ? colors.navyBlue : '#fff',
      }}
    >
      <View>
        <Header label={title} />

        <View
          style={styles.bannerSwiper}
        >
          <View>
            <BannerSwiper
              banners={merchantDetails?.banners}
              singleBannerUrl={merchantDetails.map_banner}
              onBannerPress={() => setIsModalVisible(true)}
              isDark={isDark}
              aspectRatio={1.93}
              autoplay={true}
              autoplayTimeout={5}
              loop={true}
              containerPadding={0}
              imageStyle={{ borderRadius: 8 }}
              style={{ borderRadius: 16, overflow: 'hidden' }}
            />
            {!!bannerRating && (
              <View
                style={[
                  styles.ratingBlock,
                  {
                    flexDirection: isArabic ? 'row-reverse' : 'row',
                    left: isArabic ? 14 : undefined,
                    right: isArabic ? undefined : 14,
                  },
                ]}
              >
                <StarFilledSvg color="#FFB800" width={14} height={14} />
                <TypographyText
                  title={`${bannerRating}`}
                  font={BALOO_SEMIBOLD}
                  size={13}
                  style={{ marginHorizontal: 4, fontWeight: '700' }}
                  textColor={colors.white}
                />
              </View>
            )}
          </View>
        </View>
      </View>

      <MerchantCard
        uri={merchantDetails.merchant_logo ?? merchantDetails.org_logo}
        ribbonText={ribbonText}
        merchantName={isArabic ? merchantDetails?.merchant_name_arabic : merchantDetails.merchant_name}
      />

      <View style={styles.actionIcons}>
        <ShareIcon onShare={onShare} />
        {isGuest ? null : <NotificationIcon
          isSubscribe={merchantDetails.is_subscribe}
          merchantId={merchantDetails.merchant_id ?? merchantDetails.partner_id?.[0] ?? merchantDetails.id}
        />}
      </View>

      {merchantDetails.x_online_store && (
        <CommonButton
          label={getOnlineStoreText(merchantDetails, t)}
          onPress={() => Linking.openURL(merchantDetails.website)}
          style={styles.onlineStoreBtn}
          numberOfLines={2}
          textStyle={styles.storeText}
        />
      )}

      <ImageViewerModal
        onClose={() => setIsModalVisible(false)}
        isVisible={isModalVisible}
        merchantDetails={merchantDetails}
      />
    </View>


  )
};

const styles = StyleSheet.create({
  ratingBlock: {
    position: 'absolute',
    top: 12,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 2,
  },
  bannerSwiper: {
    marginTop: 14,
    paddingHorizontal: 20
  },
  onlineStoreBtn: {
    backgroundColor: '#00A3FF',
    borderWidth: 0,
    marginVertical: 15,
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  storeText: {
    color: '#fff',
    textAlign: 'center',
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
    paddingHorizontal: 20
  }
});

export default TabHeader;