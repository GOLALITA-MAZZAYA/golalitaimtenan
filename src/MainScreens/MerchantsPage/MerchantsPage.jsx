import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { colors } from "../../components/colors";
import { mainStyles, SCREEN_HEIGHT } from "../../styles/mainStyles";
import { connect } from "react-redux";
import {
  getMerchantList,
  toggleFavourites,
} from "../../redux/merchant/merchant-thunks";
import { useTranslation } from "react-i18next";
import { setMerchants } from "../../redux/merchant/merchant-actions";
import MainLayout from "../../components/MainLayout";
import { useTheme } from "../../components/ThemeProvider";
import ListNoData from "../../components/ListNoData";
import MerchantsList from "./components/MerchantList";
import Header from "../../components/Header";
import MerchantListHeader from "./components/MerchantsHeader";
import { getFavouriteMerchantsList } from "../../redux/favouriteMerchants/favourite-merchants-thunks";
import { TypographyText } from "../../components/Typography";
import { LUSAIL_REGULAR } from "../../redux/types";
import MerchantTabs from "./AllMerchantsPage/components/MerchantTabs";
import { TABS } from "./AllMerchantsPage/components/MerchantTabs/config";

const MerchantsPage = ({
  route,
  merchants,
  isMerchantsLoading,
  getMerchantList,
  favoriteOffers,
  favouriteMerchants,
  toggleFavourites,
  getFavouriteMerchantsList,
  navigation,
}) => {
  const { t, i18n } = useTranslation();
  let params = route?.params;
  const canGetMoreDataRef = useRef(true);
  const { isDark } = useTheme();

  const parentCategoryName = params?.parentCategoryName;

  const listRef = useRef(null);
  const title = parentCategoryName
    ? parentCategoryName
    : t("Drawer.allMerchants");

  const [tabsData, setTabsLocation] = useState({
    location: null,
    tabType: TABS.ALPHABETICAL,
  });

  useEffect(() => {
    getFavouriteMerchantsList();
  }, []);

  useEffect(() => {
    canGetMoreDataRef.current = true;


    getMerchantList({
      page: 1,
      filters: params?.filters,
      onGetData: (dataLength, limit) => {
        if (dataLength !== limit) {
          canGetMoreDataRef.current = false;
        }
      },
    });
  }, [params?.filters]);

  const data = useMemo(() => {
    return merchants?.filter((merchant) => merchant.x_moi_show);
  }, [merchants?.length]);

  const fetchMoreData = useCallback(() => {
    if (
      params?.isOrganization ||
      isMerchantsLoading ||
      !canGetMoreDataRef.current
    ) {
      return;
    }

    getMerchantList({
      page: "next",
      filters: { ...params?.filters, location: tabsData.location },
      onGetData: (dataLength, limit) => {
        if (dataLength !== limit) {
          canGetMoreDataRef.current = false;
        }
      },
    });
  }, [
    isMerchantsLoading,
    params?.isOrganization,
    merchants.length,
    params?.filters,
    tabsData.location,
  ]);

  const handleFavouritePress = (merchant) => {
    toggleFavourites(merchant.merchant_id);
  };

  const handleTabChage = (id, userLocation) => {
    if (id === TABS.NEARBY) {
      if (userLocation) {
        setTabsLocation({ location: userLocation, tabType: id });

        return;
      }

      return;
    }

    if (id === TABS.ALPHABETICAL) {
      return setTabsLocation({ location: null, tabType: id });
    }
  };

  const renderItem = useCallback(
    ({ item: merchant }) => {
      const isFavorite = favouriteMerchants.some(
        (o) => o.merchant_id === merchant.merchant_id
      );
      return (
        <View>
          <MerchantsList
            merchant={merchant}
            onPressFavourite={() => handleFavouritePress(merchant)}
            isFavorite={isFavorite}
          />
        </View>
      );
    },
    [favoriteOffers, favouriteMerchants]
  );

  const keyExtractor = (_, index) => `${index}`;

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={
        <Header
          label={title}
          style={styles.header}
          btns={["back", "filter", "notifications"]}
          additionalBtnsProps={{
            back: {
              onPress: () => {
                const routes = navigation.getState()?.routes;
                const prevRoute = routes?.[0]?.name;

                if (prevRoute === "merchants-filters") {
                  navigation.navigate("Main");
                  return;
                }

                navigation.goBack();
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
      style={{ backgroundColor: isDark ? colors.darkBlue : colors.white }}
    >
      <FlatList
        ref={listRef}
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        data={tabsData.tabType === TABS.NEARBY ? [] : data}
        windowSize={SCREEN_HEIGHT}
        maxToRenderPerBatch={5}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.4}
        onEndReached={fetchMoreData}
        ListHeaderComponent={
          <>
            <MerchantListHeader style={styles.categoryWrapper} isHome={true} />

            <MerchantTabs onTabChange={handleTabChage} />

            <TypographyText
              textColor={isDark ? colors.white : "#202226"}
              size={16}
              font={LUSAIL_REGULAR}
              title={title}
              style={styles.category}
            />
          </>
        }
        ListFooterComponent={() =>
          isMerchantsLoading && (
            <View style={[mainStyles.centeredRow, styles.loaderWrapper]}>
              <ActivityIndicator
                size={"large"}
                color={isDark ? colors.mainDarkMode : colors.darkBlue}
              />
            </View>
          )
        }
        ListEmptyComponent={
          !isMerchantsLoading && <ListNoData text={t("Merchants.listNoData")} />
        }
        renderItem={renderItem}
      />
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  loaderWrapper: {
    marginVertical: 30,
  },
  categoryWrapper: {
    marginTop: 16,
  },
  category: {
    marginTop: 20,
    marginBottom: 10,
  },
  contentStyle: {
    height: SCREEN_HEIGHT - 120,
    paddingHorizontal: 20,
  },
  contentContainerStyle: {
    paddingBottom: 60,
    flexGrow: 1,
  },
  categoryTouchable: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    paddingRight: 20,
    paddingLeft: 20,
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
})(MerchantsPage);
