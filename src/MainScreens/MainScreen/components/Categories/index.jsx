import { memo, useCallback } from 'react';
import { StyleSheet, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../../../components/ThemeProvider';
import { TypographyText } from '../../../../components/Typography';
import { LUSAIL_REGULAR } from '../../../../redux/types';
import { colors } from '../../../../components/colors';
import { useNavigation } from '@react-navigation/native';
import FullScreenLoader from '../../../../components/Loaders/FullScreenLoader';
import CategoriesFilter from './CategoriesFilter';
import { getParentCategories } from '../../../../redux/merchant/merchant-thunks';
import ListNoData from '../../../../components/ListNoData';
import { setCategoriesType } from '../../../../redux/merchant/merchant-actions';
import useUpdateEffect from '../../../../hooks/useUpdateEffect';
import { isEsimCategory } from '../../../ESim/esimUtils';
import { sized } from '../../../../Svg';
import EsimSvg from '../../../../assets/esim.svg';
import { pickCategoryImage } from '../../../../utils/rewriteAssetUrl';

const IMAGE_SIZE = 70;

const getCategoryTitle = (item, language) => {
  const name = language === 'ar' ? item.x_name_arabic : item.name;

  if (!name) {
    return '';
  }

  if (name.includes('\n')) {
    return name;
  }

  const words = name.split(' ');

  if (words.length === 2) {
    return `${words[0]}\n${words[1]}`;
  }

  if (words.length === 3) {
    if (words[0].length > words[2].length) {
      return `${words[0]}\n${words.slice(1).join(' ')}`;
    }
    return `${words[0]} ${words[1]}\n${words[2]}`;
  }

  return words.join(' ');
};

const CategoryGridItem = memo(function CategoryGridItem({
  item,
  isDark,
  language,
  onPress,
  newLabel,
}) {
  const source = {
    uri: pickCategoryImage(item),
  };
  const esim = isEsimCategory(item);
  const tint = isDark ? colors.mainDarkMode : colors.darkBlue;
  const SimIcon = sized(EsimSvg, 36, 36, tint);

  return (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.listItem}>
      <View
        style={[
          styles.imageWrapper,
          {
            backgroundColor: isDark
              ? colors.categoryGrey
              : colors.highlatedGrey,
          },
        ]}
      >
        {esim ? (
          <SimIcon />
        ) : (
          <Image
            style={[
              styles.categoryImage,
              {
                tintColor: tint,
              },
            ]}
            source={source}
            tintColor={tint}
          />
        )}
        {esim ? (
          <View style={styles.newBadge}>
            <TypographyText
              title={newLabel}
              size={8}
              font={LUSAIL_REGULAR}
              textColor={colors.white}
              style={styles.newBadgeText}
            />
          </View>
        ) : null}
      </View>
      <TypographyText
        textColor={isDark ? colors.white : '#000'}
        size={15}
        font={LUSAIL_REGULAR}
        title={getCategoryTitle(item, language)}
        style={styles.categoryName}
        numberOfLines={2}
        textBreakStrategy="simple"
        lineBreakStrategyIOS="none"
      />
    </TouchableOpacity>
  );
});

const Categories = () => {
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

  useUpdateEffect(() => {
    if (categoriesType) {
      dispatch(getParentCategories(categoriesType));
    }
  }, [categoriesType, selectedCountry]);

  const navigateToMerchant = useCallback(
    category => {
      if (isEsimCategory(category)) {
        navigation.navigate('ESim');
        return;
      }

      if (category.id == 265) {
        navigation.navigate('MumayzInfo', {
          params: {
            title: language === 'ar' ? category?.x_name_arabic : category.name,
          },
        });
        return;
      }

      if (category.id == 708) {
        navigation.navigate('ARMap', {
          screen: 'ARHowToUse',
        });
        return;
      }

      if (category.id == 706) {
        navigation.navigate('merchants', {
          screen: 'premiumMerchants-list',
          params: { selectedCategory: null },
        });
        return;
      }

      if (category.id == 707) {
        navigation.navigate('merchants', {
          screen: 'newMerchants-list',
          params: { selectedCategory: null },
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
            parentCategoryId: category.id,
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
          parentCategoryData: category,
        },
      });
    },
    [language, navigation, categoriesType],
  );

  const handleTypeChange = type => {
    dispatch(setCategoriesType(type));
  };

  const data = Array.isArray(parentCategories) ? parentCategories : [];
  const showInitialLoader = loading && data.length === 0;
  const newLabel = t('MainScreen.new');

  const keyExtractor = useCallback(
    item => String(item.id ?? item.name),
    [],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <CategoryGridItem
        item={item}
        isDark={isDark}
        language={language}
        onPress={navigateToMerchant}
        newLabel={newLabel}
      />
    ),
    [isDark, language, navigateToMerchant, newLabel],
  );

  return (
    <View
      style={{
        ...styles.wrapper,
        backgroundColor: isDark ? colors.darkBlue : colors.white,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TypographyText
          title={t('Categories.title')}
          textColor={isDark ? colors.mainDarkMode : colors.black}
          size={24}
          font={LUSAIL_REGULAR}
        />

        <CategoriesFilter onChange={handleTypeChange} type={categoriesType} />
      </View>

      <FlatList
        style={styles.list}
        data={data}
        numColumns={3}
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          showInitialLoader ? <FullScreenLoader /> : <ListNoData />
        }
        removeClippedSubviews
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={5}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: 200,
    minWidth: '100%',
    marginTop: 25,
  },
  list: {
    marginTop: 16,
    paddingBottom: 40,
  },
  listItem: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    borderRadius: 32,
  },
  categoryName: {
    marginTop: 4,
    fontWeight: '700',
    textAlign: 'center',
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 46,
  },
  categoryImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 32,
    resizeMode: 'contain',
  },
  newBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.red,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 28,
    alignItems: 'center',
  },
  newBadgeText: {
    fontWeight: '700',
  },
  contentContainerStyle: { flexGrow: 1, paddingBottom: 60 },
});

export default Categories;
