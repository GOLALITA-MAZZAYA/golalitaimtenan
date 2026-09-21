import React from 'react';
import FilterScreen from '../../../components/FiltersScreen';
import FormikCountryPicker from '../../../components/Formik/FormikCountryPicker';
import FormikLocationPicker from '../../../components/Formik/FormikLocationPicker';
import { useSelector } from 'react-redux';
import { convertCategoriesToOptions, getAllCategories } from './utils';
import FormikTags from '../../../components/Formik/FormikTags';
import { useTranslation } from 'react-i18next';
import FormikSearchInput from '../../../components/Formik/FormikSearchInput';
import { getFlexDirection } from '../../../../utils';
import CategoriesTypes from './components/CategoriesTypes';
import MerchantTypes from './components/MerchantTypes';
import SubCategoriesTags from './components/SubCategoriesTags';
import trackActivity from '../../../api/activityTracker';

const transformCategoryValue = category => {
  if (category == null || category === '') {
    return [];
  }

  if (typeof category === 'number') {
    return [category];
  }

  if (Array.isArray(category)) {
    return category.filter(id => id != null && id !== '');
  }

  return [category];
};

const MerchantsFilters = ({ navigation, route }) => {
  const { categoriesType } = useSelector(state => state.merchantReducer);
  const categories = useSelector(
    state => state.merchantReducer.parentCategories,
  );

  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const params = route?.params;
  const allCategories = getAllCategories(categories || []);
  const options = convertCategoriesToOptions(allCategories, language);

  const onReset = () => {};

  const onClose = () => {
    navigation.navigate({
      name: 'merchants-list',
      params: {
        filters: params?.filters,
        parentCategoryName: params?.parentCategoryName,
        parentCategoryId: params?.parentCategoryId,
      },
      merge: true,
    });
  };

  const onSubmit = filters => {
    const categoryIds = transformCategoryValue(filters.category_id);
    const subCategoryIds = transformCategoryValue(filters.sub_category_id);
    // Merchant list chips need a single parent id (number), not an array.
    const primaryCategoryId =
      categoryIds.length === 1 ? categoryIds[0] : params?.parentCategoryId;

    const transformedFilters = {
      merchant_name: filters.merchant_name,
      country_id:
        categoriesType === 'local'
          ? 'qa'
          : filters.country_id?.cca2?.toLowerCase(),
      location_id: filters.location_id,
      is_premium_merchant: filters.is_premium_merchant,
      category_id:
        primaryCategoryId != null ? primaryCategoryId : categoryIds,
      sub_category_id: subCategoryIds,
    };

    trackActivity('search', {
      search_query: transformedFilters.merchant_name || undefined,
      page_name: 'search',
      metadata: {
        search_source: 'merchants_filter_screen',
        category_id: transformedFilters.category_id,
        sub_category_id: transformedFilters.sub_category_id,
        country_id: transformedFilters.country_id,
        location_id: transformedFilters.location_id,
        is_premium_merchant: transformedFilters.is_premium_merchant,
      },
    });

    const selectedCategory =
      primaryCategoryId != null
        ? allCategories.find(
            item => Number(item.id) === Number(primaryCategoryId),
          )
        : null;

    navigation.navigate({
      name: 'merchants-list',
      params: {
        filters: transformedFilters,
        parentCategoryName: selectedCategory
          ? language === 'ar'
            ? selectedCategory.x_name_arabic || selectedCategory.name
            : selectedCategory.name
          : params?.parentCategoryName,
        parentCategoryId:
          primaryCategoryId ??
          selectedCategory?.id ??
          params?.parentCategoryId,
      },
      merge: true,
    });
  };

  const onBackPress = () => {
    navigation.navigate({
      name: 'merchants-list',
      params: {
        filters: params?.filters,
        parentCategoryName: params?.parentCategoryName,
        parentCategoryId: params?.parentCategoryId,
      },
      merge: true,
    });
  };

  return (
    <FilterScreen
      onReset={onReset}
      onClose={onClose}
      onSubmit={onSubmit}
      onBackPress={onBackPress}
      title={t('Merchants.filtersTitle')}
      initialValues={{
        category_id: transformCategoryValue(
          params?.filters?.category_id ?? params?.parentCategoryId,
        ),
        sub_category_id: transformCategoryValue(
          params?.filters?.sub_category_id,
        ),
        merchant_name: params?.filters?.merchant_name || '',
      }}
      defaultValues={{
        category_id: [],
        sub_category_id: [],
        merchant_name: '',
      }}
    >
      <FormikSearchInput
        name="merchant_name"
        placeholder={t('Merchants.searchPlaceholder')}
        wrapperStyle={{ marginTop: 36 }}
      />

      {categoriesType == 'global' && (
        <FormikCountryPicker
          name="country_id"
          wrapperStyle={{ marginTop: 20 }}
          placeholder={t('Merchants.all')}
        />
      )}

      {categoriesType == 'local' && (
        <FormikLocationPicker
          name="location_id"
          wrapperStyle={{ marginTop: 20 }}
          placeholder={t('Merchants.location')}
        />
      )}

      <MerchantTypes />

      <CategoriesTypes />

      <FormikTags
        data={options}
        name="category_id"
        wrapperStyle={{
          flex: 1,
          ...getFlexDirection(),
          marginTop: 10,
        }}
        title={t('Merchants.categoriesLabel')}
      />

      <SubCategoriesTags />
    </FilterScreen>
  );
};

export default MerchantsFilters;
