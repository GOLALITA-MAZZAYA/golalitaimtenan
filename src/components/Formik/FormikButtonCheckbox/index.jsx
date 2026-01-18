import React from "react";
import { Field } from "formik";
import { View } from "react-native";
import ButtonCheckbox from "../../Form/ButtonCheckbox";

const FormikButtonCheckbox = (props) => {
  const { name, wrapperStyle, onChange: onBtnChange, ...restProps } = props;

  return (
    <View style={wrapperStyle}>
      <Field name={name}>
        {({ field: { value }, form: { setFieldValue } }) => {
          return (
            <ButtonCheckbox
              {...restProps}
              isActive={!!value}
              onChange={() => {
                setFieldValue(name, !value);
              }}
              name={name}
            />
          );
        }}
      </Field>
    </View>
  );
};

export default FormikButtonCheckbox;
