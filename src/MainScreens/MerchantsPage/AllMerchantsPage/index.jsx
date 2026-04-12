import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { ActivityIndicator, StyleSheet, View, FlatList } from "react-native";

import { colors } from "../../../components/colors";
import { mainStyles, SCREEN_HEIGHT } from "../../../styles/mainStyles";
import { connect } from "react-redux";
import {
  getMerchantList,
  toggleFavourites,
} from "../../../redux/merchant/merchant-thunks";
import { useTranslation } from "react-i18next";
import { setMerchants } from "../../../redux/merchant/merchant-actions";
import MainLayout from "../../../components/MainLayout";
import { useTheme } from "../../../components/ThemeProvider";
import Header from "../../../components/Header";
import { getFavouriteMerchantsList } from "../../../redux/favouriteMerchants/favourite-merchants-thunks";
import { navigationRef } from "../../../Navigation/RootNavigation";
import MerchantsList from "../components/MerchantList";
import ListNoData from "../../../components/ListNoData";
import { getUserLocationThunk } from "../../../redux/global/global-thunks";
import HotelsListCard from "./HotelsListCard";
import { isRTL } from "../../../../utils";
import { handleMerchantCardPress } from "../helpers";
import { getHeaderBtnString } from "./helpers";

const ITEM_HEIGHT = 200;

const MerchantsPage = ({
  route,
  merchants,
  isMerchantsLoading,
  getMerchantList,
  favouriteMerchants,
  toggleFavourites,
  getFavouriteMerchantsList,
  getUserLocationThunk,
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const listRef = useRef(null);
  const canGetMoreDataRef = useRef(true);
  const visibleIdsRef = useRef(new Set());

  const isRtl = isRTL();
  const params = route?.params;

  const parentCategoryName = params?.parentCategoryName;
  const filters = params?.filters;

  const isHotel = merchants?.[0]?.category_id === 185;

  const title = parentCategoryName
    ? parentCategoryName
    : t("Drawer.allMerchants");

  const handleFavouritePress = (merchant) => {
    toggleFavourites(merchant.merchant_id);
  };

  const favouriteMap = useMemo(() => {
    const map = new Set();
    favouriteMerchants.forEach((m) => map.add(m.merchant_id));
    return map;
  }, [favouriteMerchants]);

  useEffect(() => {
    if (!favouriteMerchants.length) {
      getFavouriteMerchantsList();
    }

    getUserLocationThunk();
  }, []);

  useEffect(() => {
    canGetMoreDataRef.current = true;

    getMerchantList({
      page: 1,
      filters,
      onGetData: (dataLength, limit) => {
        if (dataLength !== limit) {
          canGetMoreDataRef.current = false;
        }
      },
    });
  }, [filters]);

  const data = useMemo(() => {
    return merchants?.filter((merchant) => merchant.x_moi_show);
  }, [merchants]);

  const fetchMoreData = () => {
    if (isMerchantsLoading || !canGetMoreDataRef.current) return;

    getMerchantList({
      page: "next",
      filters: { ...filters },
      onGetData: (dataLength, limit) => {
        if (dataLength !== limit) {
          canGetMoreDataRef.current = false;
        }
      },
    });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    viewableItems.forEach((v) => {
      visibleIdsRef.current.add(v.item.merchant_id);
    });
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const renderItem = useCallback(
    ({ item: merchant }) => {
      const isFavorite = favouriteMap.has(merchant.merchant_id);

      // if (merchant?.category_id === 185 || merchant?.category_id === 192) {
      //   return (
      //     <HotelsListCard
      //       uri={merchant?.banners?.[0]?.banner_image}
      //       description={
      //         isRtl ? merchant?.x_arabic_name : merchant.merchant_name
      //       }
      //       rating={merchant.rating}
      //       onPress={() => handleMerchantCardPress(merchant)}
      //       merchantId={merchant.merchant_id}
      //     />
      //   );
      // }

      return (
        <MerchantsList
          merchant={merchant}
          onPressFavourite={() => handleFavouritePress(merchant)}
          isFavorite={isFavorite}
        />
      );
    },
    [favouriteMap, isRtl]
  );

  const keyExtractor = useCallback(
    (item) => item.merchant_id.toString(),
    []
  );

  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={
        <Header
          label={title}
          style={styles.header}
          isHome={true}
          btns={getHeaderBtnString(isHotel)}
          additionalBtnsProps={{
            back: {
              onPress: () => {
                if (!parentCategoryName) {
                  navigationRef.current.navigate("Main");
                  return;
                }
                navigationRef.current.goBack();
              },
            },
            filter: {
              params: {
                filters: params?.filters || {},
              },
            },
          }}
        />
      }
      headerHeight={50}
      contentStyle={styles.contentStyle}
      style={{
        backgroundColor: isDark ? colors.darkBlue : colors.white,
      }}
    >
      <FlatList
        ref={listRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}

        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}

        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.4}

        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}

        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        getItemLayout={getItemLayout}

        ListFooterComponent={
          isMerchantsLoading ? (
            <View style={[mainStyles.centeredRow, styles.loaderWrapper]}>
              <ActivityIndicator
                size="large"
                color={isDark ? colors.mainDarkMode : colors.darkBlue}
              />
            </View>
          ) : null
        }

        ListEmptyComponent={
          !isMerchantsLoading && (
            <ListNoData text={t("Merchants.listNoData")} />
          )
        }
      />
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  loaderWrapper: {
    marginVertical: 30,
  },
  contentStyle: {
    height: SCREEN_HEIGHT - 120,
    paddingHorizontal: 20,
  },
  contentContainerStyle: {
    paddingBottom: 60,
    flexGrow: 1,
  },
});

const mapStateToProps = (state) => ({
  merchants: state.merchantReducer.merchants,
  isMerchantsLoading: state.loadersReducer.isMerchantsLoading,
  organizations: state.merchantReducer.organizations,
  favoriteOffers: state.merchantReducer.favoriteOffers,
  favouriteMerchants: state.favouriteMerchantsReducer.favouriteMerchants,
});

export default connect(mapStateToProps, {
  getMerchantList,
  setMerchants,
  toggleFavourites,
  getFavouriteMerchantsList,
  getUserLocationThunk,
})(MerchantsPage);