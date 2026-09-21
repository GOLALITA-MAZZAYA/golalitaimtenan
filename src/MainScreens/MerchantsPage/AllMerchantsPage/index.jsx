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
import { navigationRef } from "../../../Navigation/RootNavigation";
import MerchantsList from "../components/MerchantList";
import ListNoData from "../../../components/ListNoData";
import { getUserLocationThunk } from "../../../redux/global/global-thunks";
import { isRTL } from "../../../../utils";
import { getHeaderBtnString } from "./helpers";
import { getMergedSubCategoriesForCategory } from "../../../api/categories";
import { TypographyText } from "../../../components/Typography";
import { BALOO_REGULAR } from "../../../redux/types";

const ITEM_HEIGHT = 200;

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

  const activeFilters = useMemo(
    () => ({
      ...filters,
      sub_category_id: selectedSubCategoryIds,
      ...(categoryId != null ? { category_id: categoryId } : {}),
    }),
    [filters, selectedSubCategoryIds, categoryId],
  );

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
          const textColor = isDark
            ? colors.white
            : isSelected
              ? colors.darkBlue
              : "#000";

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
                    font={BALOO_REGULAR}
                    size={18}
                    textColor={placeholderColor}
                    title={label ? label.charAt(0).toUpperCase() : ""}
                  />
                )}
              </View>

              <TypographyText
                font={BALOO_REGULAR}
                textColor={textColor}
                title={label}
                size={12}
                style={[
                  styles.subCategoryText,
                  isSelected && styles.activeSubCategoryText,
                ]}
                numberOfLines={1}
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
      <FlatList
        ref={listRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderCategoryChips}
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
    marginBottom: 14,
  },
  subCategoryScrollContent: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    alignItems: "flex-start",
  },
  subCategoryItem: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: 68,
  },
  subCategoryImageWrapper: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    padding: 6,
  },
  subCategoryImage: {
    width: "100%",
    height: "100%",
  },
  subCategoryText: {
    marginTop: 5,
    fontWeight: "500",
    textAlign: "center",
    maxWidth: 68,
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
});

export default connect(mapStateToProps, {
  getMerchantList,
  setMerchants,
  toggleFavourites,
  getFavouriteMerchantsList,
  getUserLocationThunk,
})(MerchantsPage);
