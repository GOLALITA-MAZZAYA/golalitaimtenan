import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../ThemeProvider";
import { colors } from "../../colors";
import { TypographyText } from "../../Typography";

const ButtonCheckbox = ({ onChange, label, isActive, style }) => {
  const { isDark } = useTheme();

  const getWrapperStyle = () => {
    if (isActive) {
      return isDark ? styles.activeWrapperDark : styles.activeWrapperLight;
    }

    return isDark ? styles.passiveWrapperDark : styles.passiveWrapperLight;
  };

  const getTextColor = () => {
    if (isActive) {
      return isDark ? colors.mainDarkModeText : colors.white;
    }

    return isDark ? colors.white : colors.darkBlue;
  };

  return (
    <View style={[styles.wrapper, style]}>
      <TouchableOpacity
        style={[styles.filterBtn, getWrapperStyle()]}
        onPress={onChange}
      >
        <TypographyText
          title={label}
          textColor={getTextColor()}
          size={14}
          style={styles.text}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeWrapperLight: {
    backgroundColor: colors.darkBlue,
  },
  passiveWrapperLight: {
    borderColor: colors.darkBlue,
  },
  activeWrapperDark: {
    backgroundColor: colors.mainDarkMode,
  },
  passiveWrapperDark: {
    borderColor: colors.mainDarkMode,
  },

  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.darkBlue,
  },
  text: {
    fontWeight: "600",
  },
});

export default ButtonCheckbox;
