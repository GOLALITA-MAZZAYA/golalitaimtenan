import { SafeAreaView, StyleSheet, View, FlatList, Image } from 'react-native';
import { useTheme } from '../../../components/ThemeProvider';
import { colors } from '../../../components/colors';
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
import useBannerPress from '../../../hooks/useBannerPress';
import TintedSvg from '../../../components/TintedSvg';
import { showMessage } from 'react-native-flash-message';
import ArrowSvg from '../../../assets/arrow_right.svg';
import EsimSvg from '../../../assets/esim.svg';
import { sized } from '../../../Svg';
import {
  openEsimPlans,
  resolveEsimDestinationForCategory,
  isEsimCategory,
} from '../../ESim/esimUtils';
import {
  pickCategoryImage,
  withRewrittenCategoryImages,
} from '../../../utils/rewriteAssetUrl';

// rowItem: paddingVertical 14*2 + iconWrapper height 60 + borderBottomWidth 1
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
  const { categoriesType, hasEsimCategory, parentCategories } = useSelector(
    state => state.merchantReducer,
  );

  // Country eSIM row only when Global home is also showing the eSIM tile
  // (API returned category 709 for type=global — mirrored in hasEsimCategory /
  // parentCategories).
  const homeShowsEsim =
    (Array.isArray(parentCategories) ? parentCategories : []).some(
      isEsimCategory,
    ) || !!hasEsimCategory;
  const showCountryEsim = categoriesType === 'global' && homeShowsEsim;

  const [childCategories, setChildCategories] = useState([]);
  const [esimDestination, setEsimDestination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countryBanners, setCountryBanners] = useState([]);
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

  const getChildCategories = async () => {
    try {
      setLoading(true);

      const data = Array.isArray(preloadedChildren)
        ? preloadedChildren
        : await getChildCategoriesById(parentCategoryId, categoriesType);

      const list = withRewrittenCategoryImages(
        Array.isArray(data) ? data : [],
      );
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
    if (!showCountryEsim) {
      setEsimDestination(null);
      return;
    }

    const parentFromStore = (
      Array.isArray(parentCategories) ? parentCategories : []
    ).find(item => Number(item?.id) === Number(parentCategoryId));

    let mounted = true;
    resolveEsimDestinationForCategory({
      id: parentCategoryId,
      name: parentFromStore?.name || parentCategoryName || parentCategoryData?.name,
      x_name_arabic:
        parentFromStore?.x_name_arabic || parentCategoryData?.x_name_arabic,
      parentCategoryName,
      country_code:
        parentFromStore?.x_country_code ||
        parentFromStore?.country_code ||
        parentCategoryData?.x_country_code ||
        parentCategoryData?.country_code,
      x_country_code:
        parentFromStore?.x_country_code ||
        parentFromStore?.country_code ||
        parentCategoryData?.x_country_code ||
        parentCategoryData?.country_code,
    })
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
    showCountryEsim,
    parentCategoryId,
    parentCategoryName,
    parentCategories,
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

  // /child/category/v2's `has_sub_category` isn't reliable, so look for children
  // ourselves: any -> next level, none -> merchant list.
  const openCategory = async category => {
    if (isOpeningCategory.current) {
      return;
    }
    isOpeningCategory.current = true;

    try {
      const children = await getChildCategoriesById(category.id, categoriesType);
      if (Array.isArray(children) && children.length > 0) {
        pushChildLevel(category, withRewrittenCategoryImages(children));
        return;
      }
    } catch (err) {
      // No children or request failed — fall through to merchant list.
    } finally {
      isOpeningCategory.current = false;
    }

    openMerchantList(category);
  };

  const getCountryCodeFromParent = parentId => {
    if (parentCategoryData?.x_country_code) {
      return parentCategoryData.x_country_code;
    }
    console.warn(`Missing x_country_code for category ${parentId}`);
    return null;
  };

  const navigateToMerchant = category => {
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
      const eventsCountryCode = getCountryCodeFromParent(
        category.parent_id?.[0],
      );

      if (!eventsCountryCode) {
        showMessage({
          message: t('GlobalTix.countryUnavailable'),
          type: 'warning',
        });
        return;
      }

      navigation.navigate('GlobalTix', {
        initialFilters: {
          countryCode: eventsCountryCode,
          categoryIds: undefined,
          cityIds: undefined,
        },
        parentCategoryName:
          language === 'ar'
            ? parentCategoryData?.x_name_arabic
            : parentCategoryData?.name,
      });
      return;
    }

    openCategory(category);
  };

  // Home-style grid only on a Global country screen (2nd level, e.g. K.S.A);
  // deeper levels keep the original row list.
  const isGrid = Boolean(countryCode);

  const shouldShowEventsTickets = parentCategoryData?.x_country_code;

  let categoriesWithEventsTickets = childCategories;

  if (shouldShowEventsTickets) {
    const eventsAndTicketsItem = {
      id: 'events-and-tickets',
      name: 'Events & Tickets',
      x_name_arabic: 'الفعاليات والتذاكر',
      image3: require('../../../assets/Events&Tickets.png'),
      parent_id: childCategories[0]?.parent_id || [],
      isEventsAndTickets: true,
    };

    categoriesWithEventsTickets = [
      eventsAndTicketsItem,
      ...childCategories,
    ];
  }

  if (showCountryEsim && esimDestination) {
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
    const uri =
      item.isEventsAndTickets || item.isEsimEntry
        ? null
        : pickCategoryImage(item);
    const isSvg =
      typeof uri === 'string' && uri.toLowerCase().endsWith('.svg');

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
        style={{ width: imageSize, height: imageSize, resizeMode: 'contain' }}
        source={
          item.isEventsAndTickets ? item.image3 : { uri: uri || undefined }
        }
        tintColor={tint}
      />
    );
  };

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
            backgroundColor: isDark ? colors.categoryGrey : colors.highlatedGrey,
            borderColor: isDark
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.05)',
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
          textColor={isDark ? colors.white : colors.darkBlue}
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
              ? colors.categoryGrey
              : colors.highlatedGrey,
          },
        ]}
      >
        {renderItemIcon(item, { size: 42, localImageSize: 42, esimSize: 28 })}
      </View>

      <TypographyText
        textColor={isDark ? colors.white : colors.darkBlue}
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
          backgroundColor: isDark ? colors.darkBlue : colors.white,
        },
      ]}
    >
      <SafeAreaView style={styles.safeArea}>
        <Header label={parentCategoryName} btns={['back']} />

        <FlatList
          key={isGrid ? 'child-categories-grid' : 'child-categories-rows'}
          data={loading ? [] : categoriesWithEventsTickets}
          keyExtractor={item => String(item.id)}
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
