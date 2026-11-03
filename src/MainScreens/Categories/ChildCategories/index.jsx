import { SafeAreaView, StyleSheet, View, FlatList } from 'react-native';
import Image from "../../../components/AppImage";
import { useTheme } from '../../../components/ThemeProvider';
import { colors } from '../../../components/colors';
import { mainStyles } from '../../../styles/mainStyles';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { TypographyText } from '../../../components/Typography';
import { LUSAIL_REGULAR } from '../../../redux/types';
import { useRoute } from '@react-navigation/native';
import { isRTL } from '../../../../utils';
import { useEffect, useRef, useState } from 'react';
import FullScreenLoader from '../../../components/Loaders/FullScreenLoader';
import ListNoData from '../../../components/ListNoData';
import { useDispatch, useSelector } from 'react-redux';
import { getChildCategoriesById } from '../../../api/categories';
import Header from '../../../components/Header';
import AdwertSwiper from '../../../components/AdwertSwiper/AdwertSwiper';
import { getCountryBanners } from '../../../redux/merchant/merchant-thunks';
import { getCountryMarketingPopups } from '../../../redux/global/global-thunks';
import MarketingPopupModal from '../../../components/MarketingPopupModal/MarketingPopupModal';
import useBannerPress from '../../../hooks/useBannerPress';
import TintedSvg from '../../../components/TintedSvg';
import { showMessage } from 'react-native-flash-message';
import ArrowSvg from '../../../assets/arrow_right.svg';
import EsimSvg from '../../../assets/esim.svg';
import { sized } from '../../../Svg';
import {
  isEsimCategory,
  openEsimPlans,
  resolveEsimDestinationForCategory,
} from '../../ESim/esimUtils';
import { isEventsTicketsCategory } from '../../../config/globalTix';

// rowItem: paddingVertical 14*2 + iconWrapper height 60 (tallest child) + borderBottomWidth 1
const ITEM_HEIGHT = 89;

const GRID_COLUMNS = 4;
const GRID_ICON_CONTAINER_SIZE = 64;
const GRID_ICON_SIZE = 74;

const getItemLayout = (data, index) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

