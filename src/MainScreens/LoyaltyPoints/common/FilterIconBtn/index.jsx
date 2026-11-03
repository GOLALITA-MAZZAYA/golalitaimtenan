import { TouchableOpacity } from "react-native";
import FilterSvg from "../../../../assets/filter.svg";
import { useTheme } from "../../../../components/ThemeProvider";
import { colors } from "../../../../components/colors";

const FilterIconBtn = ({ openModal }) => {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity style={{ padding: 11, paddingLeft: 0 }} onPress={openModal}>
      <FilterSvg color={isDark ? colors.white : "#999CAD"} height={20} width={20} />
    </TouchableOpacity>
  );
};

export default FilterIconBtn;
