import React from "react";
import { StyleSheet, View } from "react-native";
import CloseSvg from "../../../assets/close.svg";
import { sized } from "../../../Svg";
import { Field } from "formik";
import { TouchableOpacity } from "react-native";
import { BALOO_REGULAR } from "../../../redux/types";
import { useTheme } from "../../ThemeProvider";
import Input from "../../Input/Input";

const CloseIcon = sized(CloseSvg, 14, 14, "#312B3E");

const FormikTextInput = (props) => {
  const { name, wrapperStyle = {}, ...restProps } = props;

  const { isDark } = useTheme();

  return (
    <View style={wrapperStyle}>
      <Field name={name}>
        {({ field: { value }, form: { setFieldValue } }) => {
          const showClearIcon = Boolean(props.allowClear && value);

          return (
            <>
              <Input
                {...restProps}
                style={{...styles.input,  color: isDark ? "#fff" : "#312B3E" }}
                placeholderTextColor={isDark ? "#fff" : "#999CAD"}
                value={value}
                onChangeText={(val) => {
                  setFieldValue(name, val);
                }}
              />

              {showClearIcon && (
                <TouchableOpacity
                  onPress={() => setFieldValue(name, "")}
                  style={styles.iconWrap}
                >
                  <CloseIcon />
                </TouchableOpacity>
              )}
            </>
          );
        }}
      </Field>
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontFamily: BALOO_REGULAR,
  },
});

export default FormikTextInput;
