import React from "react";
import { Field } from "formik";
import Select from "../../Form/Select";
import { View } from "react-native";

const FormikSelect = (props) => {
  const {
    name,
    wrapperStyle,
    onChange: onSelectChange,
    single,
    ...restProps
  } = props;

  return (
    <View style={wrapperStyle}>
      <Field name={name}>
        {({ field: { value }, form: { setFieldValue, errors } }) => {
          return (
            //@ts-ignore
            <Select
              {...restProps}
              // defaultValue={value}
              active={value}
              value={value}
              onChange={(val, item) => {
                setFieldValue(name, val);
                onSelectChange?.(item);
              }}
              onClearPress={() => {
                setFieldValue(name, single ? undefined : []);
              }}
              single={single}
              name={name}
              error={errors?.[name]}
            />
          );
        }}
      </Field>
    </View>
  );
};

export default FormikSelect;
