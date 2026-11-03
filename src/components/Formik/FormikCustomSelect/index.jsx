import React from "react";
import { View } from "react-native";
import { Field } from "formik";
import {TypographyText} from "../../Typography";
import {BALOO_2} from "../../../redux/types";
import CustomSelect from "../../Form/CustomSelect";

const FormikCustomSelect = (props) => {
  const { name, wrapperStyle = {}, ...restProps } = props;
  return (
    <View style={wrapperStyle}>
      <Field name={name}>
        {({ field: { value, }, form: { setFieldValue,  errors, submitCount} }) => {

        errors = submitCount > 0 ? errors : {};

          return  (
            <>
             <CustomSelect
                {...restProps}
                value={value}
                onSelect={(item) => {
                  setFieldValue(name, item);
                }}
              />

            {errors?.[name] && (
                 <TypographyText
                    title={errors[name]}
                    textColor={"#FF406E"}
                    size={14}
                    font={BALOO_2}
                    style={{ fontWeight: "700" }}
                 />
            )}
            
            </>
          );
        }}
      </Field>
    </View>
  );
};


export default FormikCustomSelect;
