import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Field } from 'formik';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {TypographyText} from '../../../../components/Typography';
import DateSvg from '../../../../assets/loyaltyPoints/date.svg';
import CustomCalendar from '../../../../components/CustomDateCalendar';
import {colors} from '../../../../components/colors';
import {BALOO_2} from '../../../../redux/types';
import {isRTL} from '../../../../../utils';

const getDateString = date => {
  if (!date.getFullYear) return '';

  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};


const FormikDate = ({label, name}) => {
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const { t } = useTranslation();
  const isRtl = isRTL();

  return (
    <Field style={{flex: 1}} name={name}>
      {({ form: { setFieldValue, errors, values } }) => {
        const value = values[name];
        const error = errors[name];


        return (
           <>
          <View style={[styles.wrapper,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>

            <View style={styles.block}>
                <TypographyText 
                   title={label}
                   textColor={colors.loyaltyTextSecondary}
                   font={BALOO_2}
                   style={styles.label}
                />

                <TouchableOpacity 
                    style={[
                      styles.select,
                      {backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder},
                      {flexDirection: isRtl ? 'row-reverse': 'row'}
                    ]}
                    onPress={() => setIsDateModalVisible(true)}>

                 <DateSvg color={colors.loyaltyPrimary}/>

                  <TypographyText 
                   title={value || 'dd/mm/yyyy'}
                   style={styles.text}
                   textColor={colors.loyaltyTextMainTitle}
                   size={12}
                   font={BALOO_2}
                  />

                  {value && <TypographyText 
                   title={'Change'}
                   style={styles.changeText}
                   textColor={colors.loyaltyPrimary}
                   size={12}
                   font={BALOO_2}
                  />}


                </TouchableOpacity>
            </View>

            <CustomCalendar isVisible={isDateModalVisible} setIsVisible={setIsDateModalVisible} onApply={(date) =>setFieldValue(name, getDateString(date))}/>

          </View>
          {error &&  (
                <TypographyText
                    title={`${error}`}
                    textColor={"#FF406E"}
                    size={14}
                    font={BALOO_2}
                    style={{ fontWeight: "700", marginTop:  3 }}
                />
            )}
          </>
        );
      }}
    </Field>
  );
};

const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      width: '100%'
    },
    select: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 58,
      paddingHorizontal: 20,
      marginTop: 3,
      borderRadius: 17,
      width: '100%'
    },
    block: {
      height: 78,
      flex: 1
    },
    text: {
      flex: 1,
      marginHorizontal: 20
    },
    label: {
      marginHorizontal: 10
    }
});

export default FormikDate;
