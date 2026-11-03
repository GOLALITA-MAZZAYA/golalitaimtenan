import { StyleSheet, TouchableOpacity, View } from "react-native";
import Image from "../../../../../components/AppImage";
import { useTheme } from "../../../../../components/ThemeProvider";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../../components/colors";
import { SCREEN_WIDTH } from "../../../../../styles/mainStyles";
import { useState } from "react";
import ImageViewerModal from "../../../../PremiumPartner/MerchantInfo/TabHeader/ImageViewerModal";
import MerchantCard from "../../../../PremiumPartner/MerchantInfo/TabHeader/MerchantCard";
import { getCacheBustedUri } from "../../../../../../utils";

const BANNER_ASPECT_RATIO = 23 / 10;
const BANNER_WIDTH = SCREEN_WIDTH - 40;
const BANNER_HEIGHT = BANNER_WIDTH / BANNER_ASPECT_RATIO;

const TabHeader = ({ offer }) => {

  const { isDark } = useTheme();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogoPress = () => {
    setIsModalVisible(true)
  };

  const bustedImageUrl = getCacheBustedUri(offer.image_url);

  const imageViewerData = [{
    url: bustedImageUrl,
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
  }];

  return (
    <View
      style={{
        backgroundColor: isDark ? colors.navyBlue : '#fff',
        width: '100%',
      }}
    >

      <TouchableOpacity
        style={[
          styles.merchantLogoBlock,
          {
            backgroundColor: colors.loyaltyCardBackground,
            borderColor: colors.mainBorder
          }
        ]}
        onPress={handleLogoPress}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: bustedImageUrl }}
          style={styles.merchantLogo}
          contentFit="cover"
        />
      </TouchableOpacity>

      <MerchantCard
        uri={offer.merchant_logo}
        ribbonText={isArabic ? offer.label_arabic : offer.offer_label}
        merchantName={
          isArabic
            ? offer.merchant_name_arabic
            : offer.merchant_name
        }
      />

      <ImageViewerModal
        onClose={() => setIsModalVisible(false)}
        isVisible={isModalVisible}
        data={imageViewerData}
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
    marginTop: 25,
    paddingHorizontal: 20
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
    aspectRatio: BANNER_ASPECT_RATIO,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    aspectRatio: 16 / 9
  },

  merchantLogoBlock: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 10,
    marginHorizontal: 20
  },

  ratingBlock: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    position: 'absolute',
    top: 28,
    borderWidth: 1,
    gap: 6
  },

  ratingText: {
    fontWeight: '700'
  }
});

export default TabHeader;