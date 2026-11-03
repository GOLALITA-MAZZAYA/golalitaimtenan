import { useTranslation } from "react-i18next";
import { getAllMerchantsForScan } from "../../../../api/merchants";
import ModalSelect from "../../../../components/Form/ModalSelect";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {TypographyText} from "../../../../components/Typography";
import {BALOO_2} from "../../../../redux/types";
import {colors} from "../../../../components/colors";
import ArrowSvg from '../../../../assets/loyaltyPoints/rightArrow';
import {isRTL} from "../../../../../utils";
import {Field, useFormikContext} from "formik";

const transformMerchants = (items) => {

  return items.map((option) => ({
    value: option.name,
    label: option.name,
    label_arabic: option.x_arabic_name || option.name,
  }));
};

const getMerchants = async () => {
  const merchants = await getAllMerchantsForScan();


  const options = transformMerchants(merchants);

  return options;
};



const AsyncFormikMerchantSelect = () => {
    const {t} = useTranslation();
    const { setFieldValue } = useFormikContext();

    const name="merchant_name"


    const isRtl = isRTL();

    const renderSelect = ({openModal}) => {

      return (
        <Field name={name}>
              {({ field: { value }, form: { errors } }) => {
          return (
            <>
          <TouchableOpacity onPress={openModal}  style={[styles.select,{flexDirection: isRtl ? 'row-reverse': 'row', backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder}]}>
                  <TypographyText 
                     title={ value ? `${value}`: t('BillScanner.selectMerchantTitle')}
                     style={styles.placeholder}
                     font={BALOO_2}
                     size={12}
                     textColor={colors.loyaltyTextMainTitle}
                  />
      
                  <View style={[
                      styles.arrow,
                      {
                       transform: [
                         { rotate: '90deg' },
                       ]
                      }
      
                  ]}>
                    <ArrowSvg color={colors.loyaltyPrimary}/>
                  </View>
            </TouchableOpacity>
              
                   {errors[name] && (
                        <TypographyText
                          title={errors[name]}
                          textColor={"#FF406E"}
                          size={14}
                          style={{ fontWeight: "700", marginTop: 3 }}
                        />
                    )}
                  
           
                </>
          )
          }}
        </Field>
      )
    };

    const handleSubmit = (value) => {
      setFieldValue(name,value)
    }

    return (
        <>
        <TypographyText 
           size={16}
           font={BALOO_2}
           title={t('BillScanner.merchantPartner')}
           textColor={colors.loyaltyTextSecondary}
           style={{paddingHorizontal: 9}}
        />

        <ModalSelect
           modalKeyName={'gift-cards-categories'}
           onSubmit={handleSubmit}
           fetchData={getMerchants}
           renderSelect={renderSelect}
           modalText={{
             mainTitle: t('BillScanner.merchantsTitle'),
             searchPlaceholder: t('BillScanner.merchantsSearchPlaceholder'),
             submitText:  t('BillScanner.selectMerchant')
           }}
           label={t("BillScanner.merchantsLabel")}
        />
        </>
    )
};

const styles = StyleSheet.create({
   select: {
        height: 58,
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 23
    },
    placeholder: {
      paddingHorizontal: 20,
      flex: 1
    },
    arrow: {
      paddingHorizontal: 20
    },
})

export default AsyncFormikMerchantSelect;