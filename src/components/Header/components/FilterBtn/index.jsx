import { TouchableOpacity } from "react-native";
import FilterSvg from "../../../../assets/filter.svg";
import { useTheme } from "../../../ThemeProvider";
import { colors } from "../../../colors";
import { useNavigation } from "@react-navigation/native";

const FilterBtn = (props) => {
  const { isDark } = useTheme();
  const navigation = useNavigation();

  const handlePress = () => {
    const params = props.params || {};
    // Prefer in-stack navigation when already inside merchants navigator.
    // Going through parent "merchants" remounts the stack and drops list params.
    if (navigation.getState?.()?.routeNames?.includes("merchants-filters")) {
      navigation.navigate("merchants-filters", params);
      return;
    }

    navigation.navigate("merchants", {
      screen: "merchants-filters",
      params,
    });
  };

  return (
    <TouchableOpacity
      style={{ padding: 11, paddingLeft: 0 }}
      onPress={handlePress}
    >
      <FilterSvg
        color={isDark ? colors.white : "#999CAD"}
        height={20}
        width={20}
      />
    </TouchableOpacity>
  );
};

export default FilterBtn;
