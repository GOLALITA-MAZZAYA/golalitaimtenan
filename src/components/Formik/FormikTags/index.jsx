import React from "react";
import { StyleSheet, View } from "react-native";
import { Field } from "formik";
import Tags from "../../Form/Tags";

const FormikTags = (props) => {
  const { name, wrapperStyle, data, ...restProps } = props;

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <Field name={name}>
        {({ field: { value }, form: { setFieldValue } }) => {
          return (
            <Tags
              {...restProps}
              value={value}
              data={data}
              name={name}
              onSelect={(val) => {
                setFieldValue(name, val);
              }}
              onRemove
            />
          );
        }}
      </Field>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
});

export default FormikTags;
