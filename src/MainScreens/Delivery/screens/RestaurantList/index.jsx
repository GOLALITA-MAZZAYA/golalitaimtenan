import React, { useMemo } from "react";
import { connect } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getBackGroundColor } from "../../../../styles/colors";
import { SearchFiledWithProfilePhoto } from "../_shared/componenets/SearchFiledWithProfilePhoto";
import TakeawayInformation from "./components/TakeawayInformation";
import { SizedBox } from "../_shared/componenets/SizedBox";
import DeliveryFilters from "./components/DeliveryFilters";
import BottomSheet from "../BottommSheet/BottomSheet";
import DeliveryTabs from "./components/DeliveryTabs";
import { CONSTANTS } from "./components/DeliveryTabs/config";
import ViewChanger from "./components/ViewChanger";
import { VIEW_CONSTANTS } from "./components/ViewChanger/config";
import { getRestaurants } from "../../../../redux/delivery/delivery-thunks";
import { setActiveTab } from "../../../../redux/cart/cart-actions";
import { default as RestaurantListComponent } from "./components/RestaurantList";
import { addDistanceToRestaurants } from "./helpers";
import RestaurantFilters from "./components/RestaurantFilters";
import useUserLocation, {
  LOCATION_STATUSES,
} from "../../../../hooks/useUserLocation";
import { useTheme } from "../../../../components/ThemeProvider";
import { colors } from "../../../../components/colors";
import OrderHistory from "./components/OrderHistory";

function RestaurantList({
  getRestaurants,
  restaurants,
  restaurantsLoading,
  activeTab,
  setActiveTab,
}) {
  const filterRef = useRef(null);
  const [viewType, setViewType] = useState(VIEW_CONSTANTS.LIST);
  const [searchText, setSearchText] = useState("");
  const { isDark } = useTheme();
  const {
    location: userLocation,
    status: locationStatus,
    requestLocation,
  } = useUserLocation();

  useEffect(() => {
    let transformFunc;

    if (
      locationStatus === LOCATION_STATUSES.REJECTED ||
      locationStatus === LOCATION_STATUSES.GRANTED
    ) {
      transformFunc = (restaurants) =>
        addDistanceToRestaurants(restaurants, userLocation);
    }

    getRestaurants(undefined, transformFunc);
  }, [locationStatus]);

  useEffect(() => {
    onPressFilter(true);
  }, []);

  const onPressFilter = useCallback((isOpen) => {
    if (!isOpen) {
      filterRef?.current?.scrollTo(0);
    } else {
      filterRef?.current?.scrollTo(-200);
    }
  }, []);

  const handleFiltersChange = (categories) => {
    let transformFunc;

    if (
      locationStatus === LOCATION_STATUSES.REJECTED ||
      locationStatus === LOCATION_STATUSES.GRANTED
    ) {
      transformFunc = (restaurants) =>
        addDistanceToRestaurants(restaurants, userLocation);
    }

    getRestaurants(categories, transformFunc);

    onPressFilter(false);
  };

  const transformedData = useMemo(() => {
    if (!restaurants) {
      return [];
    }

    let dataWithSearch = restaurants.filter((item) =>
      item.merchant_name.includes(searchText)
    );

    if (activeTab === CONSTANTS.DELIVERY) {
      dataWithSearch = dataWithSearch.filter((item) => item.accept_delivery);
    }

    if (activeTab === CONSTANTS.TAKEWAY && userLocation) {
      dataWithSearch = dataWithSearch.sort((a, b) => +a.distance - +b.distance);
    }

    return dataWithSearch;
  }, [searchText, activeTab, restaurants]);

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor: isDark ? colors.darkBlue : colors.white,
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          marginTop: 20,
        }}
      >
        <StatusBar
          backgroundColor={getBackGroundColor()}
          barStyle={"light-content"}
        />

        <SearchFiledWithProfilePhoto
          style={{ paddingHorizontal: 20, marginTop: 16 }}
          onChangeText={setSearchText}
          isDark={isDark}
        />
        <DeliveryTabs
          value={activeTab}
          onChange={setActiveTab}
          isDark={isDark}
        />

        <SizedBox size={16} />

        <TakeawayInformation
          userLocation={userLocation}
          requestLocation={requestLocation}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <DeliveryFilters onOpen={() => onPressFilter(true)} isDark={isDark} />
          <ViewChanger
            value={viewType}
            onChange={setViewType}
            isDark={isDark}
          />
        </View>

        {viewType === VIEW_CONSTANTS.LIST && <OrderHistory />}

        <RestaurantListComponent
          userLocation={userLocation}
          viewType={viewType}
          restaurants={transformedData}
          restaurantsLoading={restaurantsLoading}
          activeTab={activeTab}
        />

        <BottomSheet
          ref={filterRef}
          backgroundColor={isDark ? colors.darkBlue : colors.white}
        >
          <RestaurantFilters
            onClose={() => onPressFilter(false)}
            onChange={handleFiltersChange}
            isDark={isDark}
          />
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
const mapStateToProps = () => (state) => ({
  restaurants: state.restaurantReducer.restaurants,
  restaurantsLoading: state.restaurantReducer.restaurantsLoading,
  deliveryLocation: state.restaurantReducer.deliveryLocation,
  activeTab: state.cartReducer.activeTab,
});
export default connect(mapStateToProps, {
  getRestaurants,
  setActiveTab,
})(RestaurantList);
