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

  const { borderRadius = 4 } = StyleSheet.flatten({});
  const color = focused ? activeTintColor : inactiveTintColor;
  const backgroundColor = focused
    ? activeBackgroundColor
    : inactiveBackgroundColor;

  const iconNode = icon ? icon({ size: 24, focused, color }) : null;
  const textColor = isDark ? "white" : "#343434";

  return (
    <View
      collapsable={false}
      {...rest}
      style={[
        styles.container,
        {
          borderRadius,
          backgroundColor,
          borderBottomColor: isDark ? "#2F2F2F" : "#E6E6E6",
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
        {iconNode}
        <View
          style={[
            styles.label,
            { flexDirection: isRTL() ? "row-reverse" : "row" },
          ]}
        >
          <TypographyText
            textColor={textColor}
            size={18}
            font={LUSAIL_REGULAR}
            title={title}
            style={[styles.itemText]}
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
              <TypographyText
                textColor={textColor}
                size={15}
                font={LUSAIL_REGULAR}
                title={lang == "ar" ? "English" : "عربي"}
                style={styles.itemText}
              />
            )}

            {counts != undefined && (
              <View style={styles.itemCount}>
                <TypographyText
                  textColor={isDark ? "white" : "white"}
                  size={14}
                  font={LUSAIL_REGULAR}
                  title={counts}
                  style={{}}
                />
              </View>
            )}

            <ArrowSvg
              color="#838383"
              height={20}
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
    paddingVertical: 12,
    overflow: "hidden",
    borderBottomWidth: 1,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 4,
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  button: {
    display: "flex",
  },
  itemText: {
    marginLeft: 15,
    marginRight: 15,
  },
  itemCount: {
    backgroundColor: "red",
    padding: 2,
    minWidth: 24,
    borderRadius: 26,
    marginHorizontal: 10,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  langWrapper: {
    flexDirection: "row",
  },
});
