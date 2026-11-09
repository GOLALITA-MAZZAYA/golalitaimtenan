import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { colors } from "../../../components/colors";
import { mainStyles, SCREEN_HEIGHT } from "../../../styles/mainStyles";
import { connect } from "react-redux";
import { showMessage } from "react-native-flash-message";
import {
  getMerchantList,
  toggleFavourites,
} from "../../../redux/merchant/merchant-thunks";
import { useTranslation } from "react-i18next";
import MainLayout from "../../../components/MainLayout";
import { useTheme } from "../../../components/ThemeProvider";
import Header from "../../../components/Header";
import { getFavouriteMerchantsList } from "../../../redux/favouriteMerchants/favourite-merchants-thunks";
import { useNavigation } from "@react-navigation/native";
import MerchantsList from "../components/MerchantList";
import ListNoData from "../../../components/ListNoData";
import { getUserLocationThunk } from "../../../redux/global/global-thunks";
import HotelsListCard from "./HotelsListCard";
import { getTextAlign, isRTL } from "../../../../utils";
import { handleMerchantCardPress } from "../helpers";
import { getHeaderBtnString, getOfferFilters } from "./helpers";
import OfferFilterBar from "./OfferFilterBar";
import {
  getCategoryAvailableFilters,
  getScopedAvailableFilters,
  getSubCategoriesByParentId,
  isOffersEnabled,
} from "../../../api/categories";
import { TypographyText } from "../../../components/Typography";
import { BALOO_2 } from "../../../redux/types";
import AppImage from "../../../components/AppImage";
import TintedSvg from "../../../components/TintedSvg";
import SearchSvg from "../../../assets/search.svg";
import CloseSvg from "../../../assets/close.svg";

const SEARCH_DEBOUNCE_MS = 500;

