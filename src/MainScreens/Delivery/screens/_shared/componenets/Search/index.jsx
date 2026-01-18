import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { SearchIconDark } from "../../../../../../assets/delivery_assets";
import { colors } from "../../../../../../components/colors";

export const Search = ({ style, onChangeText, placeholder, value, isDark }) => (
  <View style={[styles.searchFiled, style]}>
    <SearchIconDark />
    <TextInput
      style={[styles.input, { color: isDark ? colors.white : colors.darkBlue }]}
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      placeholderTextColor={colors.grey}
    />
  </View>
);

const styles = StyleSheet.create({
  searchFiled: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grey,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    flex: 1,
  },
  input: {
    marginLeft: 5,
    flex: 1,
  },
  searchIcon: {
    width: 10,
    height: 10,
  },
});
