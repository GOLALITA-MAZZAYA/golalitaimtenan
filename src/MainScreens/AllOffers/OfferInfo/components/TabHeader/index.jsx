import { StyleSheet, View } from "react-native";
import { useTheme } from "../../../../../components/ThemeProvider";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../../components/colors";
import { useState } from "react";
import FullScreenImageModal from "../FullScreenImageModal";
import MerchantInfoBlock from "../MerchatInfoBlock";
import OfferInfoSwiper from "../OfferInfoSwiper";
import { transformDate } from "../../helpers";

const TabHeader = ({ offer }) => {
  const { isDark } = useTheme();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: isDark ? colors.darkBlue : colors.white,
        },
      ]}
    >
      <OfferInfoSwiper
        images={[offer?.image_url]}
        onImagePress={setSelectedImageUrl}
      />

      <MerchantInfoBlock
        merchantName={
          isArabic ? offer?.merchant_name_arabic : offer?.merchant_name
        }
        merchantUrl={offer?.merchant_logo}
        offerLabel={isArabic ? offer?.label_arabic : offer?.offer_label}
        start_date={transformDate(offer?.start_date)}
        end_date={transformDate(offer?.end_date)}
      />

      <FullScreenImageModal
        visible={!!selectedImageUrl}
        url={selectedImageUrl}
        onClose={() => setSelectedImageUrl(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    paddingHorizontal: 20,
  },
});

export default TabHeader;
