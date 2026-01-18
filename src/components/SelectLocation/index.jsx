import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { LocationIcon } from "../../assets/delivery_assets";
import { BALOO_MEDIUM } from "../../redux/types";
import { TypographyText } from "../Typography";
import { colors } from "../colors";
import { useTranslation } from "react-i18next";

const SelectLocation = ({ onPress, location, style = {}, isDark }) => {
  const { t } = useTranslation();

  let text = t("Location.choose");
  const editText = location ? t("Location.change") : t("Location.select");

  if (location) {
    text = location.formatted_address;
  }

  const themeColor = isDark ? colors.white : colors.darkBlue;

  return (
    <TouchableOpacity
      style={[styles.layout, { borderColor: themeColor }, style]}
      onPress={onPress}
    >
      <LocationIcon style={styles.locationIcon} color={themeColor} />
      <View style={{ flex: 1 }}>
        <TypographyText
          title={`${t("Location.deliverTo")}:`}
          textColor={themeColor}
          size={11}
          font={BALOO_MEDIUM}
          style={styles.subTitle}
        />
        <TypographyText
          title={text}
          textColor={themeColor}
          size={14}
          font={BALOO_MEDIUM}
          style={styles.title}
          numberOfLines={2}
        />
      </View>

      <View>
        <TypographyText
          title={editText}
          textColor={themeColor}
          size={14}
          font={BALOO_MEDIUM}
          style={[styles.title, { marginHorizontal: 12 }]}
          numberOfLines={2}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  layout: {
    flexDirection: "row",
    borderRadius: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    padding: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  locationIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 12,
  },
  subTitle: {
    fontWeight: "500",
    fontSize: 11,
    lineHeight: 18,
  },
  title: {
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 22,
  },
});

export default SelectLocation;
