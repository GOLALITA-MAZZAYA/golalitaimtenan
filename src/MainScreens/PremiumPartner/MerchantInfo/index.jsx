import React, {useEffect,
  useRef,
  useState,
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { colors } from '../../../components/colors';
import FullScreenLoader from '../../../components/Loaders/FullScreenLoader';
import { useTheme } from '../../../components/ThemeProvider';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'react-native-collapsible-tab-view';
import ViewShot from 'react-native-view-shot';
import { getContracts, getAllOffersByMeerchantId } from '../../../api/merchants';
import useMerchantFeedbackSummary from '../../../hooks/useMerchantFeedbackSummary';
import InfoTab from './InfoTab';
import MapTab from './MapTab';
import OfferTab from './OffersTab';
import RoomRatesTab from './RoomRatesTab';
import TabHeader from './TabHeader';
import Share from 'react-native-share';
import { setMerchantDetails } from '../../../redux/merchant/merchant-actions';
import HeaderTabs from './TabHeader/HeaderTabs';
import store from '../../../redux/store';

export const CONSTANTS = {
  INFO: 'INFO',
  LOCATION: 'LOCATION',
  OFFERS: 'OFFERS',
  ROOM_RATES: "ROOM_RATES"
};

const getMerchantId = merchant =>
  merchant?.id ?? merchant?.merchant_id ?? merchant?.partner_id?.[0] ?? null;

const MerchantInfo = ({
  route,
  merchantDetails,
  title,
  loading,
  setMerchantDetails
}) => {
  const [isFullImage, setIsFullImage] = useState(false);
  const [activeTab, setActiveTab] = useState(CONSTANTS.INFO);
  const { i18n, t } = useTranslation();
  const { isDark } = useTheme();
  const viewRef = useRef();
  const params = route?.params;

  const merchantId = getMerchantId(merchantDetails);
  const { summary, status: summaryStatus } =
    useMerchantFeedbackSummary(merchantId);
  const feedbackCount = Number(summary?.total_feedback_count) || 0;
  const bannerRating =
    summaryStatus === 'error'
      ? merchantDetails?.rating
      : feedbackCount > 0
        ? (Number(summary.average_rating) || 0).toFixed(1)
        : null;

  const initialInlineOffers = [
    ...(Array.isArray(merchantDetails?.offer_products)
      ? merchantDetails.offer_products
      : []),
    ...(Array.isArray(merchantDetails?.products)
      ? merchantDetails.products
      : []),
  ];

  const initialOfferCount = Number(
    merchantDetails?.offer_count ??
      merchantDetails?.offers_count ??
      params?.offer_count ??
      initialInlineOffers.length ??
      0,
  );

  const [merchantOffers, setMerchantOffers] = useState(
    initialInlineOffers.map(item => ({
      ...item,
      uri: item.image_url || item.uri,
      value: item.list_price ?? item.value,
    })),
  );
  const [hasOffers, setHasOffers] = useState(
    Boolean(
      initialInlineOffers.length > 0 ||
        initialOfferCount > 0 ||
        merchantDetails?.x_have_offers,
    ),
  );

  useEffect(() => {
    let isCancelled = false;
    const mId = merchantDetails?.merchant_id || merchantDetails?.id;
    const isHotelMerchant =
      merchantDetails?.is_hotel;

    if (!mId || isHotelMerchant) {
      return;
    }

    const inline = [
      ...(Array.isArray(merchantDetails?.offer_products)
        ? merchantDetails.offer_products
        : []),
      ...(Array.isArray(merchantDetails?.products)
        ? merchantDetails.products
        : []),
    ];

    if (inline.length > 0) {
      setMerchantOffers(
        inline.map(item => ({
          ...item,
          uri: item.image_url || item.uri,
          value: item.list_price ?? item.value,
        })),
      );
      setHasOffers(true);
      return;
    }

    getAllOffersByMeerchantId(mId)
      .then(res => {
        if (isCancelled) return;
        const list = Array.isArray(res) ? res : [];
        if (list.length > 0) {
          setMerchantOffers(list);
          setHasOffers(true);
        } else {
          setHasOffers(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setHasOffers(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [merchantDetails?.merchant_id, merchantDetails?.id]);
  const mountedMerchantIdRef = useRef(getMerchantId(merchantDetails));

  useEffect(() => {
    const id = getMerchantId(merchantDetails);
    if (id != null) {
      mountedMerchantIdRef.current = id;
    }
  }, [merchantDetails]);

  // Clear shared Redux details only when this screen's merchant is still the
  // one in the store. Avoid wiping a newly loaded merchant when push/replace
  // remounts MerchantInfo (Home → reopen, notification while merchant open).
  useEffect(() => {
    return () => {
      const state = store.getState().merchantReducer;
      if (state.merchantDetailsLoading) {
        return;
      }

      const currentId = getMerchantId(state.merchantDetails);
      const mountedId = mountedMerchantIdRef.current;

      if (currentId == null || currentId === mountedId) {
        setMerchantDetails(null);
      }
    };
  }, [setMerchantDetails]);

  useEffect(() => {
    getContracts();
  }, []);

  const handleSharePress = async () => {
    try {
      const url = await viewRef.current.capture({
        result: 'tmpfile',
        height: 400,
        width: 335,
        quality: 1,
        format: 'png',
      });

      await Share.open({ url });
    } catch (error) {
      console.log(error);
    }
  };



  if (loading || !merchantDetails) return <FullScreenLoader />;

  const isHotel = merchantDetails.is_hotel;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? colors.darkBlue : colors.white,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ViewShot ref={viewRef} style={[styles.shot, { backgroundColor: isDark ? colors.darkBlue : colors.white }]}>
          <View
            style={{ flex: 1, backgroundColor: isDark ? colors.darkBlue : colors.white }}
          >
            <Tabs.Container
              renderHeader={() => (
                <TabHeader
                  setIsModalVisible={setIsFullImage}
                  isModalVisible={isFullImage}
                  merchantDetails={merchantDetails}
                  onShare={handleSharePress}
                  ribbonText={i18n.language === 'ar'
                    ? merchantDetails?.ribbon_text?.x_ribbon_text_arabic
                    : merchantDetails?.ribbon_text?.ribbon_text}
                  title={title
                    ? title
                    : params?.isOrganization
                      ? t('PremiumPartner.organization')
                      : merchantDetails?.category}
                  bannerRating={bannerRating}
                />
              )}
              renderTabBar={() => <HeaderTabs setActiveTab={setActiveTab} activeTab={activeTab} isBusinessHotel={isHotel} hasOffers={hasOffers && !isHotel} />}
            >
              <Tabs.Tab name="a">
                <Tabs.ScrollView
                  contentContainerStyle={{
                    paddingBottom: 30,
                    paddingHorizontal: 20
                  }}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  <>
                    {activeTab === CONSTANTS.INFO && (
                      <InfoTab merchantDetails={merchantDetails} />
                    )}
                    {activeTab === CONSTANTS.LOCATION && (
                      <MapTab merchantDetails={merchantDetails} />
                    )}
                    {activeTab === CONSTANTS.OFFERS && !isHotel && hasOffers && (
                      <OfferTab
                        merchant={merchantDetails}
                        initialOffers={merchantOffers}
                        isHotel={isHotel}
                      />
                    )}
                    {activeTab === CONSTANTS.ROOM_RATES && isHotel && (
                      <RoomRatesTab
                        merchant={merchantDetails}
                      />
                    )}
                  </>
                </Tabs.ScrollView>
              </Tabs.Tab>
            </Tabs.Container>
          </View>
        </ViewShot>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  shot: {
    flex: 1
  }

});

const mapStateToProps = state => ({
  merchantDetails: state.merchantReducer.merchantDetails,
  favoriteOffers: state.merchantReducer.favoriteOffers,
  loading: state.merchantReducer.merchantDetailsLoading,
});

export default connect(mapStateToProps, { setMerchantDetails })(
  React.memo(MerchantInfo),
);
