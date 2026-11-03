import React from "react";
import { View } from "react-native";
import { Field } from "formik";
import {TypographyText} from "../../Typography";
import CustomPhoneInput from "../../Form/CustomPhoneInput";
import {BALOO_2} from "../../../redux/types";

const FormikCustomPhoneInput = (props) => {
  const { name, wrapperStyle = {}, ...restProps } = props;



  return (
    <View style={wrapperStyle}>
      <Field name={name}>
        {({ field: { value }, form: { setFieldValue,  errors, submitCount} }) => {

          errors = submitCount > 0 ? errors : {};

          return  (
            <>

            <CustomPhoneInput 
               {...restProps}
               value={value}
               onChange={(val) => {
                  setFieldValue(name, val);
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


export default FormikCustomPhoneInput;
