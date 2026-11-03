import { PlatformPressable } from "@react-navigation/elements";
import { useTheme } from "@react-navigation/native";
import Color from "color";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { TypographyText } from "../../../Typography";
import { LUSAIL_REGULAR } from "../../../../redux/types";
import ArrowSvg from "../../../../assets/arrow_right.svg";
import { isRTL } from "../../../../../utils";
import { useTranslation } from "react-i18next";
import { colors as appColors } from "../../../colors";

const LinkPressable = ({
  children,
  style,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  to,
  accessibilityRole,
  ...rest
}) => {
  return (
    <PlatformPressable
      {...rest}
      accessibilityRole={accessibilityRole}
      onPress={onPress}
    >
      <View style={style}>{children}</View>
    </PlatformPressable>
  );
};

/**
 * A component used to show an action item with an icon and a label in a navigation drawer.
 */
export default function DrawerItem(props) {
  const { colors } = useTheme();
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const {
    icon,
    label,
    labelStyle,
    title,
    to,
    focused = false,
    allowFontScaling,
    activeTintColor = colors.primary,
    inactiveTintColor = Color(colors.text).alpha(0.68).rgb().string(),
    activeBackgroundColor = Color(activeTintColor).alpha(0.12).rgb().string(),
    inactiveBackgroundColor = "transparent",
    onPress,
    pressColor,
    pressOpacity,
    languages,
    isDark,
    counts,
    ...rest
  } = props;

  const { borderRadius = 10 } = StyleSheet.flatten({});
  const color = focused ? activeTintColor : inactiveTintColor;
  const backgroundColor = focused
    ? activeBackgroundColor
    : inactiveBackgroundColor;

  const iconNode = icon ? icon({ size: 20, focused, color }) : null;
  const textColor = isDark ? "#FFFFFF" : "#1C1C1E";
  const accentColor = isDark ? appColors.mainDarkMode : appColors.darkBlue;
  const iconBadgeColor = Color(accentColor).alpha(0.12).rgb().string();

  return (
    <View
      collapsable={false}
      {...rest}
      style={[
        styles.container,
        {
          borderRadius,
          backgroundColor,
          borderBottomColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
        },
      ]}
    >
      <LinkPressable
        onPress={onPress}
        style={[
          styles.wrapper,
          { borderRadius, flexDirection: isRTL() ? "row-reverse" : "row" },
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected: focused }}
        pressColor={pressColor}
        pressOpacity={pressOpacity}
        to={to}
      >
        <View style={[styles.iconBadge, { backgroundColor: iconBadgeColor }]}>
          {iconNode}
        </View>
        <View
          style={[
            styles.label,
            { flexDirection: isRTL() ? "row-reverse" : "row" },
          ]}
        >
          <TypographyText
            textColor={textColor}
            size={15}
            font={LUSAIL_REGULAR}
            title={title}
            style={[styles.itemText, { fontWeight: "600" }]}
          />

          <View
            style={[
              styles.langWrapper,
              {
                flexDirection: isRTL() ? "row-reverse" : "row",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            {!!languages && (
              <View
                style={[
                  styles.languageChip,
                  {
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.08)"
                      : "#E5E7EB",
                  },
                ]}
              >
                <TypographyText
                  textColor={isDark ? "#D1D5DB" : "#4B5563"}
                  size={13}
                  font={LUSAIL_REGULAR}
                  title={lang == "ar" ? "English" : "عربي"}
                  style={styles.langText}
                />
              </View>
            )}

            {counts != undefined && (
              <View style={styles.itemCount}>
                <TypographyText
                  textColor={"#FFFFFF"}
                  size={12}
                  font={LUSAIL_REGULAR}
                  title={counts}
                  style={{ fontWeight: "700" }}
                />
              </View>
            )}

            <ArrowSvg
              color={isDark ? "#71717A" : "#9CA3AF"}
              height={18}
              width={18}
              style={{ transform: [{ rotate: isRTL() ? "180deg" : "0deg" }] }}
            />
          </View>
        </View>
      </LinkPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 11,
    paddingHorizontal: 6,
    overflow: "hidden",
    borderBottomWidth: 1,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  itemText: {
    marginLeft: 14,
    marginRight: 14,
  },
  itemCount: {
    backgroundColor: "#EF4444",
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    marginHorizontal: 8,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  langWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  languageChip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
  },
  langText: {
    fontWeight: "600",
  },
});
