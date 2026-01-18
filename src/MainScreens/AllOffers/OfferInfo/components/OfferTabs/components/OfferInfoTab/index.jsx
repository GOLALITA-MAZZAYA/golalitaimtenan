import { useTranslation } from "react-i18next";
import CommonButton from "../../../../../../../components/CommonButton/CommonButton";
import { handleMerchantCardPress } from "../../../../../../MerchantsPage/helpers";
import { navigateToBookNow } from "../../../../../helpres";
import { transformDate } from "../../../../helpers";
import InfoBlocks from "../../../InfoBlocks";
import InfoButtons from "../../../InfoButtons";
import MerchantInfoBlock from "../../../MerchatInfoBlock";
import OfferTypeInfoButtons from "../../../OfferTypeInfoButtons";
import { StyleSheet } from "react-native";
import { colors } from "../../../../../../../components/colors";
import { useTheme } from "../../../../../../../components/ThemeProvider";
import {
  getInfoBlocksConfig,
  getInfoBtnsConfig,
  getOfferTypeInfoBtnsConfig,
} from "../../../../config";

const OfferInfoTab = ({ offer, bookNow, merchant }) => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const isArabic = i18n.language === "ar";

  const infoBtnsConfig = getInfoBtnsConfig(offer, isDark);
  const infoBlocksConfig = getInfoBlocksConfig(offer, bookNow);
  const offerTypeInfoBtnsConfig = getOfferTypeInfoBtnsConfig(offer);

  return (
    <>
      <MerchantInfoBlock
        merchantName={
          isArabic ? offer.merchant_name_arabic : offer.merchant_name
        }
        merchantUrl={offer.merchant_logo}
        offerLabel={isArabic ? offer.label_arabic : offer.offer_label}
        start_date={transformDate(offer?.start_date)}
        end_date={transformDate(offer?.end_date)}
      />
      <InfoButtons data={infoBtnsConfig} />
      <OfferTypeInfoButtons data={offerTypeInfoBtnsConfig} />
      <InfoBlocks data={infoBlocksConfig} />

      <CommonButton
        onPress={() => handleMerchantCardPress(offer)}
        label={t("ProductPage.merchantDetails")}
        textColor={isDark ? colors.mainDarkModeText : colors.white}
        style={styles.merchantBtn}
      />

      {bookNow === "true" && (
        <CommonButton
          onPress={() => navigateToBookNow(offer, merchant)}
          label={t("Merchants.bookNow")}
          textColor={isDark ? colors.mainDarkModeText : colors.white}
          style={styles.merchantBtn}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  loader: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  merchantBtn: {
    marginTop: 20,
  },
});

export default OfferInfoTab;
