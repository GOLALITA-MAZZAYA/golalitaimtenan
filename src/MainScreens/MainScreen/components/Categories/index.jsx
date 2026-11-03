import { memo, useCallback, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image as RNImage, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../../components/ThemeProvider';
import { TypographyText } from '../../../../components/Typography';
import { LUSAIL_REGULAR } from '../../../../redux/types';
import { colors } from '../../../../components/colors';
import FullScreenLoader from '../../../../components/Loaders/FullScreenLoader';
import CategoriesFilter from './CategoriesFilter';
import { getParentCategories } from '../../../../redux/merchant/merchant-thunks';
import ListNoData from '../../../../components/ListNoData';
import { setCategoriesType } from '../../../../redux/merchant/merchant-actions';
import TintedSvg from '../../../../components/TintedSvg';
import { isEsimCategory } from '../../../ESim/esimUtils';
import { isEventsTicketsCategory } from '../../../../config/globalTix';
import { rewriteAssetUrl } from '../../../../utils/rewriteAssetUrl';
import { org } from '../../../../org/config';
import { getCachedLocalEsimDestinations } from '../../../../api/esim';
import { isRTL } from '../../../../../utils';

const ICON_CONTAINER_SIZE = 64;
const ICON_SIZE = 74;

const keyExtractor = item => String(item.id ?? item.name);

const MUMAYIZAT_CATEGORY_ID = 265;

const isVouchersCategory = category =>
  /voucher/i.test(category?.name || '') ||
  /قسائم|قسيمة/.test(category?.x_name_arabic || '');

const pickCategoryImage = item => {
  const candidates = [
    item.x_image_url_3,
    typeof item.image3 === 'string' ? item.image3 : null,
    item.x_image_url_4,
    item.x_gif_image,
    item.image_url,
    item.x_image_url_2,
  ].filter(value => typeof value === 'string' && value.trim());
  const svg = candidates.find(value => /\.svg(\?|$)/i.test(value));
  if (svg) {
    return rewriteAssetUrl(svg);
  }
  if (candidates[0]) {
    return rewriteAssetUrl(candidates[0]);
  }
  if (item?.id != null && Number.isFinite(Number(item.id))) {
    return `https://${org.baseUrl}/go/api/image/${item.id}/x_image3/partner.category`;
  }
  return undefined;
};

const CategoryItem = memo(({ item, isDark, language, onPress }) => {
  const { t } = useTranslation();
  const uri = pickCategoryImage(item);
  const isSvg = typeof uri === 'string' && uri.toLowerCase().endsWith('.svg');
  const tint = isDark ? colors.mainDarkMode : colors.darkBlue;
  const title = (language === 'ar' ? item.x_name_arabic : item.name) || item.name || item.x_name_arabic || '';
  const esim = isEsimCategory(item);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(item)}
      style={styles.listItem}
    >
      <View
        style={[
          styles.imageWrapper,
          {
            backgroundColor: isDark ? '#1C1C1E' : '#F5F5F7',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
          },
        ]}
      >
        {isSvg ? (
          <TintedSvg uri={uri} width={ICON_SIZE} height={ICON_SIZE} color={tint} />
        ) : uri ? (
          <RNImage
            style={styles.categoryImage}
            source={{ uri }}
            resizeMode="contain"
            tintColor={item.id === MUMAYIZAT_CATEGORY_ID ? undefined : tint}
          />
        ) : null}
        {esim ? (
          <View style={styles.newBadge}>
            <TypographyText
              title={t('MainScreen.new')}
              size={8}
              font={LUSAIL_REGULAR}
              textColor={colors.white}
              style={styles.newBadgeText}
            />
          </View>
        ) : null}
      </View>
      <View style={styles.titleContainer}>
        <TypographyText
          textColor={isDark ? colors.white : '#1C1C1E'}
          size={12}
          font={LUSAIL_REGULAR}
          title={title}
          style={styles.categoryName}
          numberOfLines={2}
          textBreakStrategy="simple"
          lineBreakStrategyIOS="none"
        />
      </View>
    </TouchableOpacity>
  );
});