const MerchantsPage = ({
  route,
  merchants,
  isMerchantsLoading,
  getMerchantList,
  favouriteMerchants,
  toggleFavourites,
  getFavouriteMerchantsList,
  getUserLocationThunk,
  userLocation,
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const navigation = useNavigation();

  const listRef = useRef(null);
  const canGetMoreDataRef = useRef(true);
  const isFetchingMoreRef = useRef(false);
  const visibleIdsRef = useRef(new Set());
  const subCategoryScrollRef = useRef(null);

  const isRtl = isRTL();
  const params = route?.params;

  const parentCategoryName = params?.parentCategoryName;
  const filters = params?.filters;
  const categoryId = filters?.category_id;

  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);
  const [selectedFilterIds, setSelectedFilterIds] = useState([]);
  // Raw /category/available_filters result for the opened category.
  const [filtersResult, setFiltersResult] = useState(null);
  // Starts as loading for a single category, so the filter/sort bar is not
  // shown before we know whether offers are switched on (show_offers).
  const [filtersLoading, setFiltersLoading] = useState(
    !!categoryId && !Array.isArray(categoryId)
  );
  // The coordinates captured when Nearest was turned on, or null when it is
  // off. Captured once so GPS updates don't keep reloading the list.
  const [nearestLocation, setNearestLocation] = useState(null);
  // Text in the search box, and the trimmed value actually sent to the API
  // (updated after a short pause in typing, or right away on submit).
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // The screen is reused across categories, so start each one with an empty
  // search.
  useEffect(() => {
    setSearchText("");
    setSearchQuery("");
  }, [categoryId]);

  useEffect(() => {
    const next = searchText.trim();
    if (next === searchQuery) return;

    const timer = setTimeout(() => setSearchQuery(next), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchText, searchQuery]);

  const submitSearch = useCallback(() => {
    setSearchQuery(searchText.trim());
  }, [searchText]);

  const clearSearch = useCallback(() => {
    setSearchText("");
    setSearchQuery("");
  }, []);


  const title = parentCategoryName
    ? parentCategoryName
    : t("Drawer.allMerchants");

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
    setSelectedSubCategoryIds([]);

    // Only a single category tapped from the category list has one clear
    // parent_category_id to look sub-categories up by. When category_id is
    // an array (multi-category browse from the Search filters screen),
    // there's no single category to scope this row to, so skip it — that
    // screen already offers its own multi-select sub-category picker.
    if (!categoryId || Array.isArray(categoryId)) {
      setSubCategories([]);
      return;
    }

    let isCancelled = false;

    getSubCategoriesByParentId(categoryId)
      .then((data) => {
        if (!isCancelled) setSubCategories(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!isCancelled) setSubCategories([]);
      });

    return () => {
      isCancelled = true;
    };
  }, [categoryId]);

  useEffect(() => {
    setSelectedFilterIds([]);
    setFiltersResult(null);

    // Filters are configured per category, so there is nothing to load for
    // All Merchants or a multi-category browse.
    if (!categoryId || Array.isArray(categoryId)) {
      setFiltersLoading(false);
      return;
    }

    let isCancelled = false;
    setFiltersLoading(true);

    getCategoryAvailableFilters(categoryId)
      .then((result) => {
        if (!isCancelled) setFiltersResult(result);
      })
      .catch(() => {
        if (!isCancelled) setFiltersResult(null);
      })
      .finally(() => {
        if (!isCancelled) setFiltersLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [categoryId]);

  // Picking sub-category chips narrows the filters to those children.
  const availableFilters = useMemo(
    () => getScopedAvailableFilters(filtersResult, selectedSubCategoryIds),
    [filtersResult, selectedSubCategoryIds]
  );

  // The backend can switch offers off for a category (show_offers: false);
  // then the whole filter/sort bar is hidden. Without a result (no single
  // category, or the request failed) Sort stays available on its own.
  const offersHidden =
    !!filtersResult && !isOffersEnabled(filtersResult, selectedSubCategoryIds);

  // The Filter button also needs at least one configured filter.
  const showFilters = availableFilters.length > 0;

  // Categories without offers should not keep stale filter/sort params.
  useEffect(() => {
    if (!offersHidden) return;

    setSelectedFilterIds([]);
    setSortOrder(null);
    setNearestLocation(null);
  }, [offersHidden]);

  // Drop picks that are no longer offered after the scope changes.
  useEffect(() => {
    setSelectedFilterIds((prev) => {
      const next = prev.filter((id) =>
        availableFilters.some((filter) => filter.id === id)
      );
      return next.length === prev.length ? prev : next;
    });
  }, [availableFilters]);

  const activeFilters = useMemo(() => {
    const selectedFilters = availableFilters.filter((filter) =>
      selectedFilterIds.includes(filter.id)
    );

    const offerFilters = getOfferFilters({
      selectedFilters,
      sortOrder,
      nearestLocation,
    });

    if (
      !selectedSubCategoryIds.length &&
      !Object.keys(offerFilters).length &&
      !searchQuery
    ) {
      return filters;
    }

    // Keeps the category filters, so the search only looks inside this
    // category.
    return {
      ...filters,
      ...(searchQuery ? { merchant_name: searchQuery } : {}),
      ...(selectedSubCategoryIds.length
        ? { sub_category_id: selectedSubCategoryIds }
        : {}),
      ...offerFilters,
    };
  }, [
    filters,
    selectedSubCategoryIds,
    selectedFilterIds,
    availableFilters,
    sortOrder,
    nearestLocation,
    searchQuery,
  ]);

  const subCategoryOptions = useMemo(() => {
    const getSubCategoryUri = (item) => {
      if (!item) return null;
      return (
        item.image_icon ||
        item.x_image_url_2 ||
        item.image_url ||
        item.image3 ||
        item.x_gif_image ||
        item.x_image_url_3 ||
        item.x_image_url_4 ||
        item.image ||
        item.image_128 ||
        item.image_medium ||
        item.icon ||
        item.banner_image ||
        item.x_image_url ||
        null
      );
    };

    return subCategories.map((subCategory) => ({
      value: subCategory.id,
      label: subCategory.name,
      label_arabic: subCategory.x_name_arabic || subCategory.name,
      uri: getSubCategoryUri(subCategory),
    }));
  }, [subCategories]);

  const toggleSubCategory = useCallback((id) => {
    setSelectedSubCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const applyOfferFilters = useCallback(({ filterIds }) => {
    setSelectedFilterIds(filterIds);
  }, []);

  const pendingNearestRef = useRef(false);

  const applySort = useCallback(
    ({ sortOrder: nextSortOrder, isNearest }) => {
      setSortOrder(nextSortOrder);

      if (!isNearest) {
        pendingNearestRef.current = false;
        setNearestLocation(null);
        return;
      }

      if (!userLocation?.latitude || !userLocation?.longitude) {
        pendingNearestRef.current = true;
        getUserLocationThunk();
        showMessage({
          message: t("Merchants.locationRequired"),
          type: "warning",
        });
        setNearestLocation(null);
        return;
      }

      pendingNearestRef.current = false;
      setNearestLocation({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
    },
    [userLocation, getUserLocationThunk, t]
  );

  // If the user chose Nearest before GPS was ready, apply it once location lands.
  useEffect(() => {
    if (
      !pendingNearestRef.current ||
      !userLocation?.latitude ||
      !userLocation?.longitude
    ) {
      return;
    }

    pendingNearestRef.current = false;
    setNearestLocation({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    });
  }, [userLocation]);

  useEffect(() => {
    canGetMoreDataRef.current = true;
    isFetchingMoreRef.current = false;

    // This screen is reused across category navigations (navigation.navigate,
    // not push), so a scroll offset from a previous visit can otherwise
    // survive into freshly (and often shorter) filtered data, leaving blank
    // space above wherever that stale offset now lands.
    listRef.current?.scrollToOffset({ offset: 0, animated: false });

    getMerchantList({
      page: 1,
      filters: activeFilters,
      onGetData: (dataLength, limit) => {
        if (!dataLength || dataLength < limit) {
          canGetMoreDataRef.current = false;
        }
      },
    });
  }, [activeFilters]);

  const data = useMemo(() => {
    const list = Array.isArray(merchants) ? merchants : [];
    return list.filter((merchant) => merchant.x_moi_show);
  }, [merchants]);

  const fetchMoreData = () => {
    if (
      isMerchantsLoading ||
      isFetchingMoreRef.current ||
      !canGetMoreDataRef.current
    ) {
      return;
    }

    isFetchingMoreRef.current = true;

    getMerchantList({
      page: "next",
      filters: { ...activeFilters },
      onGetData: (dataLength, limit) => {
        if (!dataLength || dataLength < limit) {
          canGetMoreDataRef.current = false;
        }
        isFetchingMoreRef.current = false;
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

      if (merchant?.category_id === 185) {
        return (
          <HotelsListCard
            merchant={merchant}
            uri={merchant?.banners?.[0]?.banner_image}
            description={
              isRtl ? merchant?.x_arabic_name : merchant.merchant_name
            }
            rating={merchant.rating}
            onPress={() => handleMerchantCardPress(merchant)}
            merchantId={merchant.merchant_id}
            isFavorite={isFavorite}
            onPressFavourite={() => toggleFavourites(merchant.merchant_id)}
          />
        );
      }

      return (
        <MerchantsList
          merchant={merchant}
          onPressFavourite={toggleFavourites}
          isFavorite={isFavorite}
        />
      );
    },
    [favouriteMap, isRtl, toggleFavourites]
  );

  const keyExtractor = useCallback(
    (item) => String(item.merchant_id ?? item.id),
    []
  );

  // Search, sub-categories and the filter/sort bar scroll away with the
  // list instead of staying pinned above it.
  const listHeader = (
    <>
      <View
        style={[
          styles.searchWrapper,
          {
            flexDirection: isRtl ? "row-reverse" : "row",
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#F4F4F5",
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.06)",
          },
        ]}
      >
        <SearchSvg
          width={18}
          height={18}
          color={isDark ? colors.mainDarkMode : "#6B7280"}
        />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={submitSearch}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          placeholder={t("Merchants.searchPlaceholder")}
          placeholderTextColor={isDark ? "#71717A" : "#9CA3AF"}
          style={[
            styles.searchInput,
            getTextAlign(),
            { color: isDark ? colors.white : "#111827" },
          ]}
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={clearSearch}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <CloseSvg
              width={18}
              height={18}
              color={isDark ? colors.white : "#6B7280"}
            />
          </TouchableOpacity>
        )}
      </View>

      {subCategoryOptions.length > 0 && (
        <ScrollView
          ref={subCategoryScrollRef}
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.subCategoryScrollContent,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
          style={styles.subCategoryTabs}
          // In RTL the first item sits at the far right, so start scrolled to the end
          onContentSizeChange={() => {
            if (isRtl) {
              subCategoryScrollRef.current?.scrollToEnd({ animated: false });
            }
          }}
        >
          {subCategoryOptions.map((option) => {
            const isSelected = selectedSubCategoryIds.includes(option.value);
            const label = isRtl
              ? option.label_arabic
              : typeof option.label === "string" && option.label
              ? option.label.charAt(0).toUpperCase() + option.label.slice(1)
              : option.label;
            const isSvg =
              typeof option.uri === "string" &&
              option.uri.toLowerCase().endsWith(".svg");

            return (
              <TouchableOpacity
                key={option.value}
                activeOpacity={0.75}
                onPress={() => toggleSubCategory(option.value)}
                style={[
                  styles.subCategoryItem,
                  {
                    marginLeft: isRtl ? 10 : 0,
                    marginRight: isRtl ? 0 : 10,
                  },
                ]}
              >
                <View
                  style={[
                    styles.subCategoryImageWrapper,
                    {
                      backgroundColor: isDark
                        ? isSelected
                          ? "rgba(215, 188, 118, 0.18)"
                          : "#1C1C1E"
                        : isSelected
                        ? "rgba(162, 148, 117, 0.12)"
                        : "#F5F5F7",
                      borderColor: isSelected
                        ? isDark
                          ? colors.mainDarkMode
                          : colors.darkBlue
                        : isDark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.06)",
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                >
                  {option.uri ? (
                    isSvg ? (
                      <TintedSvg
                        uri={option.uri}
                        width={44}
                        height={44}
                        color={
                          isSelected
                            ? isDark
                              ? colors.mainDarkMode
                              : colors.darkBlue
                            : isDark
                            ? colors.white
                            : "#1C1C1E"
                        }
                      />
                    ) : (
                      <AppImage
                        source={{ uri: option.uri }}
                        style={styles.subCategoryImage}
                        contentFit="contain"
                        transition={200}
                      />
                    )
                  ) : (
                    <TypographyText
                      font={BALOO_2}
                      size={22}
                      textColor={
                        isSelected
                          ? isDark
                            ? colors.mainDarkMode
                            : colors.darkBlue
                          : isDark
                          ? colors.white
                          : "#1C1C1E"
                      }
                      title={label ? label.charAt(0).toUpperCase() : ""}
                    />
                  )}
                </View>

                <TypographyText
                  font={BALOO_2}
                  textColor={
                    isSelected
                      ? isDark
                        ? colors.mainDarkMode
                        : colors.darkBlue
                      : isDark
                      ? "#D1D5DB"
                      : "#374151"
                  }
                  title={label}
                  size={12}
                  style={[
                    styles.subCategoryText,
                    isSelected && styles.activeSubCategoryText,
                  ]}
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {!filtersLoading && !offersHidden && (
        <OfferFilterBar
          availableFilters={availableFilters}
          filterIds={selectedFilterIds}
          filtersLoading={filtersLoading}
          showFilters={showFilters}
          sortOrder={sortOrder}
          isNearest={!!nearestLocation}
          onApplyFilters={applyOfferFilters}
          onApplySort={applySort}
        />
      )}
    </>
  );

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={
        <Header
          label={title}
          style={styles.header}
          isHome={true}
          btns={getHeaderBtnString()}
          additionalBtnsProps={{
            back: {
              onPress: () => {
                if (!parentCategoryName) {
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
      style={{
        backgroundColor: isDark ? colors.darkModeBackground : colors.white,
      }}
    >
      <FlatList
        ref={listRef}
        style={styles.merchantsList}
        data={data}
        ListHeaderComponent={listHeader}
        extraData={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        bounces={false}
        contentContainerStyle={styles.contentContainerStyle}
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.4}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}
        ListFooterComponent={
          isMerchantsLoading && data.length > 0 ? (
            <View style={[mainStyles.centeredRow, styles.loaderWrapper]}>
              <ActivityIndicator
                size="large"
                color={isDark ? colors.mainDarkMode : colors.darkBlue}
              />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isMerchantsLoading ? (
            <ListNoData text={t("Merchants.listNoData")} />
          ) : (
            <View style={[mainStyles.centeredRow, styles.loaderWrapper]}>
              <ActivityIndicator
                size="large"
                color={isDark ? colors.mainDarkMode : colors.darkBlue}
              />
            </View>
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
  subCategoryTabs: {
    flexGrow: 0,
    marginTop: 2,
    marginBottom: 12,
  },
  subCategoryScrollContent: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    alignItems: "flex-start",
  },
  subCategoryItem: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: 80,
  },
  subCategoryImageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    padding: 2,
  },
  subCategoryImage: {
    width: "100%",
    height: "100%",
  },
  subCategoryText: {
    marginTop: 6,
    fontWeight: "500",
    textAlign: "center",
    width: "100%",
    lineHeight: 16,
  },
  activeSubCategoryText: {
    fontWeight: "700",
  },
  merchantsList: {
    flex: 1,
  },
  searchWrapper: {
    alignItems: "center",
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginTop: 4,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
});

const mapStateToProps = (state) => ({
  merchants: state.merchantReducer.merchants,
  isMerchantsLoading: state.loadersReducer.isMerchantsLoading,
  organizations: state.merchantReducer.organizations,
  favoriteOffers: state.merchantReducer.favoriteOffers,
  favouriteMerchants: state.favouriteMerchantsReducer.favouriteMerchants,
  userLocation: state.globalReducer.userLocation,
});

export default connect(mapStateToProps, {
  getMerchantList,
  toggleFavourites,
  getFavouriteMerchantsList,
  getUserLocationThunk,
})(MerchantsPage);