const ChildCategories = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const {
    params: {
      parentCategoryId,
      parentCategoryName,
      parentCategoryData,
      preloadedChildren,
    },
  } = useRoute();
  const { categoriesType, parentCategories } = useSelector(
    state => state.merchantReducer,
  );
  const globalHasEsimCategory =
    categoriesType === 'global' &&
    (Array.isArray(parentCategories) ? parentCategories : []).some(
      isEsimCategory,
    );

  const globalHasEventsTicketsCategory =
    categoriesType === 'global' &&
    (Array.isArray(parentCategories) ? parentCategories : []).some(
      isEventsTicketsCategory,
    );

  const [childCategories, setChildCategories] = useState([]);
  const [esimDestination, setEsimDestination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countryBanners, setCountryBanners] = useState([]);
  const [countryPopups, setCountryPopups] = useState(null);
  const dispatch = useDispatch();
  const countryCode = parentCategoryData?.x_country_code;
  const handleBannerPress = useBannerPress({ pageName: 'global_country' });

  useEffect(() => {
    if (!countryCode) {
      setCountryBanners([]);
      return;
    }

    let mounted = true;
    dispatch(getCountryBanners(countryCode)).then(banners => {
      if (mounted) {
        setCountryBanners(Array.isArray(banners) ? banners : []);
      }
    });

    return () => {
      mounted = false;
    };
  }, [countryCode, dispatch]);

  useEffect(() => {
    if (!countryCode) {
      setCountryPopups(null);
      return;
    }

    let mounted = true;
    dispatch(getCountryMarketingPopups(countryCode)).then(popups => {
      if (mounted) {
        setCountryPopups(popups.length > 0 ? popups : null);
      }
    });

    return () => {
      mounted = false;
    };
  }, [countryCode, dispatch]);

  const getChildCategories = async () => {
    try {
      setLoading(true);

      // Already fetched by the previous level's tap (see openCategory below).
      const data = Array.isArray(preloadedChildren)
        ? preloadedChildren
        : await getChildCategoriesById(parentCategoryId, categoriesType);
      console.log("getChildCategoriesgetChildCategories******:", data)
      const list = Array.isArray(data) ? data : [];
      const filteredChildCategories = list.filter(item => {
        if (item.parent_id?.[0] === 47 && (item.id === 156 || item.id === 160)) {
          return false;
        }

        return true;
      });

      setChildCategories(filteredChildCategories);
    } catch (err) {
      console.log(err, 'err');
      setChildCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChildCategories();
  }, [parentCategoryId, categoriesType]);

  useEffect(() => {
    if (!globalHasEsimCategory) {
      setEsimDestination(null);
      return;
    }

    let mounted = true;
    const category =
      parentCategoryData || {
        name: parentCategoryName,
      };

    resolveEsimDestinationForCategory(category)
      .then(destination => {
        if (mounted) {
          setEsimDestination(destination);
        }
      })
      .catch(() => {
        if (mounted) {
          setEsimDestination(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, [
    globalHasEsimCategory,
    parentCategoryId,
    parentCategoryName,
    parentCategoryData,
  ]);

  const isOpeningCategory = useRef(false);

  const pushChildLevel = (category, children) => {
    navigation.push('categories-child', {
      parentCategoryId: category.id,
      parentCategoryName:
        language === 'ar' ? category?.x_name_arabic : category.name,
      parentCategoryData: category,
      preloadedChildren: children,
    });
  };

  const openMerchantList = category => {
    navigation.navigate('merchants', {
      screen: 'merchants-list',
      params: {
        filters: {
          category_id: category.id,
        },
        parentCategoryId: category?.parent_id?.[0],
        parentCategoryName,
      },
    });
  };

  // /child/category/v2's `has_sub_category` isn't reliable (e.g. K.S.A ->
  // Hotels 710 reports false but has children), so look for children
  // ourselves: any -> next level, none -> merchant list.
  const openCategory = async category => {
    if (isOpeningCategory.current) {
      return;
    }
    isOpeningCategory.current = true;

    try {
      const children = await getChildCategoriesById(category.id, categoriesType);
      if (Array.isArray(children) && children.length > 0) {
        pushChildLevel(category, children);
        return;
      }
    } catch (err) {
      // No children (endpoint throws on empty result) or request failed —
      // fall through to the merchant list, same as before this check existed.
    } finally {
      isOpeningCategory.current = false;
    }

    openMerchantList(category);
  };

  const navigateToMerchant = (category) => {
    if (category.isEsimEntry) {
      if (!category.esimDestination) {
        showMessage({
          message: t('ESim.unavailableForCountry'),
          type: 'warning',
        });
        return;
      }

      openEsimPlans(navigation, {
        ...category.esimDestination,
        name_ar:
          category.esimDestination.name_ar ||
          parentCategoryData?.x_name_arabic,
      });
      return;
    }

    if (category.parent_id?.[0] === 687) {
      navigation.navigate('Charities', {
        categoryId: category.id,
      });

      return;
    }

    if (category.isEventsAndTickets) {
      const countryCode = getCountryCodeFromParent(category.parent_id?.[0]);

      if (!countryCode) {
        showMessage({
          message: t('GlobalTix.countryUnavailable'),
          type: 'warning',
        });
        return;
      }

      navigation.navigate('GlobalTix', {
        initialFilters: {
          countryCode: countryCode,
          categoryIds: undefined,
          cityIds: undefined,
        },
        parentCategoryName: language === 'ar' ? parentCategoryData?.x_name_arabic : parentCategoryData?.name,
      });
      return;
    }

    openCategory(category);
  };

  const getCountryCodeFromParent = (parentId) => {
    if (parentCategoryData?.x_country_code) {
      return parentCategoryData.x_country_code;
    }
    console.warn(`Missing x_country_code for category ${parentId}`);
    return null;
  };

  const filteredChildCategories = childCategories.filter((item) => {
    if (item.parent_id?.[0] === 47 && (item.id === 156 || item.id === 160)) {
      return false;
    }

    return true;
  });

  // Home-style grid only on a Global country screen (2nd level, e.g. K.S.A);
  // deeper levels (e.g. K.S.A -> Hotels) keep the original row list.
  const isGrid = Boolean(countryCode);

  const shouldShowEventsTickets =
    globalHasEventsTicketsCategory && parentCategoryData?.x_country_code;

  // TEMP [EventsTickets] debug — remove after diagnosing live.
  console.log(
    `[EventsTickets] country screen: type=${categoriesType} parent=${parentCategoryId} cc=${countryCode || 'NONE'} parentCount=${Array.isArray(parentCategories) ? parentCategories.length : 'null'} hasCategory=${globalHasEventsTicketsCategory} show=${Boolean(shouldShowEventsTickets)}`,
  );

  let categoriesWithEventsTickets = filteredChildCategories;

  if (shouldShowEventsTickets) {
    const eventsAndTicketsItem = {
      id: 'events-and-tickets',
      name: 'Events & Tickets',
      x_name_arabic: 'الفعاليات والتذاكر',
      image3: require('../../../assets/Events&Tickets.png'),
      parent_id: childCategories[0]?.parent_id || [],
      isEventsAndTickets: true,
    };

    categoriesWithEventsTickets = [eventsAndTicketsItem, ...filteredChildCategories];
  }

  if (globalHasEsimCategory && esimDestination) {
    const esimItem = {
      id: 'esim-for-country',
      name: t('ESim.title'),
      x_name_arabic: t('ESim.title'),
      isEsimEntry: true,
      esimDestination,
    };
    categoriesWithEventsTickets = [esimItem, ...categoriesWithEventsTickets];
  }

  const tint = isDark ? colors.mainDarkMode : colors.darkBlue;

  const getItemTitle = item =>
    item.isEsimEntry
      ? t('ESim.title')
      : language === 'ar'
        ? item.x_name_arabic
        : item.name;

  const renderItemIcon = (item, { size, localImageSize, esimSize }) => {
    const uri = item.isEventsAndTickets || item.isEsimEntry ? null : item.image3;
    const isSvg = typeof uri === 'string' && uri.toLowerCase().endsWith('.svg');

    if (item.isEsimEntry) {
      const SimIcon = sized(EsimSvg, esimSize, esimSize, tint);
      return <SimIcon />;
    }

    if (isSvg) {
      return <TintedSvg uri={uri} width={size} height={size} color={tint} />;
    }

    const imageSize = item.isEventsAndTickets ? localImageSize : size;
    return (
      <Image
        style={{ width: imageSize, height: imageSize }}
        source={item.isEventsAndTickets ? item.image3 : { uri: uri || undefined }}
        tintColor={tint}
        contentFit="contain"
      />
    );
  };

  // Same tile as the Home screen's Local grid
  // (MainScreen/components/Categories/index.jsx).
  const renderGridItem = item => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigateToMerchant(item)}
      style={styles.gridItem}
    >
      <View
        style={[
          styles.gridIconWrapper,
          {
            backgroundColor: isDark ? '#1C1C1E' : '#F5F5F7',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
          },
        ]}
      >
        {renderItemIcon(item, {
          size: GRID_ICON_SIZE,
          localImageSize: 44,
          esimSize: 30,
        })}
      </View>
      <View style={styles.gridTitleContainer}>
        <TypographyText
          textColor={isDark ? colors.white : '#1C1C1E'}
          size={12}
          font={LUSAIL_REGULAR}
          title={getItemTitle(item)}
          style={styles.gridCategoryName}
          numberOfLines={2}
          textBreakStrategy="simple"
          lineBreakStrategyIOS="none"
        />
      </View>
    </TouchableOpacity>
  );

  const renderRowItem = item => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigateToMerchant(item)}
      style={[
        styles.rowItem,
        {
          borderBottomColor: isDark
            ? 'rgba(255, 255, 255, 0.06)'
            : 'rgba(0, 0, 0, 0.06)',
          flexDirection: isRTL() ? 'row-reverse' : 'row',
        },
      ]}
    >
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: isDark
              ? 'rgba(221, 189, 107, 0.12)'
              : 'rgba(162, 148, 117, 0.09)',
          },
        ]}
      >
        {renderItemIcon(item, { size: 42, localImageSize: 42, esimSize: 28 })}
      </View>

      <TypographyText
        textColor={isDark ? colors.white : '#1C1C1E'}
        size={16}
        font={LUSAIL_REGULAR}
        title={getItemTitle(item)}
        style={styles.categoryName}
        numberOfLines={1}
      />

      <ArrowSvg
        color={isDark ? '#71717A' : '#A1A1AA'}
        width={18}
        height={18}
        style={{ transform: [{ rotate: isRTL() ? '180deg' : '0deg' }] }}
      />
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: isDark ? colors.darkModeBackground : colors.white,
        },
      ]}
    >
      <SafeAreaView style={styles.safeArea}>
        <Header
          label={parentCategoryName}
          btns={['back']}
        />

        <FlatList
          key={isGrid ? 'child-categories-grid' : 'child-categories-rows'}
          data={categoriesWithEventsTickets}
          keyExtractor={(item) => String(item.id)}
          numColumns={isGrid ? GRID_COLUMNS : 1}
          columnWrapperStyle={isGrid ? styles.gridColumnWrapper : undefined}
          getItemLayout={isGrid ? undefined : getItemLayout}
          contentContainerStyle={
            isGrid ? styles.gridContent : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            countryCode && countryBanners.length > 0 ? (
              <AdwertSwiper
                data={countryBanners}
                onBannerPress={handleBannerPress}
                isDark={isDark}
                style={[
                  styles.banner,
                  {
                    borderColor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.05)',
                  },
                ]}
              />
            ) : null
          }
          renderItem={({ item }) =>
            isGrid ? renderGridItem(item) : renderRowItem(item)
          }
          ListEmptyComponent={() =>
            loading ? <FullScreenLoader /> : <ListNoData />
          }
        />
      </SafeAreaView>

      {!!countryCode && (
        <MarketingPopupModal
          popups={countryPopups}
          onClose={() => setCountryPopups(null)}
          pageName="global_country"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    flex: 1,
    marginHorizontal: 16,
    fontWeight: '700',
  },
  banner: {
    marginBottom: 20,
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
  },
  gridContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  gridColumnWrapper: {
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  gridItem: {
    width: '25%',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  gridIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: GRID_ICON_CONTAINER_SIZE,
    height: GRID_ICON_CONTAINER_SIZE,
    borderRadius: GRID_ICON_CONTAINER_SIZE / 2,
    borderWidth: 1,
    overflow: 'hidden',
  },
  gridTitleContainer: {
    marginTop: 6,
    minHeight: 28,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  gridCategoryName: {
    fontWeight: '600',
    width: 80,
    textAlign: 'center',
    lineHeight: 14,
  },
});

export default ChildCategories;
