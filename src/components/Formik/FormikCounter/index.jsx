import React from "react";
import { View } from "react-native";
import { Field } from "formik";
import {TypographyText} from "../../Typography";
import {BALOO_2} from "../../../redux/types";
import Counter from "../../Form/Counter";

const FormikCounter = (props) => {
  const { name, wrapperStyle = {}, ...restProps } = props;

  return (
    <View style={wrapperStyle}>
      <Field name={name}>
        {({ field: { value, }, form: { setFieldValue,  errors, submitCount} }) => {

        errors = submitCount > 0 ? errors : {};

          return  (
            <>
            <Counter  
               value={value}
               onIncrease={(val) => setFieldValue(name, val)}
               onDecrease={(val) => setFieldValue(name, val)}
               {...restProps}
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


export default FormikCounter;
