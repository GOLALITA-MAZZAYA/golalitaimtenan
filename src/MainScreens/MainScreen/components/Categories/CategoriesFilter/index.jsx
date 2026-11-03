import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TypographyText } from "../../../../../components/Typography";
import { useTheme } from "../../../../../components/ThemeProvider";
import { colors } from "../../../../../components/colors";
import { useTranslation } from "react-i18next";

const CategoriesFilter = ({ type, onChange, style }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const config = [
    {
      label: t("MainScreen.localCategories"),
      value: "local",
    },
    {
      label: t("MainScreen.globalCategories"),
      value: "global",
    },
  ];

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: isDark ? "#1C1C1E" : "#E5E7EB",
          borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
        },
        style,
      ]}
    >
      {config.map((data) => {
        const isActive = type === data.value;
        return (
          <TouchableOpacity
            key={data.value}
            activeOpacity={0.8}
            style={[
              styles.filterBtn,
              isActive && (isDark ? styles.activeWrapperDark : styles.activeWrapperLight),
            ]}
            onPress={() => onChange(data.value)}
          >
            <TypographyText
              title={data.label}
              textColor={
                isActive
                  ? isDark
                    ? "#000000"
                    : colors.white
                  : isDark
                  ? "#8E8E93"
                  : "#6B7280"
              }
              size={13}
              style={[styles.text, isActive && styles.activeText]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  activeWrapperLight: {
    backgroundColor: colors.darkBlue,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  activeWrapperDark: {
    backgroundColor: colors.mainDarkMode,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 17,
  },
  text: {
    fontWeight: "500",
  },
  activeText: {
    fontWeight: "700",
  },
});

export default CategoriesFilter;
