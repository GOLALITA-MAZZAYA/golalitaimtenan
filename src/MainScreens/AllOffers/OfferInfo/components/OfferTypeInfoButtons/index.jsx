import { colors } from "../../../../../components/colors";
import CommonButton from "../../../../../components/CommonButton/CommonButton";
import { useTheme } from "../../../../../components/ThemeProvider";
import { mainStyles } from "../../../../../styles/mainStyles";

const OfferTypeInfoButtons = ({ data }) => {
  const { isDark } = useTheme();

  return data.map((item) => {
    if (!item.visible) {
      return null;
    }

    return (
      <CommonButton
        label={item.label}
        style={{
          ...mainStyles.borderButton,
          ...mainStyles.mb20,
          backgroundColor: isDark ? colors.mainDarkMode : colors.white,
          borderColor: isDark ? colors.mainDarkMode : colors.darkBlue,
          marginTop: 40,
        }}
        textColor={isDark ? colors.mainDarkModeText : colors.darkBlue}
        onPress={item.onPress}
      />
    );
  });
};

export default OfferTypeInfoButtons;
