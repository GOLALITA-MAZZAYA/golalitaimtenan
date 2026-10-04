import Header from "../../../components/Header";
import MainLayout from "../../../components/MainLayout";
import { OFFER_TAB_CONSTANTS } from "./config";
import { SCREEN_HEIGHT } from "../../../styles/mainStyles";
import useOffer from "./hooks/useOffer";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import trackActivity from "../../../api/activityTracker";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import NoData from "../../Transactions/components/NoData";
import HeaderTabs from "./components/HeaderTabs";
import OffersTab from "./components/OffersTab";
import InfoTab from "./components/InfoTab";
import { Tabs } from "react-native-collapsible-tab-view";
import TabHeader from "./components/TabHeader";
import GalleryTab from "./components/GalleryTab";
import { getCacheBustedUri } from "../../../../utils";
import { getAllOffersByMeerchantId, getOffers } from "../../../api/merchants";
import { getOffersForNestedItemsCard } from "../helpres";
import { useTheme } from "../../../components/ThemeProvider";
import { colors } from "../../../components/colors";

const OfferInfo = ({ route }) => {
  const { productId, title, bookNow = "fasle", merchant = {} } = route.params;
  const { offer, loading, error } = useOffer(productId);
  const { isDark } = useTheme();
  const screenBg = isDark ? colors.darkBlue : colors.white;
  const [activeTab, setActiveTab] = useState(OFFER_TAB_CONSTANTS.INFO);
  const [otherOffers, setOtherOffers] = useState([]);
  const [hasOtherOffers, setHasOtherOffers] = useState(false);
  const [loadingOtherOffers, setLoadingOtherOffers] = useState(false);

  const merchantData =
    merchant && (merchant.id || merchant.merchant_id)
      ? merchant
      : {
          id: offer?.merchant_id,
          merchant_id: offer?.merchant_id,
          name: offer?.merchant_name,
          merchant_name: offer?.merchant_name,
          merchant_name_arabic: offer?.merchant_name_arabic,
          merchant_logo: offer?.merchant_logo,
          merchant_phone: offer?.merchant_phone,
          merchant_email: offer?.merchant_email,
        };

  useEffect(() => {
    setActiveTab(OFFER_TAB_CONSTANTS.INFO);
  }, [productId]);

  useEffect(() => {
    trackActivity("offer_details_visit", {
      offer_id: productId,
      merchant_id:
        merchantData?.id || merchantData?.merchant_id || offer?.merchant_id,
      page_name: "offer_details",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, merchantData?.id, merchantData?.merchant_id]);

  useEffect(() => {
    let isCancelled = false;
    const mId =
      merchantData?.id || merchantData?.merchant_id || offer?.merchant_id;

    if (!mId) {
      setHasOtherOffers(false);
      setOtherOffers([]);
      return;
    }

    setLoadingOtherOffers(true);

    const filterOffers = (items) => {
      if (!Array.isArray(items)) return [];
      return items.filter(
        (item) =>
          String(item.id) !== String(productId) &&
          String(item.id) !== String(offer?.product_id) &&
          String(item.product_id) !== String(productId) &&
          String(item.product_id) !== String(offer?.product_id)
      );
    };

    const fetchOther = async () => {
      try {
        const inline = [
          ...(Array.isArray(merchant?.offer_products)
            ? merchant.offer_products
            : []),
          ...(Array.isArray(merchant?.products) ? merchant.products : []),
        ];
        if (inline.length > 0) {
          const filtered = filterOffers(
            inline.map((item) => ({
              ...item,
              uri: item.image_url || item.uri,
              value: item.list_price ?? item.value,
            }))
          );
          if (!isCancelled) {
            setOtherOffers(filtered);
            setHasOtherOffers(filtered.length > 0);
            setLoadingOtherOffers(false);
          }
          return;
        }

        try {
          const res = await getAllOffersByMeerchantId(mId);
          const filtered = filterOffers(res);
          if (filtered.length > 0) {
            if (!isCancelled) {
              setOtherOffers(filtered);
              setHasOtherOffers(true);
              setLoadingOtherOffers(false);
            }
            return;
          }
        } catch (e) {
          console.log("[OfferInfo] getAllOffersByMeerchantId error:", e);
        }

        try {
          const res2 = await getOffers(mId);
          if (Array.isArray(res2) && res2.length > 0) {
            const mapped = res2.map((item) => ({
              ...item,
              uri: item.image_url || item.uri,
              value: item.list_price ?? item.value,
            }));
            const filtered2 = filterOffers(mapped);
            if (!isCancelled) {
              setOtherOffers(filtered2);
              setHasOtherOffers(filtered2.length > 0);
              setLoadingOtherOffers(false);
            }
            return;
          }
        } catch (e) {
          console.log("[OfferInfo] getOffers error:", e);
        }

        if (merchant?.is_hotel || merchant?.is_business_hotel) {
          try {
            const hotelOffers = await getOffersForNestedItemsCard(
              merchant,
              "all"
            );
            const filtered3 = filterOffers(hotelOffers);
            if (!isCancelled) {
              setOtherOffers(filtered3);
              setHasOtherOffers(filtered3.length > 0);
              setLoadingOtherOffers(false);
            }
            return;
          } catch (e) {
            console.log("[OfferInfo] hotel offers error:", e);
          }
        }

        if (!isCancelled) {
          setOtherOffers([]);
          setHasOtherOffers(false);
          setLoadingOtherOffers(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setOtherOffers([]);
          setHasOtherOffers(false);
          setLoadingOtherOffers(false);
        }
      }
    };

    fetchOther();

    return () => {
      isCancelled = true;
    };
  }, [
    merchant?.id,
    merchant?.merchant_id,
    offer?.merchant_id,
    productId,
    offer?.product_id,
  ]);

  useEffect(() => {
    if (!hasOtherOffers && activeTab === OFFER_TAB_CONSTANTS.OFFERS) {
      setActiveTab(OFFER_TAB_CONSTANTS.INFO);
    }
  }, [hasOtherOffers, activeTab]);

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
            containerStyle={{ backgroundColor: screenBg }}
            headerContainerStyle={{
              backgroundColor: screenBg,
              shadowOpacity: 0,
              elevation: 0,
            }}
            renderHeader={() => <TabHeader offer={offer} />}
            renderTabBar={() => (
              <HeaderTabs
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                hasOtherOffers={hasOtherOffers}
              />
            )}
          >
            <Tabs.Tab name="oneTab">
              <Tabs.ScrollView
                style={{ backgroundColor: screenBg }}
                contentContainerStyle={{
                  paddingBottom: 60,
                  paddingHorizontal: 20,
                  backgroundColor: screenBg,
                }}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <>
                  {activeTab === OFFER_TAB_CONSTANTS.INFO && (
                    <InfoTab
                      isHotel={bookNow}
                      offer={offer}
                      merchant={merchantData}
                    />
                  )}

                  {activeTab === OFFER_TAB_CONSTANTS.OFFERS &&
                    hasOtherOffers && (
                      <OffersTab
                        offers={otherOffers}
                        loading={loadingOtherOffers}
                        merchantId={
                          merchantData?.id ||
                          merchantData?.merchant_id ||
                          offer?.merchant_id
                        }
                        merchant={merchantData}
                        offerId={productId || offer?.product_id}
                        offer={offer}
                      />
                    )}

                  {activeTab === OFFER_TAB_CONSTANTS.GALLERY && (
                    <GalleryTab
                      images={[getCacheBustedUri(offer.image_url)]}
                    />
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
  loader: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default OfferInfo;
