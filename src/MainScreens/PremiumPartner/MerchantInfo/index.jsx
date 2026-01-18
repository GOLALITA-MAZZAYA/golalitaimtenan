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
import { useTranslation } from 'react-i18next';
import { Tabs } from 'react-native-collapsible-tab-view';
import ViewShot from 'react-native-view-shot';
import { getContracts } from '../../../api/merchants';
import InfoTab from './InfoTab';
import MapTab from './MapTab';
import OfferTab from './OffersTab';
import RoomRatesTab from './RoomRatesTab';
import TabHeader from './TabHeader';
import Share from 'react-native-share';
import {setMerchantDetails} from '../../../redux/merchant/merchant-actions';
import HeaderTabs from './TabHeader/HeaderTabs';

export const CONSTANTS = {
  INFO: 'INFO',
  LOCATION: 'LOCATION',
  OFFERS: 'OFFERS',
  ROOM_RATES: "ROOM_RATES"
};


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

  useEffect(() => {
    return () => {
      setMerchantDetails(null);
    };
  }, []);

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
    <ViewShot ref={viewRef} style={styles.shot}>
      <View
        style={{ flex: 1}}
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
            />
          )}
          renderTabBar={() => <HeaderTabs setActiveTab={setActiveTab} activeTab={activeTab} isBusinessHotel={isHotel}/>}
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
                {activeTab === CONSTANTS.OFFERS && !isHotel && (
                  <OfferTab
                    merchant={merchantDetails}
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
