import { Field } from 'formik';
import {StyleSheet,  View} from 'react-native';
import {TypographyText} from '../../../components/Typography';
import {BALOO_2} from '../../../redux/types';
import {isRTL} from '../../../../utils';
import HorizontalTimes from '../../Form/HorizontalTimes';

const FormikHorizontalTimes = ({label, times, name, loading}) => {
  const isRtl = isRTL();

  return (
    <Field style={{flex: 1}} name={name}>
      {({ form: { setFieldValue, errors, values } }) => {
        const value = values[name];
        const error = errors[name];

        return (
           <>
          <View style={[styles.wrapper,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>

            <HorizontalTimes label={label} selectedTime={value} setTime={time => setFieldValue(name,time)} times={times} loading={loading}/>

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
});

export default FormikHorizontalTimes;
