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
import { Tabs } from 'react-native-collapsible-tab-view';
import ViewShot from 'react-native-view-shot';
import InfoTab from './InfoTab';
import useRestaurantDetails from '../hooks/useRestaurantDetails';
import FullScreenLoader from '../../../../components/Loaders/FullScreenLoader';
import GalleryTab from '../../../PremiumPartner/MerchantInfo/GalleryTab';
import {useTheme} from '../../../../components/ThemeProvider';
import {colors} from '../../../../components/colors';
import MenuTab from './MenuTab';
import HeaderTabs from './HeaderTabs';
import TabHeader from './TabHeader';
import {isRTL} from '../../../../../utils';
import OrderTab from './OrderTab';

export const CONSTANTS = {
  INFO: 'INFO',
  GALLERY: "GALLERY",
  RESTAURANT_MENU: "RESTAURANT_MENU",
  ORDER_TAB: 'ORDER_TAB'
};


const RestaurantInfo = ({
  route
}) => {
  const restaurantId = route.params?.restaurantId;
  const merchantId = route.params?.merchant_id;
  const {data, loading} = useRestaurantDetails(restaurantId);
  const [activeTab, setActiveTab] = useState(CONSTANTS.INFO);
  const { isDark } = useTheme();
  const viewRef = useRef();
  const isRtl = isRTL();

  console.log(data,'restaurant details');

  if (loading || !data) return <FullScreenLoader />;

  

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
        style={{ flex: 1 }}
      >
        <Tabs.Container
          renderHeader={() => (
            <TabHeader
               title={data?.category}
               banners={[{banner_image: data?.visuals?.merchant_banner_url}]}
               name={isRtl ? data.name_ar: data.name}
               rating={data?.stats?.avg_rating}
            />
          )}
          renderTabBar={() => <HeaderTabs setActiveTab={setActiveTab} activeTab={activeTab}  />}
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
                  <InfoTab restaurantData={data} />
                )}
                {activeTab === CONSTANTS.GALLERY && (
                  <GalleryTab images={[data?.visuals?.merchant_banner_url || '']} />
                )}

                {/* {activeTab === CONSTANTS.RESTAURANT_MENU && (
                  <MenuTab restaurantId={restaurantId} />
                )} */}

                {activeTab === CONSTANTS.ORDER_TAB && (
                  <OrderTab restaurantId={restaurantId} restaurantData={data}/>
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

export default RestaurantInfo

