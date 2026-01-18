import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { CloseIcon } from "../../../../../../assets/delivery_assets";
import { SizedBox } from "../../../_shared/componenets/SizedBox";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurantsCategories } from "../../../../../../redux/delivery/delivery-thunks";
import RestaurantFiltersItem from "./RestaurantFiltersItem";
import { BALOO_MEDIUM, BALOO_REGULAR } from "../../../../../../redux/types";
import { TypographyText } from "../../../../../../components/Typography";
import { colors } from "../../../../../../components/colors";
import { useTranslation } from "react-i18next";

const isSomeFilterSelected = (filters) => {
  if (!filters) {
    return false;
  }

  const allFilters = Object.values(filters).flat();

  return !!allFilters.length;
};

const getSelectedFiltersCount = (filters) => {
  return Object.values(filters).flat().length;
};

const DEFAULT_VALUES = [];

const RestaurantFilters = ({ onClose, onChange, isDark }) => {
  const categories = useSelector(
    (state) => state.restaurantReducer.restaurantsCategories
  );

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [values, setValues] = useState(DEFAULT_VALUES);
  const language = i18n.language;

  useEffect(() => {
    dispatch(getRestaurantsCategories());
  }, []);

  const handleChange = (id) => {
    if (!id) {
      setValues([]);
      return;
    }

    if (!values.includes(id)) {
      setValues((prevValues) => [...prevValues, id]);

      return;
    }

    return setValues((prevValues) => prevValues.filter((item) => item !== id));
  };

  const handleClearAll = () => {
    setValues(DEFAULT_VALUES);
  };

  const handleFiltersSubmit = () => {
    onChange(values);
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={onClose}>
          <CloseIcon
            color={"#999CAD"}
            style={{
              width: 20,
              height: 20,
            }}
          />
        </TouchableOpacity>
        <TypographyText
          title={t("RestaurantList.filters")}
          textColor={isDark ? colors.white : colors.darkBlue}
          size={18}
          font={BALOO_MEDIUM}
        />
        <SizedBox size={1} />
        {isSomeFilterSelected(values) && (
          <TouchableOpacity onPress={handleClearAll}>
            <TypographyText
              title={t("RestaurantList.clearAll")}
              textColor={"red"}
              size={16}
              font={BALOO_REGULAR}
            />
          </TouchableOpacity>
        )}
      </View>
      <SizedBox size={24} />

      <RestaurantFiltersItem
        title={t("RestaurantList.categories")}
        options={categories}
        values={values}
        onChange={handleChange}
        t={t}
        isDark={isDark}
        language={language}
      />

      <SizedBox size={8} />

      <TouchableOpacity
        style={[
          styles.filterBtn,
          { backgroundColor: isDark ? "#0B177E" : colors.darkBlue },
        ]}
        onPress={handleFiltersSubmit}
      >
        {isSomeFilterSelected(values) && (
          <View style={styles.count}>
            <TypographyText
              title={getSelectedFiltersCount(values)}
              textColor={colors.darkBlue}
              size={16}
              font={BALOO_MEDIUM}
            />
          </View>
        )}
        <TypographyText
          title={t("RestaurantList.applyFilters")}
          textColor={colors.white}
          size={16}
          font={BALOO_MEDIUM}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  filterBtn: {
    backgroundColor: colors.darkBlue,
    padding: 16,
    borderRadius: 8,
    height: 62,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  count: {
    height: 28,
    width: 28,
    borderRadius: 10,
    backgroundColor: colors.white,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RestaurantFilters;
