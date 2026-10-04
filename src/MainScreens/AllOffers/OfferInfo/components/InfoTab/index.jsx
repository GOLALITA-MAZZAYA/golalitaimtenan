import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  getInfoBlocksConfig,
  getInfoBtnsConfig,
  getOfferTypeInfoBtnsConfig,
} from "../../config";
import InfoBlocks from "../InfoBlocks";
import InfoButtons from "../InfoButtons";
import OfferTypeInfoButtons from "../OfferTypeInfoButtons";
import CommonButton from "../../../../../components/CommonButton/CommonButton";
import { colors } from "../../../../../components/colors";
import { useTheme } from "../../../../../components/ThemeProvider";
import { handleMerchantCardPress } from "../../../../MerchantsPage/helpers";
import { navigateToBookNow } from "../../../helpres";
import { track } from "../../../../../redux/merchant/merchant-thunks";
import { getMerchantById } from "../../../../../api/merchants";
import { isRTL } from "../../../../../../utils";
import useIsGuest from "../../../../../hooks/useIsGuest";

const InfoTab = ({ offer, merchant, isHotel }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isGuest = useIsGuest();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isArabic = isRTL();

  const handlePromoPress = useCallback(() => {
    try {
      setIsSubmitting(true);
      dispatch(
        track(
          "promocode",
          offer?.product_id,
          true,
          offer?.offer_type_promo_code,
          async () => {
            try {
              await dispatch(
                track(
                  "promocode",
                  offer?.product_id,
                  false,
                  offer?.offer_type_promo_code
                )
              );

              let store_website;
              if (offer.online_store) {
                const merchantData = await getMerchantById(offer.merchant_id);
                store_website = merchantData?.website;
              }

              navigation.navigate("merchant-code-confirmation", {
                merchantName: isArabic
                  ? offer?.merchant_name_arabic
                  : offer?.merchant_name,
                offerName: isArabic ? offer?.arabic_name : offer.name,
                confirmationNumber: offer?.offer_type_promo_code,
                id: offer?.product_id,
                promocode: offer?.offer_type_promo_code,
                store_website,
                merchant_id: offer?.merchant_id,
                x_is_support_qr_promo: offer?.x_is_support_qr_promo,
                qr_code_image_link: offer?.qr_code_image_link,
                promo_code_description: offer?.promo_code_description,
              });
            } catch (e) {
              console.log(e);
            } finally {
              setIsSubmitting(false);
            }
          }
        )
      );
    } catch (err) {
      console.log(err, "error");
      setIsSubmitting(false);
    }
  }, [dispatch, offer, navigation, isArabic]);

  const infoBtnsConfig = getInfoBtnsConfig(offer, isDark);
  const infoBlocksConfig = getInfoBlocksConfig(offer, isHotel);
  const offerTypeInfoBtnsConfig = getOfferTypeInfoBtnsConfig(
    offer,
    handlePromoPress,
    isSubmitting
  );

  return (
    <>
      <InfoButtons data={infoBtnsConfig} />
      {isGuest ? <View /> : <OfferTypeInfoButtons data={offerTypeInfoBtnsConfig} />}
      <InfoBlocks data={infoBlocksConfig} />

      <CommonButton
        onPress={() => handleMerchantCardPress(merchant, offer)}
        label={t("ProductPage.merchantDetails")}
        textColor={isDark ? colors.mainDarkModeText : colors.white}
        style={styles.btn}
      />

      {isHotel === "true" && (
        <CommonButton
          onPress={() => navigateToBookNow(offer, merchant)}
          label={t("Merchants.requestReservation")}
          textColor={isDark ? colors.mainDarkModeText : colors.white}
          style={styles.btn}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  btn: {
    marginTop: 20,
  },
});

export default InfoTab;
