import React from 'react';
import {
  Keyboard,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { colors } from '../../components/colors';
import { mainStyles } from '../../styles/mainStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CommonButton from '../../components/CommonButton/CommonButton';
import { useTheme } from '../../components/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { CodeField, Cursor } from 'react-native-confirmation-code-field';
import { connect } from 'react-redux';
import { verify } from '../../redux/auth/auth-thunks';
import ShieldSvg from '../../assets/shield.svg';
import AuthLayout from '../component/AuthLayout';
import Header from '../../components/Header';

const Verification = ({ route, navigation, verify, profileLoading }) => {
  let params = route.params;
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const titleText = params.phone
    ? t('Login.enter4DigitsPhone')
    : t('Login.enter4DigitsEmail');

  const verificationEntity = params.email || params.phone;

  return (
    <AuthLayout light>
      <SafeAreaView style={{ flex: 1 }}>
        <Header btns={['back']}/>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          bounces={false}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={Keyboard.dismiss}
            style={{ flex: 1 }}
          >
            <Formik
              initialValues={{
                code: '',
              }}
              onSubmit={(values, { setFieldError }) => {
                verify(
                  {
                    params: {
                      otp: values.code,
                      phone: params?.phone,
                      email: params?.email,
                    },
                  },
                  navigation,
                  setFieldError,
                  t,
                  params?.registerBody,
                  params?.isForgotPassword,
                );
              }}
              validationSchema={Yup.object({
                code: Yup.string().required(t('Login.required')),
              })}
            >
              {({
                values,
                handleChange,
                handleSubmit,
                errors,
                submitCount,
                setFieldError,
              }) => {
                errors = submitCount > 0 ? errors : {};
                return (
                  <>
                    <View style={styles.wrapper}>
                      <View style={styles.mainInfoWrapper}>
                        <ShieldSvg
                          style={mainStyles.registerIcon}
                          color={colors.darkBlue}
                        />
                        <TypographyText
                          title={t('Login.otpVerification')}
                          textColor={isDark ? colors.white : colors.darkBlue}
                          size={22}
                          style={styles.title}
                        />
                        <TypographyText
                          title={titleText}
                          textColor={isDark ? colors.white : colors.darkBlue}
                          size={18}
                          style={styles.description}
                        />

                        <TypographyText
                          title={verificationEntity}
                          textColor={isDark ? colors.white : colors.darkBlue}
                          size={18}
                          style={styles.description}
                        />

                        <View style={styles.codeWrapper}>
                          <CodeField
                            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                            value={values.code}
                            onChangeText={handleChange('code')}
                            cellCount={4}
                            rootStyle={[
                              styles.codeWrapper,
                            ]}
                            textContentType="oneTimeCode"
                            autoComplete="sms-otp"
                            keyboardType="number-pad"
                            renderCell={({ index, symbol, isFocused }) => (
                              <View style={styles.cellWrapper}>
                                <Text
                                  key={index}
                                  style={[
                                    styles.cell,
                                    isFocused && styles.focusCell,
                                    {
                                      backgroundColor: isDark
                                        ? colors.transparent
                                        : colors.white,
                                    },
                                  ]}
                                >
                                  {symbol || (isFocused ? <Cursor /> : null)}
                                </Text>
                              </View>
                            )}
                          />
                        </View>
                      </View>

                      <TypographyText
                            title={params.title}
                            textColor={isDark ? colors.white : colors.darkBlue}
                            size={14}
                            font={LUSAIL_REGULAR}
                            style={styles.infoText}
                      />

                      <View style={{ marginHorizontal: 60, marginTop: 20 }}>
                        {errors.code && (
                          <TypographyText
                            title={errors.code}
                            textColor={'#FF406E'}
                            size={14}
                            font={LUSAIL_REGULAR}
                            style={{ marginVertical: 10, fontWeight: '700' }}
                          />
                        )}

                        <CommonButton
                          onPress={handleSubmit}
                          label={t('Login.submit')}
                          loading={profileLoading}
                          textColor={
                            isDark ? colors.mainDarkModeText : colors.white
                          }
                        />
                      </View>
                    </View>
                  </>
                );
              }}
            </Formik>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    paddingBottom: 60,
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  mainInfoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 50,
  },
  description: {
    marginTop: 20,
    width: 250,
    textAlign: 'center',
  },
  codeWrapper: {
    marginBottom: 80,
    paddingHorizontal: 30,
  },
  cellWrapper: {
    ...mainStyles.cell,
    ...mainStyles.lightShadow,
    borderWidth: 0,
    width: 42,
    height: 42,
    borderRadius: 21,
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
  codeWrapper: {
    width: 250,
    marginTop: 20,
  },
  infoText: {
    paddingHorizontal: 50,
    textAlign: 'center',
    marginTop: 30
  }
});

export default connect(
  state => ({
    profileLoading: state.authReducer.profileLoading,
  }),
  { verify },
)(Verification);
