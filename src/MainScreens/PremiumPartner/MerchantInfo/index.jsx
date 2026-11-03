import React, {
  useEffect,
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
import { Tabs } from 'react-native-collapsible-tab-view';
import ViewShot from 'react-native-view-shot';
import InfoTab from './InfoTab';
import RoomRatesTab from './RoomRatesTab';
import OfferTab from './OfferTab';
import TabHeader from './TabHeader';
import Share from 'react-native-share';
import HeaderTabs from './TabHeader/HeaderTabs';
import { isRTL } from '../../../../utils';
import { getAllOffersByMeerchantId } from '../../../api/merchants';

export const CONSTANTS = {
  INFO: 'INFO',
  LOCATION: 'LOCATION',
  OFFERS: 'OFFERS',
  ROOM_RATES: "ROOM_RATES",
};


const MerchantInfo = ({
  merchantDetails,
  title,
  loading,
  route
}) => {
  const isHotel = merchantDetails?.is_hotel;

  const [activeTab, setActiveTab] = useState(
    route.params?.initialTab || (isHotel ? CONSTANTS.ROOM_RATES : CONSTANTS.INFO)
  );
  const { isDark } = useTheme();
  const viewRef = useRef();
  const isArabic = isRTL();
  const restaurantId = route.params?.restaurantId;

  const initialInlineOffers = [
    ...(Array.isArray(merchantDetails?.offer_products) ? merchantDetails.offer_products : []),
    ...(Array.isArray(merchantDetails?.products) ? merchantDetails.products : []),
  ];

  const initialOfferCount = Number(
    merchantDetails?.offer_count ??
    merchantDetails?.offers_count ??
    route.params?.offer_count ??
    initialInlineOffers.length ??
    0
  );

  // Offers list is sourced only from /user/offers/v3
  const [offers, setOffers] = useState([]);
  const [hasOffers, setHasOffers] = useState(
    Boolean(
      initialInlineOffers.length > 0 ||
      initialOfferCount > 0 ||
      merchantDetails?.x_have_offers
    )
  );

  useEffect(() => {
    let isCancelled = false;
    const mId = merchantDetails?.merchant_id || merchantDetails?.id;

    if (!mId || isHotel) {
      return;
    }

    getAllOffersByMeerchantId(mId)
      .then((res) => {
        if (!isCancelled) {
          const list = Array.isArray(res) ? res : [];
          setOffers(list);
          setHasOffers(list.length > 0);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setOffers([]);
          setHasOffers(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [merchantDetails?.merchant_id, merchantDetails?.id, isHotel]);

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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? colors.darkModeBackground : colors.white,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ViewShot ref={viewRef} style={styles.shot}>
          <View style={{ flex: 1 }}>
            <Tabs.Container
              renderHeader={() => (
                <TabHeader
                  merchantDetails={merchantDetails}
                  onShare={handleSharePress}
                  ribbonText={
                    isArabic
                      ? merchantDetails?.ribbon_text?.x_ribbon_text_arabic
                      : merchantDetails?.ribbon_text?.ribbon_text
                  }
                  title={title || merchantDetails?.category}
                />
              )}
              renderTabBar={() => (
                <HeaderTabs
                  setActiveTab={setActiveTab}
                  activeTab={activeTab}
                  isBusinessHotel={isHotel}
                  hasOffers={hasOffers}
                />
              )}
            >
              <Tabs.Tab name="a">
                <Tabs.ScrollView
                  contentContainerStyle={{
                    paddingBottom: 30,
                    paddingHorizontal: 20,
                  }}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  <>
                    {activeTab === CONSTANTS.ROOM_RATES && isHotel && (
                      <RoomRatesTab merchant={merchantDetails} />
                    )}
                    {activeTab === CONSTANTS.INFO && (
                      <InfoTab merchantDetails={merchantDetails} />
                    )}
                    {activeTab === CONSTANTS.OFFERS && hasOffers && (
                      <OfferTab
                        merchant={merchantDetails}
                        initialOffers={offers}
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
  loading: state.merchantReducer.merchantDetailsLoading,
});

export default connect(mapStateToProps)(
  React.memo(MerchantInfo),
);
