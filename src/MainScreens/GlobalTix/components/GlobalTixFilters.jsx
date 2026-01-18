import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { TypographyText } from '../../../components/Typography';
import { BALOO_SEMIBOLD, BALOO_MEDIUM } from '../../../redux/types';
import { colors } from '../../../components/colors';
import { useTheme } from '../../../components/ThemeProvider';
import Select from '../../../components/Form/Select';
import { setFilters } from '../../../redux/globalTix/globalTix-actions';
import { globalTixAPI } from '../../../redux/globalTix/globalTix-api';
import { setCategories, setCities } from '../../../redux/globalTix/globalTix-actions';
import { getGlobalTixCountries } from '../../../redux/globalTix/globalTix-thunks';

const GlobalTixFilters = ({ onClose, onApply }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  
  // Redux state
  const { filters, countries, categories, cities } = useSelector(state => state.globalTix);
  
  // Local state for filter values
  const [localFilters, setLocalFilters] = useState({
    countryCode: filters.countryCode,
    categoryIds: filters.categoryIds || '',
    cityIds: filters.cityIds || '',
  });
  
  const [loading, setLoading] = useState(false);

  // Debug logging

  useEffect(() => {
    // Ensure countries are loaded
    if (!countries || countries.length === 0) {
      dispatch(getGlobalTixCountries());
    }
    loadFilterData();
  }, []);

  const loadFilterData = async () => {
    try {
      setLoading(true);
      
      
      // Load categories and cities for the selected country
      const [categoriesResponse, citiesResponse] = await Promise.all([
        globalTixAPI.fetchCategories({ countryCode: localFilters.countryCode }),
        globalTixAPI.fetchCities({ countryCode: localFilters.countryCode })
      ]);
      
      if (categoriesResponse.success) {
        dispatch(setCategories(categoriesResponse.data || []));
      } else {
      }
      
      if (citiesResponse.success) {
        dispatch(setCities(citiesResponse.data || []));
      } else {
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // Don't show error to user, just log it
    }
  };

  const handleCountryChange = async (countryCode) => {
    setLocalFilters(prev => ({ ...prev, countryCode, categoryIds: '', cityIds: '' }));
    
    // Reload categories and cities for the new country
    try {
      setLoading(true);
      
      const [categoriesResponse, citiesResponse] = await Promise.all([
        globalTixAPI.fetchCategories({ countryCode }),
        globalTixAPI.fetchCities({ countryCode })
      ]);
      
      if (categoriesResponse.success) {
        dispatch(setCategories(categoriesResponse.data || []));
      } else {
      }
      
      if (citiesResponse.success) {
        dispatch(setCities(citiesResponse.data || []));
      } else {
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryIds) => {
    setLocalFilters(prev => ({ ...prev, categoryIds }));
  };

  const handleCityChange = (cityIds) => {
    setLocalFilters(prev => ({ ...prev, cityIds }));
  };

  const handleApplyFilters = () => {
    dispatch(setFilters(localFilters));
    onApply && onApply(localFilters);
    onClose && onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      countryCode: '',
      categoryIds: '',
      cityIds: '',
    };
    setLocalFilters(clearedFilters);
    dispatch(setFilters(clearedFilters));
    onApply && onApply(clearedFilters);
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
    <View style={[styles.container, { backgroundColor: isDark ? colors.mainDarkMode : colors.white }]}>
      <View style={styles.header}>
        <TypographyText
          title={t("GlobalTix.filters")}
          size={20}
          font={BALOO_SEMIBOLD}
          textColor={isDark ? colors.white : colors.darkBlue}
        />
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <TypographyText
            title="✕"
            size={20}
            textColor={isDark ? colors.lightGrey : colors.darkGrey}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Country Filter */}
        <View style={styles.filterSection}>
          <TypographyText
            title={t("GlobalTix.country")}
            size={16}
            font={BALOO_MEDIUM}
            textColor={isDark ? colors.white : colors.darkBlue}
            style={styles.filterLabel}
          />
          <Select
            name="global-tix-country-filter"
            options={transformCountriesToOptions()}
            placeholder={t("GlobalTix.selectCountry")}
            value={localFilters.countryCode}
            onChange={handleCountryChange}
            single
            loading={loading}
            mainStyle={[
              styles.selectInput,
              {
                borderColor: isDark ? colors.darkGrey : colors.lightGrey,
                backgroundColor: isDark ? colors.mainDarkModeText : colors.white,
              }
            ]}
          />
          {/* Debug info */}
          <TypographyText
            title={`Countries loaded: ${countries?.length || 0}`}
            size={12}
            textColor={colors.grey}
            style={{ marginTop: 5 }}
          />
        </View>

        {/* Category Filter */}
        <View style={styles.filterSection}>
          <TypographyText
            title={t("GlobalTix.categories")}
            size={16}
            font={BALOO_MEDIUM}
            textColor={isDark ? colors.white : colors.darkBlue}
            style={styles.filterLabel}
          />
          <Select
            name="global-tix-category-filter"
            options={transformCategoriesToOptions()}
            placeholder={t("GlobalTix.selectCategories")}
            value={localFilters.categoryIds}
            onChange={handleCategoryChange}
            single={false}
            loading={loading}
            mainStyle={[
              styles.selectInput,
              {
                borderColor: isDark ? colors.darkGrey : colors.lightGrey,
                backgroundColor: isDark ? colors.mainDarkModeText : colors.white,
              }
            ]}
          />
        </View>

        {/* City Filter */}
        <View style={styles.filterSection}>
          <TypographyText
            title={t("GlobalTix.cities")}
            size={16}
            font={BALOO_MEDIUM}
            textColor={isDark ? colors.white : colors.darkBlue}
            style={styles.filterLabel}
          />
          <Select
            name="global-tix-city-filter"
            options={transformCitiesToOptions()}
            placeholder={t("GlobalTix.selectCities")}
            value={localFilters.cityIds}
            onChange={handleCityChange}
            single={false}
            loading={loading}
            mainStyle={[
              styles.selectInput,
              {
                borderColor: isDark ? colors.darkGrey : colors.lightGrey,
                backgroundColor: isDark ? colors.mainDarkModeText : colors.white,
              }
            ]}
          />
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={handleClearFilters}
        >
          <TypographyText
            title={t("GlobalTix.clearAll")}
            size={16}
            font={BALOO_MEDIUM}
            textColor={isDark ? colors.white : colors.darkBlue}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.applyButton]}
          onPress={handleApplyFilters}
        >
          <TypographyText
            title={t("GlobalTix.apply")}
            size={16}
            font={BALOO_MEDIUM}
            textColor={colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  filterSection: {
    marginBottom: 25,
  },
  filterLabel: {
    marginBottom: 10,
  },
  selectInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    gap: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  applyButton: {
    backgroundColor: colors.darkBlue,
  },
});

export default GlobalTixFilters;
