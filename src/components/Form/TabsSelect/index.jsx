import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { TypographyText } from "../../Typography";
import { BALOO_2, BALOO_REGULAR } from "../../../redux/types";
import { colors } from "../../colors";
import { isRTL } from "../../../../utils";
import { useTheme } from "../../ThemeProvider";

const TabsSelect = ({
  value = 1,
  label,
  style,
  onChange,
  options = [],
  tabStyle,
  activeTabStyle,
  textStyle,
  activeTextStyle,
  contentContainerStyle,
}) => {
  const isRtl = isRTL();
  const { isDark } = useTheme();

  const formatTitle = (text) => {
    if (typeof text !== "string" || !text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <View style={[styles.wrapper, style]}>
      {Boolean(label) && (
        <TypographyText
          font={BALOO_2}
          textColor={isDark ? colors.loyaltyTextSecondary : colors.darkGrey}
          title={label}
          style={styles.label}
          size={14}
        />
      )}

      <ScrollView
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          contentContainerStyle,
        ]}
        style={[
          styles.block,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        {options.map((item) => {
          const isSelected = item.value === value;
          const rawTitle = isRtl
            ? item.label_arabic || item.label
            : item.label || item.label_arabic;
          const displayTitle = formatTitle(rawTitle);

          const activeBg = colors.loyaltyPrimary;
          const inactiveBg = isDark ? "#1E1E20" : "#F3F4F6";

          const activeBorder = colors.loyaltyPrimary;
          const inactiveBorder = isDark
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(0, 0, 0, 0.08)";

          const activeTextColor = isDark
            ? colors.loyaltyBtnTextPrimary || "#000000"
            : colors.loyaltyBtnTextPrimary || "#FFFFFF";
          const inactiveTextColor = isDark ? "#D1D5DB" : "#4B5563";

          return (
            <TouchableOpacity
              key={String(item.value)}
              activeOpacity={0.75}
              onPress={() => onChange(item.value)}
              style={[
                styles.tab,
                {
                  backgroundColor: isSelected ? activeBg : inactiveBg,
                  borderColor: isSelected ? activeBorder : inactiveBorder,
                  marginLeft: isRtl ? 8 : 0,
                  marginRight: isRtl ? 0 : 8,
                },
                tabStyle,
                isSelected && activeTabStyle,
              ]}
            >
              <TypographyText
                font={BALOO_REGULAR}
                textColor={isSelected ? activeTextColor : inactiveTextColor}
                title={displayTitle}
                size={14}
                style={[
                  styles.tabText,
                  isSelected && styles.activeTabText,
                  textStyle,
                  isSelected && activeTextStyle,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
  },
  scrollContainer: {
    paddingVertical: 2,
    alignItems: "center",
  },
  block: {
    marginTop: 2,
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 54,
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {
    marginBottom: 6,
    marginHorizontal: 4,
  },
  tabText: {
    fontWeight: "600",
    textAlign: "center",
  },
  activeTabText: {
    fontWeight: "700",
  },
});

export default TabsSelect;