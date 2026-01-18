import { useTranslation } from 'react-i18next';
import Input from '../../../../components/Input/Input';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useRef, useState } from 'react';
import { Field } from 'formik';

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
  const [isDepartureDateVisible, setIsDepartureDateVisible] = useState(false);
  const [isReturnDateVisible, setIsReturnDateVisible] = useState(false);
  const { t } = useTranslation();
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  return (
    <Field>
      {({ form: { setFieldValue, errors, values } }) => {
        return (
          <>
            <Input
              label={t('BillScanner.dateLabel')}
              value={values.date}
              onChangeText={() => {}}
              returnKeyType={'next'}
              error={errors.date}
              wrapperStyle={{ marginBottom: 20 }}
              onFocus={() => setIsDepartureDateVisible(true)}
              innerRef={dateInputRef}
            />
            <Input
              label={t('BillScanner.timeLabel')}
              value={values.time}
              onChangeText={() => {}}
              returnKeyType={'next'}
              error={errors.time}
              onFocus={() => {
                setIsReturnDateVisible(true);
              }}
              wrapperStyle={{ marginBottom: 20 }}
              innerRef={timeInputRef}
            />

            <DateTimePickerModal
              isVisible={isDepartureDateVisible}
              mode="date"
              onConfirm={date => {
                setFieldValue('date', getDateString(date));
                setIsDepartureDateVisible(false);
              }}
              onCancel={() => {
                setIsDepartureDateVisible(false);
              }}
              minimumDate={getOneMonthAgoDate()}
              maximumDate={new Date()}
            />
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
          </>
        );
      }}
    </Field>
  );
};

export default FormikDatePickers;
