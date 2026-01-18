import { useState } from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import CommonButton from "../../../../components/CommonButton/CommonButton";
import { useTranslation } from "react-i18next";
import MerchantsSelect from "./components/MerchantsSelect";
import LocationSelect from "./components/LocationSelect";

const FiltersForm = ({ onSubmit, filters: mapFilters }) => {
  const [filters, setFilters] = useState({
    location: mapFilters?.location,
    merchant: null,
  });

  const { t } = useTranslation();

  const handleFilterChange = (name, value) => {
    setFilters((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const handleMerchantChange = (value) => handleFilterChange("merchant", value);

  const handleLocationChange = (value, fullLocationData) => {
    handleFilterChange("location", fullLocationData);
  };

  const handleSubmitPress = () => {
    onSubmit(filters);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.form}>
        <LocationSelect
          value={filters?.location?.id}
          placeholder={t("MapPage.locationPlaceholder")}
          onChange={handleLocationChange}
        />

        <MerchantsSelect
          onChange={handleMerchantChange}
          value={filters?.merchant}
          locationId={filters?.location?.id}
          placeholder={t("MapPage.merchantsPlaceholder")}
          latitude={filters?.location?.latitude}
          longitude={filters?.location?.longitude}
        />
      </View>

      <CommonButton
        label={t("MapPage.apply")}
        style={styles.controllBtn}
        onPress={handleSubmitPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    justifyContent: "space-between",
    paddingBottom: 80,
  },
  form: {
    height: 150,
    justifyContent: "space-around",
  },

  controllBtn: {
    height: 50,
    borderRadius: 12,
  },
});

export default FiltersForm;
