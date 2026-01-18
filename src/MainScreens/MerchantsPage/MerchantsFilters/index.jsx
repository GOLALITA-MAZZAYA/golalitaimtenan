import React from "react";
import FilterScreen from "../../../components/FiltersScreen";
import FormikCountryPicker from "../../../components/Formik/FormikCountryPicker";
import FormikLocationPicker from "../../../components/Formik/FormikLocationPicker";
import { useSelector } from "react-redux";
import { convertCategoriesToOptions, getAllCategories } from "./utils";
import FormikTags from "../../../components/Formik/FormikTags";
import { useTranslation } from "react-i18next";
import FormikSearchInput from "../../../components/Formik/FormikSearchInput";
import { getFlexDirection } from "../../../../utils";
import CategoriesTypes from "./components/CategoriesTypes";
import MerchantTypes from "./components/MerchantTypes";

const transformCategoryValue = (category) => {
  if (!category) {
    return [];
  }

  if (typeof category === "number") {
    return [category];
  }

  return category;
};

const MerchantsFilters = ({ navigation, route }) => {
  const { categoriesType } = useSelector((state) => state.merchantReducer);
  const categories = useSelector(
    (state) => state.merchantReducer.parentCategories
  );

  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const params = route?.params;

  const onReset = () => {};

  const onClose = () => {
    navigation.navigate("merchants-list");
  };

  const onSubmit = (filters) => {
    const transformedFilters = {
      merchant_name: filters.merchant_name,
      country_id:
        categoriesType === "local"
          ? "qa"
          : filters.country_id?.cca2?.toLowerCase(),
      location_id: filters.location_id,
      gpoint: filters.gpoint,
      is_premium_merchant: filters.is_premium_merchant,
      category_id: transformCategoryValue(filters.category_id),
    };

    navigation.navigate("merchants-list", { filters: transformedFilters });
  };

  const onBackPress = () => {
    navigation.navigate("merchants-list", {
      filters: params?.filters,
    });
  };

  const allCategories = getAllCategories(categories);

  const options = convertCategoriesToOptions(allCategories, language);

  return (
    <FilterScreen
      onReset={onReset}
      onClose={onClose}
      onSubmit={onSubmit}
      onBackPress={onBackPress}
      title={t("Merchants.filtersTitle")}
      initialValues={{
        category_id: transformCategoryValue(params?.filters?.category_id),
        merchant_name: params?.filters?.merchant_name || "",
        gpoint: params?.filters?.gpoint || null,
      }}
      defaultValues={{
        category_id: [],
        merchant_name: "",
        gpoint: null,
      }}
    >
      <FormikSearchInput
        name="merchant_name"
        placeholder={t("Merchants.searchPlaceholder")}
        wrapperStyle={{ marginTop: 36 }}
      />

      {categoriesType == "global" && (
        <FormikCountryPicker
          name="country_id"
          wrapperStyle={{ marginTop: 20 }}
          placeholder={t("Merchants.all")}
        />
      )}

      {categoriesType == "local" && (
        <FormikLocationPicker
          name="location_id"
          wrapperStyle={{ marginTop: 20 }}
          placeholder={t("Merchants.location")}
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
        title={t("Merchants.categoriesLabel")}
      />
    </FilterScreen>
  );
};

export default MerchantsFilters;
