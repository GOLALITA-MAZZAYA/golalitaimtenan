import React from "react";
import { Text, StyleSheet, ActivityIndicator } from "react-native";
import {
  BALOO_BOLD,
  BALOO_EXTRABOLD,
  BALOO_MEDIUM,
  BALOO_REGULAR,
  BALOO_SEMIBOLD,
} from "../redux/types";
import { isRTL } from "../../utils";

export const TypographyText = (props) => {
  const {
    title,
    textColor = "grey",
    size = 14,
    weight = "normal",
    font,
    transform,
    style,
    loading,
    ...rest
  } = props;
  const textStyles = [
    {
      color: textColor,
      fontSize: size,
      textTransform: transform,
      fontFamily: font,
      textAlign: isRTL() ? "right" : "left",
    },
  ];

  if(loading){
    return <ActivityIndicator color={textColor}/>
  }

  return (
    <Text style={[textStyles, style]} {...rest}>
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  regular: {
    fontFamily: BALOO_REGULAR,
  },
  medium: {
    fontFamily: BALOO_MEDIUM,
  },
  semiBold: {
    fontFamily: BALOO_SEMIBOLD,
  },
  bold: {
    fontFamily: BALOO_BOLD,
  },
  extraBold: {
    fontFamily: BALOO_EXTRABOLD,
  },
});
