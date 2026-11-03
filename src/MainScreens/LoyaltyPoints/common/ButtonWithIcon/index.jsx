import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../../../../components/colors";
import { TypographyText } from "../../../../components/Typography";
import { useTheme } from "../../../../components/ThemeProvider";
import { BALOO_BOLD } from "../../../../redux/types";

const ButtonWithImage = ({ icon, text, style, primary, onPress, textStyle }) => {
  const { isDark } = useTheme();

  const getBackgroundColor = () => {
    if (primary) {
      return isDark ? colors.mainDarkMode : colors.darkBlue;
    }
    return isDark ? "rgba(255, 255, 255, 0.06)" : "#F4F4F5";
  };

  const getBorderColor = () => {
    if (primary) return "transparent";
    return isDark ? "rgba(221, 189, 107, 0.3)" : "rgba(162, 148, 117, 0.3)";
  };

  const getTextColor = () => {
    if (primary) {
      return isDark ? "#000000" : "#FFFFFF";
    }
    return isDark ? colors.mainDarkMode : colors.darkBlue;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.wrapper,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: primary ? 0 : 1,
        },
        style,
      ]}
      onPress={onPress}
    >
      {icon && <View style={styles.icon}>{icon}</View>}

      <TypographyText
        title={text}
        textColor={getTextColor()}
        size={14}
        font={BALOO_BOLD}
        style={[styles.text, { paddingLeft: icon ? 6 : 0 }, textStyle]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 42,
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  icon: {
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "700",
  },
});

export default ButtonWithImage;