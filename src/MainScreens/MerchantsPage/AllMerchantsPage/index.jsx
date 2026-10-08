import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

import { colors } from "../../../components/colors";
import { mainStyles, SCREEN_HEIGHT } from "../../../styles/mainStyles";
import { connect, useSelector } from "react-redux";
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
import { navigationRef, goBackOrHome } from "../../../Navigation/RootNavigation";
import MerchantsList from "../components/MerchantList";
import ListNoData from "../../../components/ListNoData";
import { getUserLocationThunk } from "../../../redux/global/global-thunks";
import { isRTL } from "../../../../utils";
import { getHeaderBtnString, getOfferFilters } from "./helpers";
import OfferFilterBar from "./OfferFilterBar";
import { getMergedSubCategoriesForCategory } from "../../../api/categories";
import { TypographyText } from "../../../components/Typography";
import { BALOO_2 } from "../../../redux/types";
import { rewriteAssetUrl } from "../../../utils/rewriteAssetUrl";
import { showMessage } from "react-native-flash-message";

const ITEM_HEIGHT = 200;

// Match Golalita / Masrif field order. Do not invent partner.category
// fallbacks — cuisine rows from /sub/category/v2 use image_icon, and a fake
// /go/api/image/{id}/... URI leaves an empty circle (truthy uri, broken load).
const getSubCategoryUri = (item) => {
  if (!item) return null;

  const candidates = [
    item.image_icon,
    item.x_image_url_2,
    item.image_url,
    typeof item.image3 === "string" ? item.image3 : null,
    item.x_gif_image,
    item.x_image_url_3,
    item.x_image_url_4,
    item.image,
    item.image_128,
    item.image_medium,
    item.icon,
    item.banner_image,
    item.x_image_url,
  ].filter((value) => typeof value === "string" && value.trim());

  return candidates[0] ? rewriteAssetUrl(candidates[0]) : null;
};

const resolveCategoryId = (...candidates) => {
  for (const value of candidates) {
    if (Array.isArray(value)) {
      if (value.length === 1 && value[0] != null && value[0] !== '') {
        return Number(value[0]) || value[0];
      }
      continue;
    }
    if (value != null && value !== '') {
      return Number(value) || value;
    }
  }
  return null;
};

const normalizeIdList = value => {
  if (Array.isArray(value)) {
    return value
      .map(id => (id == null || id === '' ? null : Number(id) || id))
      .filter(id => id != null && id !== '');
  }
  if (value == null || value === '') {
    return [];
  }
  return [Number(value) || value];
};

