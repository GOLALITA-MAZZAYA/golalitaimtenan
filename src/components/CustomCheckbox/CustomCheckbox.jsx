import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { colors } from "../colors";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "../ThemeProvider";
import { mainStyles } from "../../styles/mainStyles";

const CustomCheckbox = ({ isActive, setIsActive }) => {
  const { isDark } = useTheme();
  return (
    <LinearGradient
      style={[
        styles.button,
        isDark && { borderColor: colors.transparent },
        isDark && isActive && { borderColor: colors.white },
      ]}
      colors={
        isActive
          ? isDark
            ? [colors.green, colors.lightGreen]
            : [colors.darkBlue, colors.darkBlue]
          : isDark
          ? [colors.secBlue, colors.secBlue]
          : [colors.transparent, colors.transparent]
      }
    >
      <TouchableOpacity
        onPress={setIsActive}
        style={[
          { ...mainStyles.row, width: "100%", height: "100%" },
          isActive && { justifyContent: "flex-end" },
        ]}
        activeOpacity={0.4}
      >
        <LinearGradient
          style={[styles.circle]}
          colors={
            isActive
              ? isDark
                ? [colors.white, colors.white]
                : [colors.green, colors.lightGreen]
              : [colors.grey, colors.grey]
          }
        >
          {/*<View  />*/}
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#DDDFE4",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 2,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});

export default CustomCheckbox;
