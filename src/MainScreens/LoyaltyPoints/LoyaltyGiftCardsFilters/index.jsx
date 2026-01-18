import { View } from "react-native";
import FilterScreen from "../../../components/FiltersScreen";
import AsyncCountryPicker from "./components/AsyncCountryPicker";
import AsyncCategorySelect from "./components/AsyncCategorySelect";
import { useRoute } from "@react-navigation/native";

const GiftCardFilters = ({ navigation }) => {
  const route = useRoute();
  const defaultFilters = route?.params?.filters;
  const onReset = () => {};

  const onClose = () => {
    navigation.navigate("myVouchers-list");
  };

  const onSubmit = (filters) => {
    const transformedFilters = {
      country_code: filters.country_code,
      category_id: filters.category_id,
    };

    navigation.navigate("myVouchers-list", {
      giftCardsFilters: transformedFilters,
    });
  };

  const onBackPress = () => {
    navigation.navigate("myVouchers-list");
  };

  return (
    <FilterScreen
      onReset={onReset}
      onClose={onClose}
      onSubmit={onSubmit}
      onBackPress={onBackPress}
      title={"Filters"}
      initialValues={{
        category_id: defaultFilters?.category_id,
        country_code: defaultFilters?.country_code || "QA",
      }}
    >
      <View>
        <AsyncCategorySelect />

        <AsyncCountryPicker />
      </View>
    </FilterScreen>
  );
};

export default GiftCardFilters;
