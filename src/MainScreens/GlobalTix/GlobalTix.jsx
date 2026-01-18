import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { 
  setProducts,
  setCountries,
  setCategories,
  setCities,
  setFilters,
  setLoading,
  setLoadingMore,
  setError,
  addToFavorites,
  removeFromFavorites,
  clearError,
  setTotalProducts,
  setHasMore,
  setCurrentPage,
  setGlobalTixPaymentData,
} from '../../redux/globalTix/globalTix-actions';
import { globalTixAPI } from '../../redux/globalTix/globalTix-api';
import { checkGlobalTixPaymentStatus } from '../../api/giftCard';
import { showMessage } from 'react-native-flash-message';
import store from '../../redux/store';
import SmartImage from '../../components/SmartImage';
import MainLayout from '../../components/MainLayout';
import Header from '../../components/Header';
import { TypographyText } from '../../components/Typography';
import { BALOO_SEMIBOLD, LUSAIL_REGULAR } from '../../redux/types';
import { colors } from '../../components/colors';
import { mainStyles,SCREEN_HEIGHT } from '../../styles/mainStyles';
import { useTheme } from '../../components/ThemeProvider';
import ListNoData from '../../components/ListNoData';
import FullScreenLoader from '../../components/Loaders/FullScreenLoader';
import { isRTL } from '../../../utils';
import { convertToQAR } from '../../utils/currencyConverter';
import { GlobalTixInlineFilters } from './components';
import { translateProduct, translateArray } from '../../utils/translationService';

