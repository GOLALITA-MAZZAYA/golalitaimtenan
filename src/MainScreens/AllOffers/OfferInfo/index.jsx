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
  OFFER_TAB_CONSTANTS,
} from "./config";
import { SCREEN_HEIGHT } from "../../../styles/mainStyles";
import useOffer from "./hooks/useOffer";
import FullScreenImageModal from "./components/FullScreenImageModal";
import { useState } from "react";
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
import HeaderTabs from "./components/HeaderTabs";
import OffersTab from "./components/OffersTab";
import InfoTab from "./components/InfoTab";
import {Tabs} from "react-native-collapsible-tab-view";



const OfferInfo = ({ route }) => {
  const { productId, title, bookNow = "fasle", merchant = {} } = route.params;
  const { offer, loading, error } = useOffer(productId);
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState(OFFER_TAB_CONSTANTS.OFFERS);

  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  const infoBtnsConfig = getInfoBtnsConfig(offer, isDark);
  const infoBlocksConfig = getInfoBlocksConfig(offer, bookNow);
  const offerTypeInfoBtnsConfig = getOfferTypeInfoBtnsConfig(offer);
  const isArabic = isRTL();

  const closeModal = () => {
    setSelectedImageUrl(null);
  };

  const handleImagePress = (url) => {
    setSelectedImageUrl(url);
  };
  const handleMerchatDetails = (offer) => {
    handleMerchantCardPress(offer);
  };

  console.log(offer,'sdda')

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
       <Tabs.Container
          
          renderHeader={() => (
             <View style={{paddingHorizontal: 20}}>
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
            <OfferTypeInfoButtons data={offerTypeInfoBtnsConfig} />

            <FullScreenImageModal
              visible={!!selectedImageUrl}
              url={selectedImageUrl}
              onClose={closeModal}
            />
             </View>
          )}
          renderTabBar={() => <HeaderTabs setActiveTab={setActiveTab} activeTab={activeTab} />}
        >
          <Tabs.Tab name="oneTab">
            <Tabs.ScrollView
              contentContainerStyle={{
                paddingBottom: 30,
                paddingHorizontal: 20
              }}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <>
                {activeTab === OFFER_TAB_CONSTANTS.OFFERS && (
                  <OffersTab 
                    merchantId={offer.merchant_id}
                    type={offer.offer_type}
                    offerId={offer.product_id}
                  />
                )}
                {activeTab === OFFER_TAB_CONSTANTS.INFO && (
                  <InfoTab 
                    onMerchantDetailsPress={() => handleMerchatDetails(offer)}
                    onBookNowPress={() => navigateToBookNow(offer, merchant)}
                    bookNow={bookNow}
                    selectedImageUrl={selectedImageUrl}
                    onModalClose={closeModal}
                    infoBlocksConfig={infoBlocksConfig} />
                )}
  
              </>
            </Tabs.ScrollView>
          </Tabs.Tab>
        </Tabs.Container>
        )}
     </MainLayout>
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

export default OfferInfo;
