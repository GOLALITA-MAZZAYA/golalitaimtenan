import { SafeAreaView, StyleSheet, View, FlatList, Image } from 'react-native';
import CommonHeader from '../../../components/CommonHeader/CommonHeader';
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
const IMAGE_SIZE = 80;

const ChildCategories = ({ navigation }) => {
  const { isDark } = useTheme();
  const { i18n } = useTranslation();
  const language = i18n.language;
  const {
    params: { parentCategoryId, parentCategoryName, parentCategoryData },
  } = useRoute();
  const { categoriesType } = useSelector(state => state.merchantReducer);

  const [childCategories, setChildCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const getChildCategories = async () => {
    try {
      setLoading(true);

      const data = await getChildCategoriesById(
        parentCategoryId,
        categoriesType,
      );

      const filteredChildCategories = data.filter(item => {
        if (item.parent_id[0] === 47 && (item.id === 156 || item.id === 160)) {
          return false;
        }

        return true;
      });

      setChildCategories(filteredChildCategories);
    } catch (err) {
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChildCategories();
  }, [parentCategoryId, categoriesType]);

  const navigateToMerchant = (category) => {
    console.log("ChildCategories: Navigating to category:", category);
    
    // Check if this is the special "Events & Tickets" item
    if (category.isEventsAndTickets) {
      const countryCode = getCountryCodeFromParent(category.parent_id?.[0]);
      console.log("ChildCategories: Navigating to GlobalTix for Events & Tickets with country code:", countryCode);
      
      navigation.navigate("GlobalTix", {
        initialFilters: {
          countryCode: countryCode,
          categoryIds: undefined, // Let user select entertainment category in GlobalTix
          cityIds: undefined,
        },
        parentCategoryName: language === "ar" ? parentCategoryData?.x_name_arabic : parentCategoryData?.name
      });
      return;
    }

    navigation.navigate("merchants", {
      screen: "merchants-list",
      params: {
        filters: {
          category_id: category.id,
        },
        parentCategoryId: category?.parent_id?.[0],
        parentCategoryName,
      },
    });
  };

    // Helper function to get country code from parent category
    const getCountryCodeFromParent = (parentId) => {
      // Use the parent category data if available
      if (parentCategoryData?.x_country_code) {
        return parentCategoryData.x_country_code;
      }
      
      // Fallback to default UAE
      return 'AE';
    };
  
    const filteredChildCategories = childCategories.filter((item) => {
      if (item.parent_id[0] === 47 && (item.id === 156 || item.id === 160)) {
        return false;
      }
  
      return true;
    });
  
    // Add "Events & Tickets" item at the top only if parent has country code
    const shouldShowEventsTickets = parentCategoryData?.x_country_code;
    console.log("ChildCategories: Parent category data:", parentCategoryData);
    console.log("ChildCategories: Should show Events & Tickets:", shouldShowEventsTickets);
    
    let categoriesWithEventsTickets = filteredChildCategories;
    
    if (shouldShowEventsTickets) {
      const eventsAndTicketsItem = {
        id: 'events-and-tickets',
        name: 'Events & Tickets',
        x_name_arabic: 'الفعاليات والتذاكر',
        image3: require('../../../assets/Events&Tickets.png'), // Use the local Events&Tickets image
        parent_id: childCategories[0]?.parent_id || [],
        isEventsAndTickets: true, // Special flag to identify this item
      };
  
      // Combine the special item with filtered categories
      categoriesWithEventsTickets = [eventsAndTicketsItem, ...filteredChildCategories];
    }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? colors.darkBlue : colors.white,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          label={parentCategoryName}

          // onBackPress={handleBackPress}
        />

        <FlatList
          data={categoriesWithEventsTickets}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            marginTop: 16,
            paddingBottom: 60,
          }}
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
                <Image
                  style={[
                    styles.image,
                    {
                      tintColor: isDark ? colors.mainDarkMode : colors.darkBlue,
                    },
                  ]}
                  source={
                    item.isEventsAndTickets 
                      ? item.image3 // Local image (require)
                      : { uri: item.image3 } // Remote URL
                  }
                  tintColor={isDark ? colors.mainDarkMode : colors.darkBlue}
                />
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
  wrapper: {},
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  image: {
    width: 45,
    height: 45,
  },
  categoryName: {
    marginTop: 4,
    flex: 1,
    width: IMAGE_SIZE,
    fontWeight: '700',
    marginHorizontal: 30,
  },
  list: {
    marginTop: 16,
    paddingBottom: 40,
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
  noData: {
    height: IMAGE_SIZE + 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainerStyle: {
    paddingLeft: 5,
  },
});

export default ChildCategories;
