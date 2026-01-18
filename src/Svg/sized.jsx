import { SvgProps } from "react-native-svg";
import React, { ComponentType, FC, useMemo } from "react";
import { StyleSheet } from "react-native";

// noinspection JSSuspiciousNameCombination
export default (Icon, width, height = width, color) =>
  (props) => {
    const { style: _style, ...rest } = props;
    const style = useMemo(
      () => StyleSheet.flatten([{ width, height }, _style]),
      [_style]
    );
    return (
      <Icon
        style={style}
        width={style.width ?? width}
        height={style.height ?? height}
        color={color}
        {...rest}
      />
    );
  };