const GlobalTix = ({ navigation, route }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  
  // Redux state
  const { products, loading, loadingMore, error, filters, favorites, hasMore } = useSelector(state => state.globalTix);
  
  // Current language
  const currentLanguage = i18n.language;
  
  // Local state for refresh and currency conversion
  const [refreshing, setRefreshing] = useState(false);
  const [convertedPrices, setConvertedPrices] = useState({});
  const [translatedProducts, setTranslatedProducts] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Check for initial filters from navigation params
    const initialFilters = route?.params?.initialFilters;
    console.log("GlobalTix: Initial filters from navigation:", initialFilters);
    
    if (initialFilters) {
      // Clear existing products immediately to prevent showing old results
      dispatch(setProducts([]));
      dispatch(setTotalProducts(0));
      dispatch(setHasMore(true));
      dispatch(setCurrentPage(1));
      dispatch(setLoading(true)); // Show loading state immediately
      
      // Apply initial filters
      dispatch(setFilters(initialFilters));
      console.log("GlobalTix: Applied initial filters to Redux state");
      
      // Load products with new filters immediately
      loadProducts(initialFilters);
    } else {
      // Add a small delay to ensure everything is loaded for normal navigation
      const timer = setTimeout(() => {
        loadProducts();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [route?.params?.initialFilters]);


  // Check GlobalTix payment status when screen is focused
  useFocusEffect(
    useCallback(() => {
      const { paymentDataGlobal } = store.getState().globalTix;

      async function handleGlobalTixPaymentStatusCheck() {
        if (paymentDataGlobal) {
          try {
            const data = await checkGlobalTixPaymentStatus(
              paymentDataGlobal.record_ref_number,
              paymentDataGlobal.referenceNumber
            );

            if (data.payment_status === "Paid" || data.payment_status === "paid") {
              showMessage({
                message: t("Vouchers.giftCardPaymentSuccess"),
                type: "success",
              });
            } else {
              showMessage({
                message: t("Vouchers.giftCardPaymentFailure"),
                type: "danger",
              });
            }

            dispatch(setGlobalTixPaymentData(null));
          } catch (err) {
            console.log(err.message, "globaltix payment error");
          }
        }
      }

      handleGlobalTixPaymentStatusCheck();
    }, [])
  );

  // Handle screen focus with new parameters (e.g., navigating from UAE to Saudi Arabia)
  useFocusEffect(
    useCallback(() => {
      const initialFilters = route?.params?.initialFilters;
      if (initialFilters) {
        console.log("GlobalTix: Screen focused with new filters:", initialFilters);
        
        // Clear existing products immediately
        dispatch(setProducts([]));
        dispatch(setTotalProducts(0));
        dispatch(setHasMore(true));
        dispatch(setCurrentPage(1));
        dispatch(setLoading(true)); // Show loading state immediately
        
        // Apply new filters
        dispatch(setFilters(initialFilters));
        
        // Load products with new filters
        loadProducts(initialFilters);
      }
    }, [route?.params?.initialFilters])
  );


  const loadProducts = async (filterParams = null) => {
    try {
      // Use provided filters or fall back to Redux state
      const currentFilters = filterParams || filters;
      console.log("GlobalTix: Loading products with filters:", currentFilters);
      
      // Only set loading if not already loading (to avoid race conditions)
      if (!loading) {
        dispatch(setLoading(true));
      }
      
      // Load countries first
      const countriesResponse = await globalTixAPI.fetchCountries();
      if (countriesResponse.success) {
        dispatch(setCountries(countriesResponse.data));
      }
      
      // Load categories and cities for the selected country
      const [categoriesResponse, citiesResponse] = await Promise.all([
        globalTixAPI.fetchCategories({ countryCode: currentFilters.countryCode }),
        globalTixAPI.fetchCities({ countryCode: currentFilters.countryCode })
      ]);
      
      if (categoriesResponse.success) {
        dispatch(setCategories(categoriesResponse.data || []));
      } else {
        dispatch(setCategories([]));
      }
      
      if (citiesResponse.success) {
        dispatch(setCities(citiesResponse.data || []));
      } else {
        dispatch(setCities([]));
      }
      
      // Load products with the current filters
      const productsResponse = await globalTixAPI.fetchProducts({
        countryCode: currentFilters.countryCode,
        page: 1,
        categoryIds: currentFilters.categoryIds,
        cityIds: currentFilters.cityIds,
        searchText: currentFilters.searchText,
        lang: 'en'
      });
      
      
      if (productsResponse.success) {
        dispatch(setProducts(productsResponse.data));
        dispatch(setTotalProducts(productsResponse.size));
        dispatch(setHasMore(productsResponse.data.length === 16));
        dispatch(setCurrentPage(1));
        
        // Convert prices to QAR
        convertProductPrices(productsResponse.data);
        
        // Translate products if Arabic is selected
        if (currentLanguage === 'ar') {
          translateProducts(productsResponse.data);
        } else {
          setTranslatedProducts(productsResponse.data);
        }
      } else {
        // If no products found, ensure we clear the state
        dispatch(setProducts([]));
        dispatch(setTotalProducts(0));
        dispatch(setHasMore(false));
        dispatch(setCurrentPage(1));
        setTranslatedProducts([]);
      }
      
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  };

  // Translate products when Arabic is selected
  const translateProducts = async (productsList) => {
    if (!productsList || productsList.length === 0) {
      setTranslatedProducts([]);
      return;
    }

    try {
      setIsTranslating(true);
      console.log(`[GlobalTix] Starting translation of ${productsList.length} products to ${currentLanguage}`);
      
      // Translate products in smaller batches to avoid rate limits
      // Process 2 products at a time with delay between batches
      const batchSize = 2;
      const translated = [];
      
      for (let i = 0; i < productsList.length; i += batchSize) {
        const batch = productsList.slice(i, i + batchSize);
        console.log(`[GlobalTix] Translating batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(productsList.length/batchSize)}`);
        
        // Use Promise.allSettled for better error handling
        const batchResults = await Promise.allSettled(
          batch.map(product => translateProduct(product, currentLanguage))
        );
        
        const batchTranslations = batchResults.map((result, index) => {
          if (result.status === 'fulfilled') {
            const translated = result.value;
            console.log(`[GlobalTix] Translated: "${batch[index].name}" -> "${translated.name}"`);
            return translated;
          } else {
            console.error(`[GlobalTix] Error translating product ${batch[index].id}:`, result.reason);
            return batch[index]; // Return original on error
          }
        });
        
        translated.push(...batchTranslations);
        
        // Update UI progressively
        setTranslatedProducts([...translated]);
        
        // Add delay between batches to avoid rate limits (except for last batch)
        if (i + batchSize < productsList.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      console.log(`[GlobalTix] Translation complete. Translated ${translated.length} products`);
      setTranslatedProducts(translated);
    } catch (error) {
      console.error('[GlobalTix] Error translating products:', error);
      // Fallback to original products on error
      setTranslatedProducts(productsList);
    } finally {
      setIsTranslating(false);
    }
  };

  // Effect to re-translate when language changes
  useEffect(() => {
    if (products && products.length > 0) {
      if (currentLanguage === 'ar') {
        translateProducts(products);
      } else {
        setTranslatedProducts(products);
      }
    }
  }, [currentLanguage]);

  const convertProductPrices = async (productsList) => {
    const priceMap = {};
    
    // Test currency conversion first
    console.log('Testing currency conversion...');
    try {
      const testResult = await convertToQAR(100, 'SGD');
      console.log('Currency conversion test result:', testResult);
    } catch (error) {
      console.error('Currency conversion test failed:', error);
    }
    
    for (const product of productsList) {
      console.log(`Converting price for product ${product.id} (${product.name}):`, {
        originalPrice: product.originalPrice,
        fromPrice: product.fromPrice,
        currency: product.currency,
        category: product.category
      });
      
      if (product.originalPrice || product.fromPrice) {
        try {
          const convertedPrice = await convertToQAR(
            product.originalPrice || product.fromPrice, 
            product.currency || 'SGD'
          );
          console.log(`Successfully converted price for product ${product.id}:`, convertedPrice);
          priceMap[product.id] = convertedPrice;
        } catch (error) {
          console.error(`Error converting price for product ${product.id}:`, error);
          // Fallback to original price
          priceMap[product.id] = `${product.currency || 'SGD'} ${product.originalPrice || product.fromPrice}`;
        }
      } else {
        console.log(`Product ${product.id} has no price, setting to Free`);
        priceMap[product.id] = 'Free';
      }
    }
    
    console.log('Final price map:', priceMap);
    setConvertedPrices(priceMap);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const loadMoreProducts = async () => {
    if (!hasMore || loading || loadingMore) return;
    
    try {
      dispatch(setLoadingMore(true));
      const nextPage = Math.ceil(products.length / 16) + 1;
      
      // Load next page of products
      const productsResponse = await globalTixAPI.fetchProducts({
        countryCode: filters.countryCode,
        page: nextPage,
        categoryIds: filters.categoryIds,
        cityIds: filters.cityIds,
        searchText: filters.searchText,
        lang: 'en'
      });
      
      if (productsResponse.success && productsResponse.data.length > 0) {
        // Append new products to existing ones
        const updatedProducts = [...products, ...productsResponse.data];
        dispatch(setProducts(updatedProducts));
        dispatch(setHasMore(productsResponse.data.length === 16));
        dispatch(setCurrentPage(nextPage));
        
        // Convert prices for new products
        convertProductPrices(updatedProducts);
        
        // Translate new products if Arabic is selected
        if (currentLanguage === 'ar') {
          translateProducts(updatedProducts);
        } else {
          setTranslatedProducts(updatedProducts);
        }
      } else {
        dispatch(setHasMore(false));
      }
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoadingMore(false));
    }
  };

  const handleFiltersApply = (newFilters) => {
    dispatch(setFilters(newFilters));
    // Clear existing products before loading new ones
    dispatch(setProducts([]));
    dispatch(setTotalProducts(0));
    dispatch(setCurrentPage(1));
    dispatch(setHasMore(true));
    loadProducts(newFilters); // Re-fetch products with new filters
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => {
        // Navigate with just productId - ProductDetails will fetch the data
        navigation.navigate('ProductDetails', { 
          productId: item.id
        });
      }}
    >
      <SmartImage 
        imagePath={item.image}
        style={styles.productImage}
        placeholderText={`${item.name}\nNo Image Available`}
        onLoad={() => {}}
        onError={(error) => {}}
      />
      <View style={[styles.productInfo,isDark ? {backgroundColor:colors.borderGrey} : {backgroundColor:colors.white}]}>
        <TypographyText
          title={item.name}
          size={18}
          font={BALOO_SEMIBOLD}
          textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
          style={styles.productName}
          numberOfLines={2}
        />
        <View style={styles.productMeta}>
          <TypographyText
            title={`${item.city}, ${item.country}`}
            size={14}
            textColor={isDark ? colors.lightGrey : colors.darkGrey}
            style={styles.productLocation}
          />
          {/* <TypographyText
            title={convertedPrices[item.id] || 'Loading...'}
            size={14}
            font={BALOO_SEMIBOLD}
            textColor={colors.white}
            style={styles.productPrice}
          /> */}
        </View>
        <TypographyText
          title={item.category}
          size={14}
          font={BALOO_SEMIBOLD}
          textColor={colors.mainDarkMode}
          style={styles.productCategory}
        />
        <View style={styles.productFeatures}>
          {item.isGTRecommend && (
            <View style={styles.featureBadgeWrapper}>
              <View style={styles.recommendedBadge}>
                <TypographyText
                  title={t("GlobalTix.recommended")}
                  size={12}
                  font={BALOO_SEMIBOLD}
                  textColor={colors.black}
                />
              </View>
            </View>
          )}
          {item.isInstantConfirmation && (
            <View style={styles.featureBadgeWrapper}>
              <View style={styles.instantBadge}>
                <TypographyText
                  title={t("GlobalTix.instant")}
                  size={12}
                  font={BALOO_SEMIBOLD}
                  textColor={colors.white}
                />
              </View>
            </View>
          )}
          {item.isCancellable && (
            <View style={styles.featureBadgeWrapper}>
              <View style={styles.cancellableBadge}>
                <TypographyText
                  title={t("GlobalTix.cancellable")}
                  size={12}
                  font={BALOO_SEMIBOLD}
                  textColor={colors.white}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={isDark ? colors.mainDarkMode : colors.darkBlue} />
        <TypographyText
          title={t("GlobalTix.loadingMoreProducts")}
          size={14}
          textColor={isDark ? colors.lightGrey : colors.darkGrey}
          style={styles.loadingText}
        />
      </View>
    );
  };

  // Show error if any
  if (error) {
    Alert.alert(t("GlobalTix.error"), error, [
      { text: t("GlobalTix.ok"), onPress: () => dispatch(clearError()) }
    ]);
  }

 

  // Get header label from route params or fallback to "GlobalTix"
  const getHeaderLabel = () => {
    return route?.params?.parentCategoryName || "GlobalTix";
  };
  const noData = (
    <ListNoData
      text={t("GlobalTix.noProducts")}
    />
  );

  return (
    <MainLayout
    outsideScroll={true}
      headerChildren={
        <Header 
          label={getHeaderLabel()} 
          btns={["back","notifications"]}
          additionalBtnsProps={{
            cart: {
              onPress: () => navigation.navigate('GlobalTixCartScreen')
            }
          }}
        />
      }
      headerHeight={50}
      contentStyle={{ 
        height: SCREEN_HEIGHT - 120,paddingHorizontal: 20 }}
    >
      
      {/* Inline Filters */}
      {/* <GlobalTixInlineFilters onFiltersChange={handleFiltersApply} /> */}
      
      
      {loading || isTranslating ? (
        <FullScreenLoader />
      ) : (translatedProducts.length > 0 ? translatedProducts : products).length === 0 ? (
        noData
      ) : (
        <FlatList
          data={translatedProducts.length > 0 ? translatedProducts : products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          maxToRenderPerBatch={5}
          windowSize={SCREEN_HEIGHT}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[isDark ? colors.mainDarkMode : colors.darkBlue]}
              tintColor={isDark ? colors.mainDarkMode : colors.darkBlue}
            />
          }
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      )}


    </MainLayout>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 60,
  },
  productCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    ...mainStyles.lightShadow,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 16,
    backgroundColor:colors.borderGrey
  },
  productName: {
    marginBottom: 8,
    lineHeight: 24,
  },
  productMeta: {
    flexDirection: isRTL() ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    width: '100%',
  },
  productLocation: {
    flex: 1,
    marginRight: isRTL() ? 0 : 8,
    marginLeft: isRTL() ? 8 : 0,
    textAlign: isRTL() ? 'right' : 'left',
  },
  productPrice: {
    textAlign: isRTL() ? 'left' : 'right',
    flexShrink: 0,
  },
  productCategory: {
    marginBottom: 8,
  },
  productFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  featureBadgeWrapper: {
    marginRight: 12,
    marginBottom: 8,
    minWidth: 80,
  },
  recommendedBadge: {
    backgroundColor: colors.orange,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  instantBadge: {
    backgroundColor: colors.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cancellableBadge: {
    backgroundColor: colors.orange,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 10,
  },
});

export default GlobalTix;
