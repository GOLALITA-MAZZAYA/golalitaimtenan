import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { TypographyText } from '../../../components/Typography';
import { BALOO_MEDIUM } from '../../../redux/types';
import { colors } from '../../../components/colors';
import { useTheme } from '../../../components/ThemeProvider';
import { setFilters, setCategories, setCities } from '../../../redux/globalTix/globalTix-actions';
import { globalTixAPI } from '../../../redux/globalTix/globalTix-api';
import { getGlobalTixCountries } from '../../../redux/globalTix/globalTix-thunks';
import { isRTL } from '../../../../utils';
import Select from './Select';

const GlobalTixInlineFilters = ({ onFiltersChange }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  
  // Redux state
  const { filters, countries, categories, cities } = useSelector(state => state.globalTix);
  
  // Local state for filter values
  const [localFilters, setLocalFilters] = useState({
    countryCode: filters.countryCode,
    categoryIds: filters.categoryIds,
    cityIds: filters.cityIds,
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure countries are loaded
    if (!countries || countries.length === 0) {
      dispatch(getGlobalTixCountries());
    }
  }, []);

  useEffect(() => {
    // Load categories and cities when country changes
    loadFilterData();
  }, [localFilters.countryCode]);

  const loadFilterData = async () => {
    try {
      setLoading(true);
      
      // Always load categories (they should be available initially)
      const categoriesResponse = await globalTixAPI.fetchCategories({ 
        countryCode: localFilters.countryCode 
      });
      
      if (categoriesResponse.success) {
        dispatch(setCategories(categoriesResponse.data || []));
      } else {
        dispatch(setCategories([]));
      }
      
      // Only load cities if a country is selected
      if (localFilters.countryCode) {
        const citiesResponse = await globalTixAPI.fetchCities({ 
          countryCode: localFilters.countryCode 
        });
        
        if (citiesResponse.success) {
          dispatch(setCities(citiesResponse.data || []));
        }
      } else {
        // Clear cities when no country is selected
        dispatch(setCities([]));
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCountryChange = async (countryCode) => {
    const newFilters = { 
      ...localFilters, 
      countryCode, 
      categoryIds: undefined, 
      cityIds: undefined 
    };
    setLocalFilters(newFilters);
    
    // Update Redux state
    dispatch(setFilters(newFilters));
    
    // Notify parent component immediately to clear products
    onFiltersChange && onFiltersChange(newFilters);
  };

  const handleCategoryChange = (categoryId) => {
    // For single selection, categoryId is a string or undefined
    const newFilters = { ...localFilters, categoryIds: categoryId };
    setLocalFilters(newFilters);
    
    // Update Redux state
    dispatch(setFilters(newFilters));
    
    // Notify parent component
    onFiltersChange && onFiltersChange(newFilters);
  };

  const handleCityChange = (cityId) => {
    // For single selection, cityId is a string or undefined
    const newFilters = { ...localFilters, cityIds: cityId };
    
    setLocalFilters(newFilters);
    
    // Update Redux state
    dispatch(setFilters(newFilters));
    
    // Notify parent component
    onFiltersChange && onFiltersChange(newFilters);
  };

  const transformCountriesToOptions = () => {
    const options = (countries || []).map(country => ({
      value: country.code || country.countryCode,
      label: country.name || country.countryName,
    }));
    return options;
  };

  const transformCategoriesToOptions = () => {
    return (categories || []).map(category => ({
      value: category.id || category.categoryId,
      label: category.name || category.categoryName,
    }));
  };

  const transformCitiesToOptions = () => {
    return (cities || []).map(city => ({
      value: city.id || city.cityId,
      label: city.name || city.cityName,
    }));
  };



  return (
    <View style={styles.filtersContainer}>
      <TypographyText
        title={t("GlobalTix.filterBy")}
        size={16}
        font={BALOO_MEDIUM}
        textColor={isDark ? colors.white : colors.darkBlue}
        style={styles.filterTitle}
      />
      
      <View style={styles.filtersRow}>
        {/* Country Filter */}
        <View style={[styles.filterItem, {marginHorizontal: 10}]}>
          <Select
            name="global-tix-country-filter-inline"
            options={transformCountriesToOptions()}
            allowClear={true}
            label={t("GlobalTix.selectCountry")}
            placeholder={t("GlobalTix.selectCountry")}
            labelTextStyle={{ fontWeight: "100",fontSize: 13 }}
            placeholderTextStyle={{ color: isDark ? colors.lightGrey : colors.darkGrey }}
            value={localFilters.countryCode}
            onChange={handleCountryChange}
            single
            loading={loading}
            mainStyle={[
              styles.selectInput,
              {
                borderColor: isDark ? colors.mainDarkMode : colors.lightGrey,
                backgroundColor: isDark ? colors.mainDarkModeText : colors.white,
                height: 35,
              }
            ]}
          />
        </View>

        {/* City Filter - Only show if country is selected */}
        {localFilters.countryCode && (
          <View style={[styles.filterItem,{marginHorizontal: 10}]}>
            <Select
              name="global-tix-city-filter-inline"
              options={transformCitiesToOptions()}
              allowClear={true}
             // label={t("GlobalTix.city")}
              labelTextStyle={{ fontWeight: "100",fontSize: 13 }}
              label={loading ? t("General.loading") : t("GlobalTix.selectCities")}
              placeholder={t("GlobalTix.selectCities")}
              placeholderTextStyle={{ color: isDark ? colors.lightGrey : colors.darkGrey }}
              value={localFilters.cityIds}
              onChange={handleCityChange}
              single={true}
              loading={loading}
              mainStyle={[
                styles.selectInput,
                {
                  borderColor: isDark ? colors.mainDarkMode : colors.lightGrey,
                  backgroundColor: isDark ? colors.mainDarkModeText : colors.white,
                  height: 32,
                }
              ]}
            />
          </View>
        )}

        {/* Category Filter - Always show */}
        <View style={[styles.filterItem, {marginHorizontal: 10}]}>
          <Select
            name="global-tix-category-filter-inline"
            options={transformCategoriesToOptions()}
            allowClear={true}
            //label={t("GlobalTix.category")}
            labelTextStyle={{ fontWeight: "100",fontSize: 13 }}
            label={loading ? t("General.loading") : t("GlobalTix.selectCategories")}
            placeholder={t("GlobalTix.selectCategories")}
            placeholderTextStyle={{ color: isDark ? colors.lightGrey : colors.darkGrey }}
            value={localFilters.categoryIds}
            onChange={handleCategoryChange}
            single={true}
            loading={loading}
            mainStyle={[
              styles.selectInput,
              {
                borderColor: isDark ? colors.mainDarkMode : colors.lightGrey,
                backgroundColor: isDark ? colors.mainDarkModeText : colors.white,
                height: 32,
              }
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    marginBottom: 20,
    //paddingHorizontal: 20,
  },
  filterTitle: {
    marginBottom: 12,
    textAlign: isRTL() ? 'right' : 'left',
  },
  filtersRow: {
    flexDirection: isRTL() ? 'row-reverse' : 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  filterItem: {
   // minWidth: 120,
    flex: 1,
  },
  selectInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

export default GlobalTixInlineFilters;
