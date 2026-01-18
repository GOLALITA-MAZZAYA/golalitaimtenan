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

const IMAGE_SIZE = 70;

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

  const navigateToMerchant = category => {
    if (category.id == 265) {
      navigation.navigate('MumayzInfo', {
        params: {
          title: language === 'ar' ? category?.x_name_arabic : category.name,
        },
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
          parentCategoryId: category?.parent_id?.[0],
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
      },
    });
  };

  const handleTypeChange = type => {
    dispatch(setCategoriesType(type));
  };

  const getCategoryTitle = item => {
    const words = (language === 'ar' ? item.x_name_arabic : item.name).split(
      ' ',
    );

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

  return null;

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
        data={!loading ? parentCategories : []}
        numColumns={3}
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.name}
        ListEmptyComponent={!loading ? <ListNoData /> : <FullScreenLoader />}
        renderItem={({ item }) => {
          const source =
            item.id === 'vouchers'
              ? require('../../assets/vouchers.png')
              : {
                  uri: item.image3 || undefined,
                };

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
                <Image
                  style={[
                    styles.categoryImage,
                    {
                      tintColor: isDark ? colors.mainDarkMode : colors.darkBlue,
                    },
                  ]}
                  source={source}
                  tintColor={isDark ? colors.mainDarkMode : colors.darkBlue}
                />
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
    flex: 1,
    width: '100%',
    fontWeight: '700',
    width: 100,
    textAlign: 'center',
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
  contentContainerStyle: { flexGrow: 1, paddingBottom: 60 },
});

export default Categories;
