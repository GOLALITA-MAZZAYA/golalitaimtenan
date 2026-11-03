import {StyleSheet, TextInput, View} from "react-native";
import {TypographyText} from "../../../../components/Typography";
import {isRTL} from "../../../../../utils";
import {colors} from "../../../../components/colors";
import {BALOO_2} from "../../../../redux/types";
import {useTranslation} from "react-i18next";
import {Field} from "formik";

const FormikDiscountAndAmount = ({discountError, amountError}) => {
    const isRtl = isRTL();
    const {t} = useTranslation();


    return (
       <>
       <View style={[styles.wrapper,{flexDirection: isRtl ? 'row-reverse': 'row', backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder}]}>

          <Field name={'discount'}>
                {({ field: { value }, form: { setFieldValue } }) => {
           
       return <View style={[styles.container,{marginRight: isRtl? 0: 10, marginLeft: isRtl ? 10: 0}]}>

            <TypographyText 
              title={t('BillScanner.discount')}
              font={BALOO_2}
              size={12}
              style={styles.label}
              textColor={colors.loyaltyTextSecondary}
            />

            <View style={[
                styles.inputBlock,
                {flexDirection: isRtl ? 'row-reverse': 'row',
                 borderColor: colors.loyaltyPrimary}
                 ]}>

                <TextInput 
                   style={[styles.input,{color: colors.loyaltyTextMainTitle,textAlign: isRtl? 'right': 'left'}]}
                   placeholderTextColor={colors.loyaltyTextMainTitle}
                   placeholder={'0'}
                   onChangeText={(text) => setFieldValue('discount', text)}
                   value={value}
                   keyboardType="numeric"
                />

                 <TypographyText 
                   title="%"
                   style={styles.sign}
                   size={20}
                   textColor={colors.loyaltyTextMainTitle}
                   font={BALOO_2}

                 />

            </View>

         </View>
         }}
         </Field>

    <Field name={'total_bill_amount'}>
                {({ field: { value }, form: { setFieldValue } }) => {
        return <View style={[styles.container,{ marginRight: isRtl? 10: 0, marginLeft: isRtl ? 0: 10}]}>

            <TypographyText 
              title={t('BillScanner.amount')}
              font={BALOO_2}
              size={12}
              style={styles.label}
              textColor={colors.loyaltyTextSecondary}
            />

            <View style={[
                styles.inputBlock,
                {flexDirection: isRtl ? 'row-reverse': 'row', borderColor: colors.loyaltyPrimary,

                }]}>

                <TextInput 
                   style={[styles.input,{color: colors.loyaltyTextMainTitle, textAlign: isRtl? 'right': 'left'}]}
                   placeholderTextColor={colors.loyaltyTextMainTitle}
                   placeholder={'0.00'}
                   onChangeText={(text) => setFieldValue('total_bill_amount', text)}
                   value={value}
                   keyboardType="numeric"
                />

                 <TypographyText 
                   title="QAR"
                   style={styles.sign}
                   size={20}
                   textColor={colors.loyaltyTextMainTitle}
                   font={BALOO_2}
                 />

            </View>

        </View>
                }}
        </Field>

       </View>
            {(discountError || amountError) &&  (
                <TypographyText
                    title={`${discountError || amountError}`}
                    textColor={"#FF406E"}
                    size={14}
                    font={BALOO_2}
                    style={{ fontWeight: "700", marginTop:  3 }}
                />
            )}
            </>
    )
};

const styles = StyleSheet.create({
   wrapper: {
     paddingHorizontal: 20,
     paddingVertical: 20,
     borderWidth: 1,
     borderRadius: 38,
     marginTop: 20
   },
   container: {
     flex: 1,
   },
   inputBlock: {
     borderBottomWidth: 2,
     height: 50,
     alignItems: 'center',
     marginTop: 3
   },
   input: {
    fontSize: 20,
    flex: 1,
    paddingHorizontal: 3
   },
   sign: {
     paddingHorizontal: 3
   },
   label: {
    marginHorizontal: 5
   }
});

export default FormikDiscountAndAmount;