const Categories = ({ ListHeaderComponent }) => {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { selectedCountry } = useSelector(state => state.globalReducer);
  const { categoriesType } = useSelector(state => state.merchantReducer);

  const parentCategories = useSelector(
    state => state.merchantReducer.parentCategories,
  );
  const loading = useSelector(
    state => state.merchantReducer.parentCategoriesLoading,
  );

  const language = i18n.language;

  useEffect(() => {
    if (categoriesType) {
      dispatch(getParentCategories(categoriesType));
    }
  }, [categoriesType, selectedCountry, dispatch]);

  useEffect(() => {
    const list = Array.isArray(parentCategories) ? parentCategories : [];
    if (categoriesType === 'global' && list.some(isEsimCategory)) {
      getCachedLocalEsimDestinations().catch(() => {});
    }
  }, [categoriesType, parentCategories]);


  const navigateToMerchant = useCallback(category => {
    console.log(category.id, 'id');

    if (isEsimCategory(category)) {
      navigation.navigate('ESim');
      return;
    }

    // The backend "Vouchers" tile opens the vouchers list directly, the same
    // way the drawer's Giftcards item opens only gift cards.
    if (isVouchersCategory(category)) {
      navigation.navigate('loyaltyPoints', {
        screen: 'loyaltyPoints-vouchers-list',
      });
      return;
    }

    if (category.id === 706) {
      navigation.navigate('merchants', {
        screen: 'premiumMerchants-list',
        params: { selectedCategory: null },
      })

      return
    };

    if (category.id === 707) {
      navigation.navigate('merchants', {
        screen: 'newMerchants-list',
        params: { selectedCategory: null },
      })

      return
    }

    if (category.id === 708) {
      navigation.navigate('ARMap', {
        screen: 'ARHowToUse'
      })

      return
    }


    if (category.id == 265) {
      navigation.navigate('MumayzInfo', {
        title: language === 'ar' ? category?.x_name_arabic : category.name,
      });
      return;
    }


    // Global country tiles always open the country screen (eSIM + banners live
    // there); any other leaf category goes straight to its merchant list.
    const isGlobalCountry =
      categoriesType === 'global' && !!category.x_country_code;

    if (!category.x_if_have_child_cat && !isGlobalCountry) {
      navigation.navigate('merchants', {
        screen: 'merchants-list',
        params: {
          filters: {
            category_id: category.id,
          },
          parentCategoryId: category?.parent_id?.[0],
          parentCategoryName:
            language === 'ar' ? category?.x_name_arabic : category.name,
          parentCategoryData: category,
        },
      });

      return;
    }


    navigation.navigate('categories', {
      screen: 'categories-child',

      params: {
        parentCategoryId: category.id,
        parentCategoryName:
          language === 'ar' ? category?.x_name_arabic : category.name,
        parentCategoryData: category
      },
    });
  }, [navigation, language, categoriesType]);

  const handleTypeChange = type => {
    dispatch(setCategoriesType(type));
  };

  // "Events & Tickets" is only a backend switch for the per-country entry
  // (see ChildCategories); it is not shown as a home tile.
  const data = (Array.isArray(parentCategories) ? parentCategories : []).filter(
    category => !isEventsTicketsCategory(category),
  );

  return (
    <FlatList
      key="categories-4-col"
      style={styles.wrapper}
      data={!loading ? data : []}
      initialNumToRender={16}
      maxToRenderPerBatch={16}
      windowSize={10}
      numColumns={4}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.contentContainerStyle}
      showsVerticalScrollIndicator={false}
      keyExtractor={keyExtractor}
      ListHeaderComponent={
        <View
          style={{
            flexDirection: isRTL() ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 16,
            marginBottom: 12,
          }}
        >
          <TypographyText
            title={t('Categories.title')}
            textColor={isDark ? colors.mainDarkMode : colors.black}
            size={20}
            font={LUSAIL_REGULAR}
            style={{ fontWeight: '700' }}
          />

          <CategoriesFilter onChange={handleTypeChange} type={categoriesType} />
        </View>
      }
      ListEmptyComponent={!loading ? <ListNoData /> : <FullScreenLoader />}
      renderItem={({ item }) => (
        <CategoryItem
          item={item}
          isDark={isDark}
          language={language}
          onPress={navigateToMerchant}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listItem: {
    flex: 1,
    alignItems: 'center',
    maxWidth: '25%',
    paddingHorizontal: 2,
  },
  titleContainer: {
    marginTop: 6,
    minHeight: 28,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  categoryName: {
    fontWeight: '600',
    width: 80,
    textAlign: 'center',
    lineHeight: 14,
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: ICON_CONTAINER_SIZE,
    height: ICON_CONTAINER_SIZE,
    borderRadius: ICON_CONTAINER_SIZE / 2,
    borderWidth: 1,
    overflow: 'hidden',
  },
  newBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: colors.darkBlue,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  newBadgeText: {
    fontWeight: '700',
  },
  categoryImage: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  contentContainerStyle: { paddingBottom: 100 },
});

export default Categories;