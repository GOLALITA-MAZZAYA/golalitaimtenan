import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { colors } from '../../components/colors';
import { TypographyText } from '../../components/Typography';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import { mainStyles } from '../../styles/mainStyles';
import { useTheme } from '../../components/ThemeProvider';
import { connect } from 'react-redux';
import {
  getOffers,
  saveOffer,
  getFavoriteOffers,
} from '../../redux/merchant/merchant-thunks';
import { useTranslation } from 'react-i18next';
import { B1G1, DISCOUNT, PROMOCODE, LUSAIL_REGULAR } from '../../redux/types';
import ListNoData from '../../components/ListNoData';
import CardWithNesetedItems from '../../components/OfferCardWithNestedItems';
import { getDescription, handleOfferCardPress } from './helpres';
import { getLocalizedValue, getStringDate, isRTL } from '../../../utils';
import { requestLocationPermission } from '../../helpers';
import { getProductCategoryTypes } from '../../api/offers';

const AllOffers = ({
  offers,
  isOffersLoading,
  getOffers,
  saveOffer,
  favoriteOffers,
  getFavoriteOffers,
}) => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedCategoryType, setSelectedCategoryType] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [categoryTypes, setCategoryTypes] = useState([]);
  const canGetMoreDataRef = useRef(true);
  const language = i18n.language;
  const isArabic = language === 'ar';
  const [isReady, setIsReady] = useState(false);

  const categories = [
    { id: null, name: t('AllOffers.allOffers') },
    { id: DISCOUNT, name: t('AllOffers.discount') },
    { id: B1G1, name: t('AllOffers.b1g1Free') },
    { id: PROMOCODE, name: t('AllOffers.promocode') },
  ];

  const filterCategoryTypes = useMemo(() => {
    if (!categoryTypes || categoryTypes.length === 0) {
      return [];
    }

    return [
      {
        id: null,
        name: t('AllOffers.allTags', 'All'),
        name_ar: 'الكل',
      },
      ...categoryTypes,
    ];
  }, [categoryTypes, t]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const types = await getProductCategoryTypes();
        if (isMounted && Array.isArray(types) && types.length > 0) {
          setCategoryTypes(types);
        }
      } catch (e) {
        console.log('Error loading category types:', e);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    getFavoriteOffers(false, null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const status = await requestLocationPermission();
        if (status === 'granted' && isMounted) {
          Geolocation.getCurrentPosition(
            pos => {
              if (isMounted && pos?.coords) {
                setUserLocation({
                  user_lat: pos.coords.latitude,
                  user_long: pos.coords.longitude,
                });
              }
            },
            () => {},
            { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
          );
        }
      } catch (e) {
        // silent fallback if permission denied or error
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFavouritePress = item => {
    saveOffer(item.id, t);
  };

  const merchantOfferCounts = useMemo(() => {
    const map = {};
    if (Array.isArray(offers)) {
      offers.forEach(o => {
        const mId = o?.merchant_id || o?.go_merchant_id;
        if (mId) {
          map[mId] = (map[mId] || 0) + 1;
        }
      });
    }
    return map;
  }, [offers]);

  const getOfferCountLabel = item => {
    const rawCount = Number(item?.offer_count ?? item?.offers_count ?? 0);
    const mId = item?.merchant_id || item?.go_merchant_id;
    const localCount =
      mId && merchantOfferCounts[mId] ? merchantOfferCounts[mId] : 0;
    const count = rawCount > 0 ? rawCount : localCount;

    if (count > 0) {
      if (isArabic) {
        return `${count} عروض`;
      }
      return `${count} ${count === 1 ? 'Offer' : 'Offers'}`;
    }

    return isArabic ? 'عروض' : 'Offers';
  };

  const renderItem = ({ item }) => {
    const isFavorite = favoriteOffers?.some(offer => offer.id === item.id);
    const hasValidDistance =
      item.distance_km != null &&
      item.distance_km < 999999 &&
      !!item.distance_display;

    return (
      <CardWithNesetedItems
        parentProps={{
          onPress: () => handleOfferCardPress(item, true),
          onPressFavourite: () => handleFavouritePress(item),
          uri: item.merchant_logo || item.image_url,
          name: getLocalizedValue(item.x_arabic_name, item.name),
          description: getDescription(item),
          endDate: item.end_date
            ? getStringDate(item.end_date.split(' ')[0])
            : null,
          isSaved: isFavorite,
          distance: hasValidDistance ? item.distance_display : null,
          offersLabel: getOfferCountLabel(item),
        }}
      />
    );
  };

  const keyExtractor = (item, index) =>
    item.id ? item.id.toString() : index.toString();

  const getFilterParams = () => ({
    ...(selectedFilter ? { x_offer_type: selectedFilter } : {}),
    ...(selectedCategoryType
      ? { category_type_id: selectedCategoryType }
      : {}),
  });

  const fetchMoreData = () => {
    if (!isReady || isOffersLoading || !canGetMoreDataRef.current) {
      return;
    }

    const filterParams = getFilterParams();
    const locationParams = userLocation
      ? {
          user_lat: userLocation.user_lat,
          user_long: userLocation.user_long,
        }
      : {};
    const params = { ...filterParams, ...locationParams };

    getOffers({
      merchant_id: null,
      merchant_category_id: null,
      page: 'next',
      params,
      onGetData: (dataLength, limit) => {
        if (dataLength !== limit) {
          canGetMoreDataRef.current = false;
        }
      },
    });
  };

  useEffect(() => {
    const filterParams = getFilterParams();
    const locationParams = userLocation
      ? {
          user_lat: userLocation.user_lat,
          user_long: userLocation.user_long,
        }
      : {};
    const params = { ...filterParams, ...locationParams };

    canGetMoreDataRef.current = true;
    setIsReady(false);

    getOffers({
      merchant_id: null,
      merchant_category_id: null,
      page: 1,
      params,
      onGetData: (dataLength, limit) => {
        setIsReady(true);

        if (dataLength !== limit) {
          canGetMoreDataRef.current = false;
        }
      },
    }).catch(() => {
      setIsReady(true);
    });
  }, [selectedFilter, selectedCategoryType, userLocation]);

  const loaderColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const screenBg = isDark ? colors.darkBlue : colors.white;

  return (
    <View
      style={{
        backgroundColor: screenBg,
        ...styles.wrapper,
      }}
    >
      <SafeAreaView
        style={[styles.safeAreaWrapper, { backgroundColor: screenBg }]}
      >
        <CommonHeader
          isWhite={isDark}
          label={t('AllOffers.title')}
          style={{ backgroundColor: isDark ? colors.darkBlue : undefined }}
        />

        <View
          style={[
            styles.tabsContainer,
            {
              backgroundColor: isDark ? '#444444' : colors.transparent,
              borderColor: isDark ? colors.transparent : colors.grey,
              flexDirection: isRTL() ? 'row-reverse' : 'row',
            },
          ]}
        >
          {categories.map(item => {
            const isActive = selectedFilter === item.id;

            return (
              <TouchableOpacity
                key={String(item.id)}
                activeOpacity={0.8}
                onPress={() => setSelectedFilter(item.id)}
                style={[
                  styles.tabItem,
                  isActive && {
                    backgroundColor: isDark
                      ? colors.darkModeBackground
                      : colors.darkBlue,
                  },
                ]}
              >
                <TypographyText
                  size={12}
                  font={LUSAIL_REGULAR}
                  title={item.name}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{ fontWeight: '700' }}
                  textColor={
                    isActive
                      ? isDark
                        ? colors.mainDarkMode
                        : colors.white
                      : isDark
                        ? colors.white
                        : '#999CAD'
                  }
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {filterCategoryTypes.length > 0 && (
          <View style={styles.subCategoryWrapper}>
            <FlatList
              key={isRTL() ? 'rtl-category-chips' : 'ltr-category-chips'}
              horizontal
              inverted={isRTL()}
              showsHorizontalScrollIndicator={false}
              data={filterCategoryTypes}
              keyExtractor={cat => String(cat.id ?? 'all')}
              contentContainerStyle={styles.subCategoryContainer}
              ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
              renderItem={({ item: cat }) => {
                const isActive = selectedCategoryType === cat.id;

                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setSelectedCategoryType(cat.id)}
                    style={[
                      styles.subCategoryChip,
                      {
                        backgroundColor: isActive
                          ? isDark
                            ? colors.darkModeBackground
                            : colors.darkBlue
                          : isDark
                            ? '#1E1E1E'
                            : '#F5F5F5',
                        borderColor: isActive
                          ? colors.transparent
                          : isDark
                            ? '#333333'
                            : '#E5E7EB',
                      },
                    ]}
                  >
                    <TypographyText
                      size={12}
                      font={LUSAIL_REGULAR}
                      title={isArabic ? cat.name_ar || cat.name : cat.name}
                      style={{ fontWeight: '600' }}
                      textColor={
                        isActive
                          ? isDark
                            ? colors.mainDarkMode
                            : colors.white
                          : isDark
                            ? colors.white
                            : '#999CAD'
                      }
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}

        <FlatList
          data={offers}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews
          onEndReachedThreshold={0.4}
          onEndReached={fetchMoreData}
          contentContainerStyle={styles.contentContainerStyle}
          initialNumToRender={20}
          ListFooterComponent={() =>
            isOffersLoading && !!offers?.length ? (
              <View style={[mainStyles.centeredRow, { marginTop: 30 }]}>
                <ActivityIndicator size="large" color={loaderColor} />
              </View>
            ) : null
          }
          style={styles.list}
          ListEmptyComponent={
            isReady && !isOffersLoading && !offers.length ? (
              <ListNoData text={t('AllOffers.noOffersFound')} />
            ) : (
              <ActivityIndicator size="large" color={loaderColor} />
            )
          }
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  safeAreaWrapper: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  tabsContainer: {
    borderWidth: 1,
    borderRadius: 100,
    marginHorizontal: 16,
    marginVertical: 18,
    padding: 4,
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subCategoryWrapper: {
    marginBottom: 14,
  },
  subCategoryContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  subCategoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  offers: state.merchantReducer.offers,
  isOffersLoading: state.loadersReducer.isOffersLoading,
  favoriteOffers: state.merchantReducer.favoriteOffers,
});

export default connect(mapStateToProps, {
  saveOffer,
  getOffers,
  getFavoriteOffers,
})(AllOffers);
