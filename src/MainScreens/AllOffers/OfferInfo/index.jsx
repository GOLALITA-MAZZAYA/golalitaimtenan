import Header from "../../../components/Header";
import MainLayout from "../../../components/MainLayout";
import InfoBlocks from "./components/InfoBlocks";
import InfoButtons from "./components/InfoButtons/index";
import OfferInfoSwiper from "./components/OfferInfoSwiper";
import CommonButton from "../../../components/CommonButton/CommonButton";
import OfferTypeInfoButtons from "./components/OfferTypeInfoButtons";
import { colors } from "../../../components/colors";
import {
  getInfoBlocksConfig,
  getInfoBtnsConfig,
  getOfferTypeInfoBtnsConfig,
} from "./config";
import { SCREEN_HEIGHT } from "../../../styles/mainStyles";
import useOffer from "./hooks/useOffer";
import FullScreenImageModal from "./components/FullScreenImageModal";
import { useState, useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import MerchantInfoBlock from "./components/MerchatInfoBlock";
import { isRTL } from "../../../../utils";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { useTheme } from "../../../components/ThemeProvider";
import NoData from "../../Transactions/components/NoData";
import { useTranslation } from "react-i18next";
import { handleMerchantCardPress } from "../../MerchantsPage/helpers";
import { transformDate } from "./helpers";
import { navigateToBookNow } from "../helpres";
import InfoTab from "./components/InfoTab";
import useIsGuest from "../../../hooks/useIsGuest";
import { useDispatch } from "react-redux";
import { track } from "../../../redux/merchant/merchant-thunks";
import { getMerchantById } from "../../../api/merchants";



const OfferInfo = ({ route, navigation }) => {
  const { productId, title, bookNow = "fasle", merchant = {} } = route.params;
  const { offer, loading, error } = useOffer(productId);
  const { isDark } = useTheme();
  const isGuest = useIsGuest();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isArabic = isRTL();

  const handlePromoPress = useCallback(() => {
    try {
      setIsSubmitting(true);
      dispatch(track(
        'promocode',
        offer?.product_id,
        true,
        offer?.offer_type_promo_code,
        async () => {
          try {
            await dispatch(track('promocode', offer?.product_id, false, offer?.offer_type_promo_code));
            let store_website;

            if(offer.online_store){
              const merchant = await getMerchantById(offer.merchant_id);
              console.log(merchant,'merchan')
              store_website = merchant.website;
            }

            navigation.navigate('merchant-code-confirmation', {
                merchantName: isArabic ? offer?.merchant_name_arabic : offer?.merchant_name,
                offerName: isArabic ? offer?.arabic_name: offer.name,
                confirmationNumber: offer?.offer_type_promo_code,
                id: offer?.product_id,
                promocode: offer?.offer_type_promo_code,
                store_website
            });
          } catch (e) {
            console.log(e);
          } finally {
            setIsSubmitting(false);
          }
        },
      ));
    } catch (err) {
      console.log(err, 'error');
      setIsSubmitting(false);
    }
  }, [dispatch, offer, navigation, t, isArabic]);

  const infoBtnsConfig = getInfoBtnsConfig(offer, isDark);
  const infoBlocksConfig = getInfoBlocksConfig(offer, bookNow);
  const offerTypeInfoBtnsConfig = getOfferTypeInfoBtnsConfig(offer, handlePromoPress, isSubmitting);

  const closeModal = () => {
    setSelectedImageUrl(null);
  };

  const handleImagePress = (url) => {
    setSelectedImageUrl(url);
  };
  const handleMerchatDetails = (offer) => {
    handleMerchantCardPress(offer);
  };

  return (
    <>
      <MainLayout
        outsideScroll={true}
        headerChildren={<Header label={title} btns={["back"]} />}
        headerHeight={50}
        contentStyle={{ height: SCREEN_HEIGHT - 120 }}
      >

        {loading && <FullScreenLoader absolutePosition style={styles.loader} />}

        {error && <NoData />}

        {!loading && !error && (
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 30,
              paddingHorizontal: 20,
              backgroundColor: isDark ? '#000' : '#fff',
            }}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <OfferInfoSwiper
              images={[offer.image_url]}
              onImagePress={handleImagePress}
            />
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
            {isGuest ? <View /> : <OfferTypeInfoButtons data={offerTypeInfoBtnsConfig} />}

            <FullScreenImageModal
              visible={!!selectedImageUrl}
              url={selectedImageUrl}
              onClose={closeModal}
            />

            <InfoTab
              onMerchantDetailsPress={() => handleMerchatDetails(offer)}
              onBookNowPress={() => navigateToBookNow(offer, merchant)}
              bookNow={bookNow}
              selectedImageUrl={selectedImageUrl}
              onModalClose={closeModal}
              infoBlocksConfig={infoBlocksConfig}
            />
          </ScrollView>
        )}
      </MainLayout>
    </>
  );
};

const styles = StyleSheet.create({
  loader: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default OfferInfo;
