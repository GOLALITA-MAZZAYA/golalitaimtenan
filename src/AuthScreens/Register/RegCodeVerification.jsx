import React, { useEffect } from 'react';
import {
  Keyboard,
  Platform,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import i18next from 'i18next';
import { connect, useDispatch } from 'react-redux';
import { colors } from '../../components/colors';
import Input from '../../components/Input/Input';
import { getPixel, mainStyles, SCREEN_HEIGHT } from '../../styles/mainStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CommonButton from '../../components/CommonButton/CommonButton';
import { useTheme } from '../../components/ThemeProvider';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import authApi from '../../redux/auth/auth-api';
import { setRegisterationcodeLoading } from '../../redux/auth/auth-actions';
import { verifyRegisterCode } from '../../redux/auth/auth-thunks';
import { ScrollView } from 'react-native-gesture-handler';

const RegCodeVerification = ({
  route,
  navigation,
  setRegisterationcodeLoading,
  registrationcodeLoading,
  verifyRegisterCode,
}) => {
  let params = route.params;
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const toLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View
      scrollEnabled={Platform.OS === 'android'}
      style={{
        backgroundColor: isDark ? colors.darkBlue : colors.bg,
        flex: 1,
      }}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        bounces={true}
      >
        <Header btns={'back'} />

        <TouchableOpacity
          activeOpacity={1}
          onPress={Keyboard.dismiss}
          style={{ flex: 1 }}
        >
          <View
            style={[
              mainStyles.centeredRow,
              { marginTop: getPixel(10), flexDirection: 'column', flex: 1 },
            ]}
          >
            <TypographyText
              title={t('Login.enterRegisterCode')}
              textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
              size={23}
              font={LUSAIL_REGULAR}
              style={[
                mainStyles.centeredText,
                { marginTop: 20, paddingHorizontal: 50, fontWeight: '700' },
              ]}
            />
          </View>
          <View style={[mainStyles.p20, { marginTop: getPixel(7), flex: 2 }]}>
            <Formik
              initialValues={{
                registration_code: '',
                email: '',
              }}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={async (values, { setFieldError }) => {
                try {
                  dispatch(setRegisterationcodeLoading(true));

                  const { email } = values;

                  const res = await authApi.checkEmail({
                    params: { email },
                  });

                  console.log('authApi.checkEmail res data:', res.data);
                  if (res.data.result?.error) {
                    setFieldError('email', t('Profile.emailExists'));
                    throw 'err';
                  }
                  verifyRegisterCode(
                    {
                      params: {
                        code: values.registration_code,
                        email: values.email,
                      },
                    },
                    navigation,
                    setFieldError,
                    t,
                    params?.registerBody,
                    params?.isForgotPassword,
                  );
                } catch (err) {
                  console.log(err, 'error');
                } finally {
                  dispatch(setRegisterationcodeLoading(false));
                }
              }}
              validationSchema={Yup.object({
                registration_code: Yup.string().required(t('Login.required')),
                email: Yup.string()
                  .email(t('Login.invalidEmail'))
                  .required(t('Login.required')),
              })}
            >
              {({
                values,
                handleChange,
                handleSubmit,
                errors,
                submitCount,
              }) => {
                errors = submitCount > 0 ? errors : {};
                return (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'space-between',
                      paddingBottom: 26,
                      marginBottom: 19,
                    }}
                  >
                    <View>
                      <Input
                        label={t('Login.code')}
                        placeholder={t('Login.code')}
                        value={values.registration_code}
                        onChangeText={handleChange('registration_code')}
                        error={errors.registration_code}
                        returnKeyType={'next'}
                        wrapperStyle={{ marginBottom: 10 }}
                      />

                      <Input
                        label={t('Login.email')}
                        placeholder={t('Login.emailPlaceholder')}
                        value={values.email}
                        onChangeText={e => {
                          handleChange('email')(e.toLowerCase());
                        }}
                        error={errors.email}
                        returnKeyType={'next'}
                        autoCapitalize="none"
                        wrapperStyle={{ marginBottom: 12 }}
                        style={{ fontSize: 16, marginTop: 20 }}
                      />
                    </View>

                    <View>
                      <CommonButton
                        onPress={handleSubmit}
                        label={t('Login.verify')}
                        textColor={
                          isDark ? colors.mainDarkModeText : colors.white
                        }
                        loading={registrationcodeLoading}
                      />

                      <TouchableOpacity style={styles.bottom} onPress={toLogin}>
                        <TypographyText
                          title={t('Login.haveAccount')}
                          textColor={isDark ? colors.mainDarkMode : colors.grey}
                          size={14}
                          font={LUSAIL_REGULAR}
                        />

                        <View style={styles.link}>
                          <TypographyText
                            title={t('Login.signInShort')}
                            textColor={
                              isDark ? colors.mainDarkMode : colors.darkBlue
                            }
                            size={18}
                            style={mainStyles.underline}
                            font={LUSAIL_REGULAR}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            </Formik>
          </View>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  codeWrapper: {
    marginBottom: 80,
    paddingHorizontal: 30,
  },
  cellWrapper: {
    ...mainStyles.cell,
    ...mainStyles.lightShadow,
    borderWidth: 0,
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  cell: {
    color: '#072536',
    fontSize: 24,
    fontFamily: LUSAIL_REGULAR,
    textAlign: 'center',
    fontWeight: '700',
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 70,
  },
});

export default connect(
  state => ({
    registrationcodeLoading: state.authReducer.registrationcodeLoading,
  }),
  { verifyRegisterCode, setRegisterationcodeLoading },
)(RegCodeVerification);
