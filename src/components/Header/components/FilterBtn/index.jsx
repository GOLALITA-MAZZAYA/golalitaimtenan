import { TouchableOpacity } from "react-native";
import FilterSvg from "../../../../assets/filter.svg";
import { useTheme } from "../../../ThemeProvider";
import { colors } from "../../../colors";
import { useNavigation } from "@react-navigation/native";

const FilterBtn = (props) => {
  const { isDark } = useTheme();
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("merchants", {
      screen: "merchants-filters",
      params: props.params,
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
