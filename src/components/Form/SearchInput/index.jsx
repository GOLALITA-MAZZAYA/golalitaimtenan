import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import CloseSvg from "../../../assets/close.svg";
import { sized } from "../../../Svg";
import { TouchableOpacity } from "react-native";
import { LUSAIL_REGULAR } from "../../../redux/types";
import { useTheme } from "../../ThemeProvider";
import SearchSvg from "../../../assets/search.svg";
import { getTextAlign } from "../../../../utils";

const SearchInput = (props) => {
  const { wrapperStyle, onChangeText, onClearPress, value, ...restProps } =
    props;
  const { isDark } = useTheme();

  const CloseIcon = sized(CloseSvg, 14, 14, isDark ? "#838383" : "#072536");

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <View style={styles.searchIcoWrapper}>
        <SearchSvg color={isDark ? "#838383" : "#072536"} />
      </View>
      <TextInput
        {...restProps}
        style={[
          styles.input,
          { color: isDark ? "white" : "#072536" },
          getTextAlign(),
        ]}
        placeholderTextColor={isDark ? "#838383" : "#999CAD"}
        value={value}
        onChangeText={onChangeText}
      />

      {!!value && (
        <TouchableOpacity onPress={onClearPress} style={styles.iconWrap}>
          <CloseIcon />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    borderColor: "#999CAD",
    height: 52,
    paddingLeft: 10,
  },
  searchIcoWrapper: {
    paddingRight: 10,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    height: 20,
    width: 20,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: LUSAIL_REGULAR,
    paddingRight: 16,
  },
});

export default SearchInput;
