import { SafeAreaView, StyleSheet, View, FlatList, Image } from 'react-native';
import { useTheme } from '../../../components/ThemeProvider';
import { colors } from '../../../components/colors';
import { mainStyles } from '../../../styles/mainStyles';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { TypographyText } from '../../../components/Typography';
import { LUSAIL_REGULAR } from '../../../redux/types';
import { useRoute } from '@react-navigation/native';
import { isRTL } from '../../../../utils';
import { useEffect, useState } from 'react';
import FullScreenLoader from '../../../components/Loaders/FullScreenLoader';
import { useSelector } from 'react-redux';
import { getChildCategoriesById } from '../../../api/categories';
import Header from '../../../components/Header';
import { showMessage } from 'react-native-flash-message';
import { sized } from '../../../Svg';
import EsimSvg from '../../../assets/esim.svg';
import {
  openEsimPlans,
  resolveEsimDestinationForCategory,
} from '../../ESim/esimUtils';

const IMAGE_SIZE = 80;

const ChildCategories = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const {
    params: { parentCategoryId, parentCategoryName, parentCategoryData },
  } = useRoute();
  const { categoriesType, hasEsimCategory, parentCategories } = useSelector(
    state => state.merchantReducer,
  );

  // Country-level eSIM row only on Global, and only when backend exposed eSIM.
  const globalHasEsimCategory =
    categoriesType === 'global' && !!hasEsimCategory;

  const [childCategories, setChildCategories] = useState([]);
  const [esimDestination, setEsimDestination] = useState(null);
  const [loading, setLoading] = useState(false);

  const getChildCategories = async () => {
    try {
      setLoading(true);
      const data = await getChildCategoriesById(
        parentCategoryId,
        categoriesType,
      );

      const filteredChildCategories = (Array.isArray(data) ? data : []).filter(
        item => {
          if (
            item.parent_id?.[0] === 47 &&
            (item.id === 156 || item.id === 160)
          ) {
            return false;
          }

          return true;
        },
      );

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
    globalHasEsimCategory,
    parentCategoryId,
    parentCategoryName,
    parentCategories,
    parentCategoryData,
  ]);

  const navigateToMerchant = category => {
    if (category.isEsimEntry) {
      if (!category.esimDestination) {
        showMessage({
          message: t('ESim.unavailableForCountry'),
          type: 'warning',
        });
        return;
      }

      openEsimPlans(navigation, category.esimDestination);
      return;
    }

    if (category.parent_id?.[0] === 687) {
      navigation.navigate('Charities', {
        categoryId: category.id,
      });

      return;
    }

    if (category.isEventsAndTickets) {
      const countryCode =
        parentCategoryData?.x_country_code ||
        parentCategoryData?.country_code ||
        'AE';

      navigation.navigate('GlobalTix', {
        initialFilters: {
          countryCode,
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

    const categoryName =
      language === 'ar' ? category?.x_name_arabic : category.name;

    if (category.x_if_have_child_cat) {
      navigation.navigate('categories', {
        screen: 'categories-child',
        params: {
          parentCategoryId: category.id,
          parentCategoryName: categoryName,
          parentCategoryData: category,
        },
      });
      return;
    }

    navigation.navigate('merchants', {
      screen: 'merchants-list',
      params: {
        filters: {
          category_id: category.id,
        },
        parentCategoryId: category.id,
        parentCategoryName: categoryName || parentCategoryName,
      },
    });
  };

  const shouldShowEventsTickets = false;
  const eventsAndTicketsItem = shouldShowEventsTickets
    ? {
        id: 'events-and-tickets',
        name: 'Events & Tickets',
        x_name_arabic: 'الفعاليات والتذاكر',
        image3: require('../../../assets/Events&Tickets.png'),
        parent_id: childCategories[0]?.parent_id || [],
        isEventsAndTickets: true,
      }
    : null;

  const listData = [
    ...(globalHasEsimCategory
      ? [
          {
            id: 'esim-for-country',
            name: t('ESim.title'),
            x_name_arabic: t('ESim.title'),
            isEsimEntry: true,
            esimDestination,
          },
        ]
      : []),
    ...(eventsAndTicketsItem ? [eventsAndTicketsItem] : []),
    ...childCategories,
  ];

  const tint = isDark ? colors.mainDarkMode : colors.darkBlue;
  const SimIcon = sized(EsimSvg, 36, 36, tint);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? colors.darkBlue : colors.white,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Header label={parentCategoryName} />

        <FlatList
          data={loading ? [] : listData}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            marginTop: 16,
            paddingBottom: 60,
          }}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigateToMerchant(item)}
              style={[
                styles.listItem,
                { flexDirection: isRTL() ? 'row-reverse' : 'row' },
              ]}
            >
              <View
                style={[
                  styles.imageWrapper,
                  {
                    backgroundColor: isDark
                      ? colors.categoryGrey
                      : colors.white,
                  },
                ]}
              >
                {item.isEsimEntry ? (
                  <SimIcon />
                ) : (
                  <Image
                    style={[
                      styles.image,
                      {
                        tintColor: tint,
                      },
                    ]}
                    source={
                      item.isEventsAndTickets
                        ? item.image3
                        : { uri: item.image3 }
                    }
                    tintColor={tint}
                  />
                )}
              </View>
              <TypographyText
                textColor={isDark ? colors.white : colors.darkBlue}
                size={16}
                font={LUSAIL_REGULAR}
                title={language === 'ar' ? item.x_name_arabic : item.name}
                style={styles.categoryName}
                numberOfLines={1}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => <FullScreenLoader />}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  categoryName: {
    marginTop: 4,
    flex: 1,
    width: IMAGE_SIZE,
    fontWeight: '700',
    marginHorizontal: 30,
  },
  imageWrapper: {
    ...mainStyles.generalShadow,
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
  },
});

export default ChildCategories;
