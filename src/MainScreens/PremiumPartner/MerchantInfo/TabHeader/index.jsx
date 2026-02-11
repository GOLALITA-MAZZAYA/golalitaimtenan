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

import CommonButton from "../../../../components/CommonButton/CommonButton";

const getOnlineStoreText = (merchantDetails, t) => {
  const merchantName = merchantDetails?.merchant_name || '';
  const displayName =
    merchantName.length > 15
      ? `${merchantName.slice(0, 15)}...`
      : merchantName;
  return `${t('ProductPage.openOnlineStore')} ${displayName} ${t(
    'TabBar.onlineStore',
  )}`;
};

const TabHeader = ({ setIsModalVisible, isModalVisible, merchantDetails, onShare, ribbonText, title }) => {

  const { isDark } = useTheme();
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
          <BannerSwiper
            banners={merchantDetails?.banners}
            singleBannerUrl={merchantDetails.map_banner}
            onBannerPress={() => setIsModalVisible(true)}
            isDark={isDark}
            aspectRatio={23 / 10}
            autoplay={true}
            autoplayTimeout={3}
            loop={true}
          />
        </View>
      </View>

      <MerchantCard
        uri={merchantDetails.merchant_logo ?? merchantDetails.org_logo}
        ribbonText={ribbonText}
        merchantName={isArabic ? merchantDetails?.merchant_name_arabic : merchantDetails.merchant_name}
      />

      <View style={styles.actionIcons}>
        <ShareIcon onShare={onShare} />
        <NotificationIcon
          isSubscribe={merchantDetails.is_subscribe}
          merchantId={merchantDetails.merchant_id ?? merchantDetails.partner_id?.[0] ?? merchantDetails.id}
        />
      </View>

      {merchantDetails.x_online_store && (
        <CommonButton
          label={getOnlineStoreText(merchantDetails, t)}
          onPress={() => Linking.openURL(merchantDetails.website)}
          style={styles.onlineStoreBtn}
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
    paddingHorizontal: 20
  },
  storeText: {
    color: '#fff'
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
    paddingHorizontal: 20
  }
});

export default TabHeader;