const MerchantsPage = ({
  route,
  merchants = [],
  isMerchantsLoading,
  getMerchantList,
  favouriteMerchants = [],
  toggleFavourites,
  getFavouriteMerchantsList,
  getUserLocationThunk,
  userLocation,
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const categoriesType = useSelector(
    state => state.merchantReducer.categoriesType,
  );

  const listRef = useRef(null);
  const canGetMoreDataRef = useRef(true);
  const visibleIdsRef = useRef(new Set());

  const isRtl = isRTL();
  const params = route?.params;

  const parentCategoryName = params?.parentCategoryName;
  const filters = useMemo(() => {
    const base = params?.filters || {};
    if (
      base.category_id == null &&
      params?.selectedCategoryId != null &&
      !Array.isArray(params?.selectedCategoryId)
    ) {
      return { ...base, category_id: params.selectedCategoryId };
    }
    return base;
  }, [params?.filters, params?.selectedCategoryId]);

  // Prefer filters.category_id; fall back to route parentCategoryId so chips
  // stay available after applying filters from the filter screen.
  const categoryId = useMemo(
    () =>
      resolveCategoryId(
        filters?.category_id,
        params?.parentCategoryId,
        params?.selectedCategoryId,
      ),
    [
      filters?.category_id,
      params?.parentCategoryId,
      params?.selectedCategoryId,
    ],
  );

  const filterSubCategoryIds = useMemo(
    () => normalizeIdList(filters?.sub_category_id),
    // Stable compare so new [] refs from route merges don't reset chip taps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(normalizeIdList(filters?.sub_category_id))],
  );

  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState(
    () => filterSubCategoryIds,
  );
  const [sortOrder, setSortOrder] = useState(null);
  const [selectedOfferTypes, setSelectedOfferTypes] = useState([]);
  const [discountRange, setDiscountRange] = useState(null);
  // Coordinates captured when Nearest was turned on, or null when off.
  // Captured once so GPS updates don't keep reloading the list.
  const [nearestLocation, setNearestLocation] = useState(null);

  const isHotel = merchants?.[0]?.category_id === 185;

  const title = parentCategoryName
    ? parentCategoryName
    : t("Drawer.allMerchants");

  const handleFavouritePress = (merchant) => {
    toggleFavourites(merchant.merchant_id);
  };

  const favouriteMap = useMemo(() => {
    const map = new Set();
    (favouriteMerchants || []).forEach((m) => map.add(m.merchant_id));
    return map;
  }, [favouriteMerchants]);

  useEffect(() => {
    if (!(favouriteMerchants || []).length) {
      getFavouriteMerchantsList();
    }

    getUserLocationThunk();
  }, []);

  // Keep chip selection in sync with filters applied from the filter screen.
  useEffect(() => {
    setSelectedSubCategoryIds(filterSubCategoryIds);
  }, [filterSubCategoryIds, categoryId]);

  useEffect(() => {
    if (!categoryId) {
      setSubCategories([]);
      return;
    }

    let isCancelled = false;

    // Same merge as the filters screen (own sub-cats + each child's sub-cats),
    // so applied subcategory chips are actually present in this list.
    getMergedSubCategoriesForCategory(categoryId, categoriesType)
      .then(({ subCategories: data }) => {
        if (!isCancelled) {
          setSubCategories(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setSubCategories([]);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [categoryId, categoriesType]);

  const activeFilters = useMemo(() => {
    const offerFilters = getOfferFilters({
      offerTypes: selectedOfferTypes,
      discountRange,
      sortOrder,
      nearestLocation,
    });

    return {
      ...filters,
      sub_category_id: selectedSubCategoryIds,
      ...(categoryId != null ? { category_id: categoryId } : {}),
      ...offerFilters,
    };
  }, [
    filters,
    selectedSubCategoryIds,
    categoryId,
    selectedOfferTypes,
    discountRange,
    sortOrder,
    nearestLocation,
  ]);

  const subCategoryOptions = useMemo(
    () =>
      subCategories.map((item) => ({
        value: item.id,
        label: item.name,
        label_arabic: item.x_name_arabic || item.name,
        uri: getSubCategoryUri(item),
      })),
    [subCategories]
  );

  const toggleSubCategory = useCallback((id) => {
    const normalizedId = Number(id) || id;
    setSelectedSubCategoryIds((prev) =>
      prev.some(item => String(item) === String(normalizedId))
        ? prev.filter((item) => String(item) !== String(normalizedId))
        : [...prev, normalizedId]
    );
  }, []);

  const applyOfferFilters = useCallback(({ offerTypes, discountRange: nextRange }) => {
    setSelectedOfferTypes(offerTypes);
    setDiscountRange(nextRange);
  }, []);

  const applySort = useCallback(
    ({ sortOrder: nextSortOrder, isNearest }) => {
      setSortOrder(nextSortOrder);

      if (!isNearest) {
        setNearestLocation(null);
        return;
      }

      if (!userLocation?.latitude || !userLocation?.longitude) {
        getUserLocationThunk();
        showMessage({
          message: t("Merchants.locationRequired"),
          type: "warning",
        });
        setNearestLocation(null);
        return;
      }

      setNearestLocation({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
    },
    [userLocation, getUserLocationThunk, t],
  );

  useEffect(() => {
    canGetMoreDataRef.current = true;
    listRef.current?.scrollToOffset({ offset: 0, animated: false });

    getMerchantList({
      page: 1,
      filters: activeFilters,
      onGetData: (dataLength, limit) => {
        if (dataLength !== limit) {
          canGetMoreDataRef.current = false;
        }
      },
    });
  }, [activeFilters]);

  const data = useMemo(() => {
    const list = Array.isArray(merchants) ? merchants : [];
    return list.filter(merchant => merchant.x_moi_show);
  }, [merchants]);

  const fetchMoreData = () => {
    if (isMerchantsLoading || !canGetMoreDataRef.current) return;

    getMerchantList({
      page: "next",
      filters: { ...activeFilters },
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

  const renderCategoryChips = () => {
    if (!subCategoryOptions.length) return null;

    return (
      <ScrollView
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subCategoryScrollContent}
        style={[
          styles.subCategoryTabs,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        {subCategoryOptions.map((option) => {
          const isSelected = selectedSubCategoryIds.some(
            id => String(id) === String(option.value),
          );
          const label = isRtl
            ? option.label_arabic
            : typeof option.label === "string" && option.label
              ? option.label.charAt(0).toUpperCase() + option.label.slice(1)
              : option.label;
          const isSvg =
            typeof option.uri === "string" &&
            option.uri.toLowerCase().endsWith(".svg");

          // Selection via chip background/border only — do not tint icons.
          // Cuisine images are full-color; tintColor flattens them to solid blobs.
          const imageBackgroundColor = isDark
            ? colors.navyBlue
            : isSelected
              ? colors.darkBlue
              : "#E8F4F9";
          const placeholderColor = isDark
            ? colors.mainDarkMode
            : isSelected
              ? colors.white
              : colors.darkBlue;
          const titleColor = isSelected
            ? isDark
              ? colors.mainDarkMode
              : colors.darkBlue
            : isDark
              ? "#D1D5DB"
              : "#374151";

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
                    backgroundColor: imageBackgroundColor,
                    borderColor: isDark
                      ? isSelected
                        ? colors.mainDarkMode
                        : "transparent"
                      : "transparent",
                    borderWidth: isDark && isSelected ? 2 : 0,
                  },
                ]}
              >
                {option.uri && !isSvg ? (
                  <Image
                    source={{ uri: option.uri }}
                    style={styles.subCategoryImage}
                    resizeMode="contain"
                  />
                ) : (
                  <TypographyText
                    font={BALOO_2}
                    size={22}
                    textColor={placeholderColor}
                    title={label ? label.charAt(0).toUpperCase() : ""}
                  />
                )}
              </View>

              <TypographyText
                font={BALOO_2}
                textColor={titleColor}
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
    );
  };

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
              onPress: () => goBackOrHome(navigationRef.current),
            },
            filter: {
              params: {
                filters: activeFilters || {},
                parentCategoryName,
                parentCategoryId: categoryId ?? params?.parentCategoryId,
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
      {renderCategoryChips()}

      {!isHotel && (
        <OfferFilterBar
          offerTypes={selectedOfferTypes}
          discountRange={discountRange}
          sortOrder={sortOrder}
          isNearest={!!nearestLocation}
          onApplyFilters={applyOfferFilters}
          onApplySort={applySort}
        />
      )}

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
  header: {
    paddingRight: 20,
    paddingLeft: 20,
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
  setMerchants,
  toggleFavourites,
  getFavouriteMerchantsList,
  getUserLocationThunk,
})(MerchantsPage);
