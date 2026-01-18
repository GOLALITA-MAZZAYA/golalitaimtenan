import React from "react";
import { useSelector } from "react-redux";
import { Image, StyleSheet, View } from "react-native";
import { Search } from "./Search";
import { userSelector } from "../../../../../redux/auth/auth-selectors";
import { useTranslation } from "react-i18next";

export function SearchFiledWithProfilePhoto({ style, onChangeText, isDark }) {
  const user = useSelector(userSelector);
  const { t } = useTranslation();

  return (
    <View style={[styles.wrapper, style]}>
      <Search
        placeholder={t("RestaurantList.searchPlaceholder")}
        onChangeText={onChangeText}
        isDark={isDark}
      />
      <Image style={styles.userProfileIcon} source={{ uri: user?.photo }} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    height: 32,
  },
  userProfileIcon: {
    marginStart: 16,
    width: 32,
    height: 32,
    borderRadius: 32,
  },
});
