import { StyleSheet, View, Image, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
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
import { useEffect } from 'react';
import { isEsimCategory } from '../../../ESim/esimUtils';
import { getCachedLocalEsimDestinations } from '../../../../api/esim';
import { sized } from '../../../../Svg';
import EsimSvg from '../../../../assets/esim.svg';

const IMAGE_SIZE = 70;

const Categories = () => {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { selectedCountry } = useSelector(state => state.globalReducer);
  const { categoriesType, hasEsimCategory } = useSelector(
    state => state.merchantReducer,
  );

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

  useEffect(() => {
    if (categoriesType === 'global' && hasEsimCategory) {
      getCachedLocalEsimDestinations().catch(() => {});
    }
  }, [categoriesType, hasEsimCategory]);

  const navigateToMerchant = category => {
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

    if (!category.x_if_have_child_cat) {
      navigation.navigate('merchants', {
        screen: 'merchants-list',
        params: {
          filters: {
            category_id: category.id,
          },
          parentCategoryId: category.id,
          parentCategoryName:
            language === 'ar' ? category?.x_name_arabic : category.name,
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
  };

  const handleTypeChange = type => {
    dispatch(setCategoriesType(type));
  };

  const getCategoryTitle = item => {
    const name = language === 'ar' ? item.x_name_arabic : item.name;

    // If the name already contains a newline (e.g., "South Korea\n🇰🇷"), return it as-is
    if (name.includes('\n')) {
      return name;
    }

    // Otherwise, apply the word-splitting logic
    const words = name.split(' ');

    if (words.length === 2) {
      // If there are two words, place the second word in the second line
      return `${words[0]}\n${words[1]}`;
    } else if (words.length === 3) {
      // If there are three words, apply the logic based on word lengths
      if (words[0].length > words[2].length) {
        return `${words[0]}\n${words.slice(1).join(' ')}`;
      } else {
        return `${words[0]} ${words[1]}\n${words[2]}`;
      }
    } else {
      // Default behavior for other cases
      return words.join(' ');
    }
  };

  const data = parentCategories ? [...parentCategories] : [];


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
        data={!loading ? data : []}
        numColumns={3}
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.name}
        ListEmptyComponent={!loading ? <ListNoData /> : <FullScreenLoader />}
        renderItem={({ item }) => {
          const source = {
            uri: item.image3 || undefined,
          };
          const esim = isEsimCategory(item);
          const tint = isDark ? colors.mainDarkMode : colors.darkBlue;
          const SimIcon = sized(EsimSvg, 36, 36, tint);

          return (
            <TouchableOpacity
              onPress={() => navigateToMerchant(item)}
              style={styles.listItem}
            >
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
                      title={t('MainScreen.new')}
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
                title={getCategoryTitle(item)}
                style={styles.categoryName}
                numberOfLines={2}
                textBreakStrategy="simple"
                lineBreakStrategyIOS="none"
              />
            </TouchableOpacity>
          );
        }}
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
    marginTop: 20,
  },
  listItem: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    borderRadius: 32,
    //backgroundColor:'red'
  },
  categoryName: {
    marginTop: 4,
    fontWeight: '700',
    textAlign: 'center'
  },
  list: {
    marginTop: 16,
    paddingBottom: 40,
  },
  imageWrapper: {
    //flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    // ...mainStyles.generalShadow,
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 46,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 32,
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