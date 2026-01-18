import { Field } from "formik";
import CountryPicker from "../../Form/CountryPicker";
import { View } from "react-native";

const FormikCountryPicker = (props) => {
  const { wrapperStyle, value: propsValue, name, ...restProps } = props;
  return (
    <View style={wrapperStyle}>
      <Field name={name}>
        {({ field: { value }, form: { setFieldValue } }) => {
          return (
            <CountryPicker
              {...restProps}
              value={propsValue || value}
              onChange={(val) => {
                setFieldValue(name, val);
              }}
            />
          );
        }}
      </Field>
    </View>
  );
};

export default FormikCountryPicker;
