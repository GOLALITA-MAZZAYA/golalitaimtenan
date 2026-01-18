import React, { useCallback, useRef, useState } from 'react';
import {
  Image,
  Text,
  Keyboard,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import i18next from 'i18next';
import { colors } from '../../components/colors';
import { getPixel, mainStyles, SCREEN_HEIGHT } from '../../styles/mainStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TypographyText } from '../../components/Typography';
import { LUSAIL_REGULAR } from '../../redux/types';
import { Formik } from 'formik';
import Input from '../../components/Input/Input';
import CommonButton from '../../components/CommonButton/CommonButton';
import { useTheme } from '../../components/ThemeProvider';
import { useTranslation } from 'react-i18next';
import authApi from '../../redux/auth/auth-api';
import { getValidationSchema } from './validation';
import AuthLayout from '../component/AuthLayout';
import { connect } from 'react-redux';
import { register } from '../../redux/auth/auth-thunks';
import TopCircleShadow from '../../components/TopCircleShadow';
import Header from '../../components/Header';

const Register = ({ route, navigation, register }) => {
  let params = route?.params;

  const { isDark } = useTheme();
  const ref_to_input3 = useRef();
  const ref_to_input5 = useRef();
  const ref_to_input6 = useRef();
  const ref_to_input7 = useRef();
  const ref_to_input8 = useRef();
  const [isAgreed, setIsAgreed] = useState(false);
  const [data, setData] = useState(params);

  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);

  const language = i18n.language;
  const logoIcon = require('../../assets/logo.png');

  const toLogin = useCallback(() => {
    navigation.navigate('Login');
  }, []);

  return (
    <AuthLayout light>
      <Formik
        initialValues={{
          name: data?.firstNameEn,
          last_name: data?.lastNameEn,
          login: '',
          email: params?.email || '',
          phone: '+974',
          password: '',
          repeatPassword: '',
        }}
        onSubmit={async (values, { setFieldError }) => {
          if (!isAgreed) {
            alert('Kindly Agree Terms & Conditions');
            return;
          }

          try {
            setLoading(true);

            const { name, last_name, email, phone } = values;

            const res = await authApi.checkEmail({
              params: { email },
            });

            if (res.data.result?.error) {
              setFieldError('email', t('Profile.emailExists'));
              throw 'err';
            }

            const phoneRes = await authApi.checkPhone({
              params: { phone },
            });

            if (phoneRes.data.result?.error) {
              setFieldError('phone', t('Profile.phoneExists'));
              throw 'err';
            }

            const registerBody = {
              name,
              last_name,
              email,
              phone,
              parent_id: '1651',
              active_period: 1,
              password: values.password,
              device_type: Platform.OS
            };

            console.log('registerBodyregisterBody:', registerBody);
            register(registerBody);
          } catch (err) {
            console.log(err, 'err');
            setLoading(false);
          }
        }}
        validationSchema={getValidationSchema()}
      >
        {({ values, handleChange, handleSubmit, errors, submitCount }) => {
          errors = submitCount > 0 ? errors : {};

          return (
            <View
              scrollEnabled={Platform.OS === 'android'}
              style={{
                height: SCREEN_HEIGHT,
              }}
            >
              <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAwareScrollView
                  contentContainerStyle={styles.contentContainerStyle}
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                >
                  <Header btns={'back'} />
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      Keyboard.dismiss();
                    }}
                    style={{ flex: 1 }}
                  >
                    <View
                      style={[
                        mainStyles.centeredRow,
                        { margin: 30, flexDirection: 'column' },
                      ]}
                    >
                      <Image
                        source={logoIcon}
                        style={{
                          tintColor: isDark
                            ? colors.mainDarkMode
                            : colors.darkBlue,
                        }}
                      />
                    </View>
                    <View
                      style={[
                        mainStyles.p20,
                        { marginTop: getPixel(7), flex: 1 },
                      ]}
                    >
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                          }}
                        >
                          <Input
                            label={t('Login.yourName')}
                            placeholder={t('Login.yourNamePlaceholder')}
                            value={values.name}
                            innerRef={ref_to_input3}
                            onChangeText={handleChange('name')}
                            error={errors.name}
                            returnKeyType={'next'}
                            //onSubmitEditing={() => ref_to_input2.current.focus()}
                            wrapperStyle={{
                              marginBottom: 12,
                              flex: 1,
                              marginRight: 20,
                            }}
                            style={{ fontSize: 16 }}
                          />

                          <Input
                            label={t('Login.lastName')}
                            innerRef={ref_to_input3}
                            placeholder={t('Login.lastNamePlaceholder')}
                            value={values.last_name}
                            onChangeText={handleChange('last_name')}
                            error={errors.last_name}
                            returnKeyType={'next'}
                            //onSubmitEditing={() => ref_to_input3.current.focus()}
                            wrapperStyle={{
                              marginBottom: 12,
                              flex: 1,
                              marginLeft: 20,
                            }}
                            style={{ fontSize: 16 }}
                          />
                        </View>

                        <Input
                          label={t('Login.email')}
                          placeholder={t('Login.emailPlaceholder')}
                          value={values.email}
                          onChangeText={e => {
                            handleChange('email')(e.toLowerCase());
                          }}
                          innerRef={ref_to_input5}
                          error={errors.email}
                          returnKeyType={'next'}
                          autoCapitalize="none"
                          onSubmitEditing={Keyboard.dismiss}
                          wrapperStyle={{ marginBottom: 12 }}
                          keyboardType={
                            Platform.OS === 'android'
                              ? 'visible-password'
                              : undefined
                          }
                          style={{ fontSize: 16 }}
                          editable={false}
                        />

                        <Input
                          label={t('ContactUs.mobileNumber')}
                          placeholder={t('Login.yourPhone')}
                          initialValue={values.phone}
                          onChangePhoneNumber={e => {
                            handleChange('phone')(e.toLowerCase());
                          }}
                          innerRef={ref_to_input6}
                          error={errors.phone}
                          returnKeyType={'next'}
                          onSubmitEditing={() => ref_to_input7.current.focus()}
                          disableInputRtl
                          style={{ fontSize: 16 }}
                        />

                        <Input
                          label={t('Login.password')}
                          placeholder={t('Login.passwordPlaceholder')}
                          value={values.password}
                          onChangeText={handleChange('password')}
                          error={errors.password}
                          keyboardType={'ascii-capable'}
                          returnKeyType={'next'}
                          secureTextEntry={true}
                          innerRef={ref_to_input7}
                          onSubmitEditing={() => ref_to_input8.current.focus()}
                          style={{ fontSize: 16 }}
                          wrapperStyle={{ marginBottom: 12, marginTop: 12 }}
                        />
                        <Input
                          label={t('Profile.confirmPassword')}
                          placeholder={t('Login.confirmPasswordPlaceholder')}
                          innerRef={ref_to_input8}
                          value={values.repeatPassword}
                          onChangeText={handleChange('repeatPassword')}
                          error={errors.repeatPassword}
                          secureTextEntry={true}
                          returnKeyType={'next'}
                          onSubmitEditing={Keyboard.dismiss}
                          wrapperStyle={{ marginBottom: 12 }}
                          style={{ fontSize: 16 }}
                        />

                        <TouchableOpacity
                          style={styles.bottom}
                          onPress={toLogin}
                        >
                          <TypographyText
                            title={t('Login.haveAccount')}
                            textColor={isDark ? colors.darkGrey : colors.grey}
                            size={14}
                            font={LUSAIL_REGULAR}
                          />

                          <View style={styles.link}>
                            <TypographyText
                              title={t('Login.signIn')}
                              textColor={
                                isDark ? colors.mainDarkMode : colors.darkBlue
                              }
                              size={16}
                              style={[mainStyles.underline, { margin: 6 }]}
                              font={LUSAIL_REGULAR}
                            />
                          </View>
                        </TouchableOpacity>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 16,
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              marginRight: 11,
                              height: 22,
                              borderRadius: 6,
                              width: 22,
                              padding: 1,
                              borderWidth: 2,
                              borderColor: isDark
                                ? colors.mainDarkMode
                                : colors.darkBlue,
                              overflow: 'hidden',
                            }}
                            onPress={() => setIsAgreed(!isAgreed)}
                          >
                            {isAgreed ? (
                              <View
                                style={{
                                  flex: 1,
                                  width: '110%',
                                  height: '110%',
                                  //borderRadius: 6,
                                  overflow: 'hidden',
                                }}
                              >
                                {isDark ? (
                                  <Image
                                    source={require('../../assets/Checkbox1.png')}
                                    style={styles.logo}
                                  />
                                ) : (
                                  <Image
                                    source={require('../../assets/Checkbox2.png')}
                                    style={styles.logo}
                                  />
                                )}
                              </View>
                            ) : (
                              <View
                                style={{
                                  backgroundColor: isDark
                                    ? colors.black
                                    : colors.white,
                                  flex: 1,
                                  width: '100%',
                                  height: '100%',
                                  borderRadius: 6,
                                  overflow: 'hidden',
                                }}
                              ></View>
                            )}
                          </TouchableOpacity>
                          {language == 'ar' ? (
                            <TouchableOpacity
                              style={{ flex: 1, flexDirection: 'row' }}
                              onPress={() => {
                                navigation.navigate('PrivacyPolicy');
                              }}
                            >
                              <Text style={{ color: 'blue' }}>
                                {t('Profile.privacypPolicy')}
                              </Text>

                              <TouchableOpacity>
                                <Text
                                  style={{
                                    color: isDark ? colors.white : colors.grey,
                                    fontSize: 16,
                                  }}
                                >
                                  {t('Profile.agreeTo')}{' '}
                                </Text>
                              </TouchableOpacity>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={{ flex: 1, flexDirection: 'row' }}
                            >
                              {console.log('languagelanguage:', language)}
                              <Text
                                style={{
                                  color: isDark ? colors.white : colors.grey,
                                }}
                              >
                                {t('Profile.agreeTo')}{' '}
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  navigation.navigate('PrivacyPolicy');
                                }}
                              >
                                <Text
                                  style={{
                                    color: isDark
                                      ? colors.mainDarkMode
                                      : 'blue',
                                  }}
                                >
                                  {t('Profile.privacypPolicy')}
                                </Text>
                              </TouchableOpacity>
                            </TouchableOpacity>
                          )}
                        </View>

                        <CommonButton
                          onPress={handleSubmit}
                          label={t('Login.register')}
                          loading={loading}
                          textColor={
                            isDark ? colors.mainDarkModeText : colors.white
                          }
                        />
                      </>
                    </View>
                  </TouchableOpacity>

                  <TopCircleShadow />
                </KeyboardAwareScrollView>
              </SafeAreaView>
            </View>
          );
        }}
      </Formik>
    </AuthLayout>
  );
};

const styles = {
  bg: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    top: 0,
    width: '100%',
  },
  bottom: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  link: {
    paddingVertical: 5,
  },
  contentContainerStyle: {
    paddingBottom: 30,
  },
  goldShadeWrapper: {
    width: 500,
    height: 500,
    borderRadius: 250,
    position: 'absolute',
    right: -260,
    top: -230,
    shadowColor: '#DDBD6B',
    shadowOffset: {
      width: 120,
      height: 120,
    },
    shadowOpacity: 0.35,
    shadowRadius: 3.84,
    elevation: 55,
    zIndex: 10000,
  },
  logo: {},
};

export default connect(null, { register })(Register);
