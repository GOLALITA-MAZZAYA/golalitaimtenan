import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { colors } from "../../components/colors";
import { mainStyles, SCREEN_HEIGHT } from "../../styles/mainStyles";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import MainLayout from "../../components/MainLayout";
import { useTheme } from "../../components/ThemeProvider";
import ListNoData from "../../components/ListNoData";
import MerchantsList from "../MerchantsPage/components/MerchantList";
import Header from "../../components/Header";
import { getFavouriteMerchantsList } from "../../redux/favouriteMerchants/favourite-merchants-thunks";
import TwoButtons from "../../components/TwoButtons/TwoButtons";
import PagerView from "react-native-pager-view";
import CardWithNesetedItems from "../../components/CardWithNestedItems";
import { useNavigation } from "@react-navigation/native";
import {
  getFavoriteOffers,
  saveOffer,
  toggleFavourites,
} from "../../redux/merchant/merchant-thunks";
import { handleOfferCardPress } from "../AllOffers/helpres";

const FavouriteMerchants = ({
  favouriteMerchants,
  loading,
  getFavouriteMerchantsList,
  saveOffer,
  favoriteOffers,
  isOffersLoading,
  getFavoriteOffers,
  toggleFavourites,
}) => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const title = t("Favorites.favorites");
  const [selectedPage, setSelectedPage] = useState("0");
  const pagerViewRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (selectedPage === "0") {
      getFavouriteMerchantsList();
    }
  }, [selectedPage, favouriteMerchants?.length]);

  useEffect(() => {
    if (selectedPage === "1") {
      getFavoriteOffers(false, null);
    }
  }, [selectedPage, favoriteOffers?.length]);

  const handlePageSelect = (e) => {
    setSelectedPage(e.nativeEvent.position.toString());
  };

  const handleFavouritePress = (item) => {
    saveOffer(item.id, t);
  };
  const handleMerchantFavouritePress = (item) => {
    toggleFavourites(item.merchant_id);
  };

  const renderMerchants = useCallback(({ item: merchant }) => {
    return (
      <View>
        <MerchantsList
          merchant={merchant}
          onPressFavourite={() => handleMerchantFavouritePress(merchant)}
          isSaved={true}
        />
      </View>
    );
  }, []);

  const renderOffers = ({ item }) => {
    return (
      <CardWithNesetedItems
        parentProps={{
          isSaved: true,
          onPress: () => handleOfferCardPress(item),
          onPressFavourite: () => handleFavouritePress(item),
          uri: item.merchant_logo,
          name: i18n.language === "ar" ? item.x_arabic_name : item?.name,
          description:
            i18n.language === "ar"
              ? item.x_label_arabic || item.offer_label
              : item.offer_label,
          isSaved: true,
        }}
      ></CardWithNesetedItems>
    );
  };

  const keyExtractor = (_, index) => `${index}`;

  const HEADER_ITEMS = [
    {
      name: t("Favorites.merchants"),
      key: "0",
    },
    {
      name: t("Favorites.offers"),
      key: "1",
    },
  ];

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={<Header label={title} style={styles.header} />}
      headerHeight={50}
      contentStyle={styles.contentStyle}
      style={{ backgroundColor: isDark ? colors.darkBlue : colors.white }}
    >
      <TwoButtons
        isLight={!isDark}
        selectedButton={selectedPage === "0" ? 0 : 1}
        onPress1={() => {
          pagerViewRef.current.setPage(+HEADER_ITEMS[0].key);
        }}
        onPress2={() => {
          pagerViewRef.current.setPage(+HEADER_ITEMS[1].key);
        }}
        label1={HEADER_ITEMS[0].name}
        label2={HEADER_ITEMS[1].name}
      />

      <PagerView
        ref={pagerViewRef}
        style={styles.pagerView}
        initialPage={+selectedPage}
        onPageSelected={handlePageSelect}
      >
        <View key="0" style={styles.listWrapper}>
          <FlatList
            contentContainerStyle={styles.contentContainerStyle}
            showsVerticalScrollIndicator={false}
            data={favouriteMerchants}
            windowSize={SCREEN_HEIGHT}
            maxToRenderPerBatch={5}
            keyExtractor={keyExtractor}
            ListFooterComponent={() =>
              loading && (
                <View style={[mainStyles.centeredRow, styles.loaderWrapper]}>
                  <ActivityIndicator
                    size={"large"}
                    color={isDark ? colors.mainDarkMode : colors.darkBlue}
                  />
                </View>
              )
            }
            ListEmptyComponent={
              !loading && <ListNoData text={t("Merchants.listNoData")} />
            }
            renderItem={renderMerchants}
          />
        </View>
        <View key="1" style={styles.listWrapper}>
          <FlatList
            contentContainerStyle={styles.contentContainerStyle}
            showsVerticalScrollIndicator={false}
            data={favoriteOffers}
            windowSize={SCREEN_HEIGHT}
            maxToRenderPerBatch={5}
            keyExtractor={keyExtractor}
            ListFooterComponent={() =>
              isOffersLoading && (
                <View style={[mainStyles.centeredRow, styles.loaderWrapper]}>
                  <ActivityIndicator
                    size={"large"}
                    color={isDark ? colors.mainDarkMode : colors.darkBlue}
                  />
                </View>
              )
            }
            ListEmptyComponent={
              !isOffersLoading && (
                <ListNoData text={t("AllOffers.noOffersFound")} />
              )
            }
            renderItem={renderOffers}
          />
        </View>
      </PagerView>
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
  header: {
    marginHorizontal: 16,
  },
  listWrapper: {
    flex: 1,
    paddingTop: 20,
  },
  pagerView: {
    flex: 1,
  },
});

const mapStateToProps = (state) => ({
  favouriteMerchants: state.favouriteMerchantsReducer.favouriteMerchants,
  loading: state.favouriteMerchantsReducer.loading,
  favoriteOffers: state.merchantReducer.favoriteOffers,
  isOffersLoading: state.loadersReducer.isOffersLoading,
});

export default connect(mapStateToProps, {
  getFavouriteMerchantsList,
  getFavoriteOffers,
  saveOffer,
  toggleFavourites,
})(FavouriteMerchants);
