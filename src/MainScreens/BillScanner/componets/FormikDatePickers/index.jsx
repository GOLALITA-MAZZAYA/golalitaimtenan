import { useTranslation } from 'react-i18next';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useState } from 'react';
import { Field } from 'formik';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {TypographyText} from '../../../../components/Typography';
import DateSvg from '../../../../assets/loyaltyPoints/date.svg';
import TimeSvg from '../../../../assets/loyaltyPoints/time.svg';
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

const getTimeString = date => {
  if (!date.getFullYear) return '';

  const minutes = date.getMinutes();

  const transformedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${date.getHours()}:${transformedMinutes}`;
};

const getOneMonthAgoDate = () => {
  const ONE_MONTH_AGO = new Date();
  ONE_MONTH_AGO.setMonth(ONE_MONTH_AGO.getMonth() - 1);

  return ONE_MONTH_AGO;
};

const getTimeAsDate = (hours, minutes) => {
  const now = new Date();
  now.setHours(hours);
  now.setMinutes(minutes);
  now.setSeconds(0);
  now.setMilliseconds(0);
  return now;
};

const FormikDatePickers = () => {
  const [isReturnDateVisible, setIsReturnDateVisible] = useState(false);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const { t } = useTranslation();
  const isRtl = isRTL();

  return (
    <Field>
      {({ form: { setFieldValue, errors, values } }) => {
        return (
           <>
          <View style={[styles.wrapper,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>

            <View style={styles.block}>
                <TypographyText 
                   title={t('BillScanner.date')}
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

                  <TypographyText 
                   title={values.date || 'dd/mm/yyyy'}
                   style={styles.text}
                   textColor={colors.loyaltyTextMainTitle}
                   size={12}
                   font={BALOO_2}
                  />

                  <DateSvg color={colors.loyaltyPrimary}/>

                </TouchableOpacity>
            </View>

             <View style={styles.block}>
                <TypographyText 
                   title={t('BillScanner.time')}
                   textColor={colors.loyaltyTextSecondary}
                   font={BALOO_2}
                   style={styles.label}
                />

                <TouchableOpacity 
                   style={
                    [styles.select,
                    {backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder},
                    {flexDirection: isRtl ? 'row-reverse': 'row'}
                  ]}
                   onPress={() => setIsReturnDateVisible(true)}>

                  <TypographyText 
                   title={values.time || '— / — / —'}
                   style={styles.text}
                   textColor={colors.loyaltyTextMainTitle}
                   size={12}
                   font={BALOO_2}
                  />

                  <TimeSvg color={colors.loyaltyPrimary}/>

                </TouchableOpacity>
            </View>


            <CustomCalendar isVisible={isDateModalVisible} setIsVisible={setIsDateModalVisible} onApply={(date) =>setFieldValue('date', getDateString(date))}/>

   
            <DateTimePickerModal
              isVisible={isReturnDateVisible}
              mode="time"
              onConfirm={date => {
                setFieldValue('time', getTimeString(date));
                setIsReturnDateVisible(false);
              }}
              onCancel={() => {
                setIsReturnDateVisible(false);
              }}
              minimumDate={getTimeAsDate(0, 0)}
              maximumDate={getTimeAsDate(23, 59)}
              is24Hour={true}
            />
          </View>
          {(errors['date'] || errors['time']) &&  (
                <TypographyText
                    title={`${errors['date'] || errors['time']}`}
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
      marginTop: 20
    },
    select: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 58,
      width: 160,
      paddingHorizontal: 20,
      marginTop: 3,
      borderRadius: 17,
    },
    block: {
      height: 78
    },
    text: {
      flex: 1
    },
    label: {
      marginHorizontal: 10
    }
});

export default FormikDatePickers;
