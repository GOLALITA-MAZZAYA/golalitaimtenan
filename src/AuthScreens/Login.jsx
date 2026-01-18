import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Platform,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Text,
  ActivityIndicator,
  Modal,
  AppState,
} from 'react-native';
import { TypographyText } from '../components/Typography';
import { LUSAIL_REGULAR, BALOO_REGULAR } from '../redux/types';
import { colors } from '../components/colors';
import Input from '../components/Input/Input';
import CommonButton from '../components/CommonButton/CommonButton';
import { useTheme } from '../components/ThemeProvider';
import { connect, useDispatch } from 'react-redux';
import {
  getUserData,
  login,
  getInitialData,
  autologin,
} from '../redux/auth/auth-thunks';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
import { showMessage } from 'react-native-flash-message';
import '../pushNotifications/pushNotificationBootStrap';
import usePushNotifications from '../pushNotifications/usePushNotifications';
import TouchID from 'react-native-touch-id';
import TwoButtons from '../components/TwoButtons/TwoButtons';
import { getFlexDirection, phoneRegExp } from '../../utils';
import {
  setIsloadingAutologin,
  setIsAuthorized,
  setIsLoginError,
  setToken,
  setUserId,
} from '../redux/auth/auth-actions';
import authApi from '../redux/auth/auth-api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthLayout from './component/AuthLayout';
import TopCircleShadow from '../components/TopCircleShadow';
import SaveMe from './component/SaveMe';
import { getIsSaveMe, setIsSaveMe } from '../api/asyncStorage';
import useInitialURL from '../hooks/useInitialURL';
import Clipboard from '@react-native-clipboard/clipboard';
import { processClipboardContent } from '../utils/clipboardUtils';

const LOGIN_INPUT_TYPES = {
  email: 'email',
  phone: 'phone',
};

const Login = ({
  navigation,
  login,
  autologin,
  isLoginError,
  isUserJustLogOut,
  isloadingAutologin,
  loginLoading,
}) => {
  const { isDark } = useTheme();
  const [compatible, isCompatible] = useState(false);
  const ref_to_input2 = useRef();
  const isLoggedInWithCredentialsRef = useRef(false);
  const [loginInputType, setLoginInputType] = useState(LOGIN_INPUT_TYPES.email);
  const [loading, setLoading] = useState(false);
  const [autoLoginText, setAutoLoginText] = useState('Auto login . . .');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  usePushNotifications();
  const { token, processing, resetUrlData } = useInitialURL();
  const [isRememberMeActive, setIsRememberMeActive] = useState(false);
  const [clipboardLoading, setClipboardLoading] = useState(false);

  const loginBg = require('../assets/loginBg.png');
  const logoIcon = require('../../assets/logo.png');


  useEffect(() => {
    TouchID.isSupported().then(() => {
      isCompatible(true);
    });
  }, []);

  // Unified auto-login handler for both deep link and clipboard
  useEffect(() => {
    const handleAutoLogin = async () => {
      console.log('=== handleAutoLogin START ===');
      console.log('clipboardLoading:', clipboardLoading);
      console.log('isloadingAutologin:', isloadingAutologin);
      console.log('token:', token);
      console.log('processing:', processing);
      
      // Guard: Don't run if already logged in
      const isUserLoggedOut = await AsyncStorage.getItem('isUserLoggedOut');
      console.log('isUserLoggedOut:', isUserLoggedOut);
      if (isUserLoggedOut === 'false') {
        console.log('User already logged in, skipping auto-login');
        return;
      }

      // Guard: Check for logout timestamp to prevent immediate re-login
      const lastLogout = await AsyncStorage.getItem('lastLogoutTimestamp');
      console.log('lastLogout:', lastLogout);
      if (lastLogout && Date.now() - parseInt(lastLogout) < 3000) {
        console.log('Blocking auto-login after recent logout');
        return;
      }

      // Guard: Don't run if already loading
      if (clipboardLoading || isloadingAutologin) {
        console.log('Auto-login already in progress, skipping');
        return;
      }

      // Priority 1: Deep link token (if available and not processing)
      if (!processing && token) {
        console.log('Auto-login with deep link token');
        setClipboardLoading(true);
        try {
          await autologin(token);
          resetUrlData();
          console.log('Auto-login with deep link token successful');
        } catch (error) {
          console.log('Auto-login with deep link token failed:', error);
          setClipboardLoading(false);
        }
        return;
      }

      // Priority 2: Clipboard token (if deep link token not available)
      try {
        // Directly read clipboard content
        const clipboardContent = await Clipboard.getString();
        console.log('[ANDROID CLIPBOARD] Content length:', clipboardContent?.length || 0);
        console.log('[ANDROID CLIPBOARD] First 200 chars:', clipboardContent?.substring(0, 200));
        
        if (!clipboardContent || clipboardContent.trim() === '') {
          console.log('[ANDROID CLIPBOARD] Content is empty - clipboard might be restricted');
          // On Android, sometimes clipboard returns empty even with content
          // Let's still try to process it in case it contains invisible characters
          return;
        }
        
        const result = processClipboardContent(clipboardContent);
        console.log('[ANDROID] processClipboardContent result:', JSON.stringify(result, null, 2));
        
        if (result.hasToken) {
          console.log('[ANDROID] Token found! Attempting auto-login...');
          setClipboardLoading(true);
          try {
            await autologin(result.token);
            console.log('[ANDROID] Auto-login successful!');
            
            // Clear clipboard after successful auto-login
            await Clipboard.setString('');
            console.log('[ANDROID] Clipboard cleared after successful auto-login');
          } catch (error) {
            console.log('[ANDROID] Auto-login failed:', error);
            setClipboardLoading(false);
          }
        } else {
          console.log('[ANDROID] No valid token found in clipboard');
        }
      } catch (error) {
        console.log('[ANDROID] Clipboard error:', error);
        console.error('[ANDROID] Error details:', error);
      }
    };

    handleAutoLogin();
  }, [token, processing, autologin, resetUrlData, clipboardLoading, isloadingAutologin]);

  useEffect(() => {
    (async () => {
      const isUserLoggedOut = await AsyncStorage.getItem('isUserLoggedOut');
      const isRememberMe = await getIsSaveMe();

      setIsRememberMeActive(
        isRememberMe === 'true' || isRememberMe === null ? true : false,
      );

      if (
        isUserLoggedOut === 'true' &&
        !isUserJustLogOut &&
        isloadingAutologin !== null
      ) {
        authenticateWithTouchId();
      }
    })();
  }, [isCompatible]);

  const authenticateWithTouchId = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        showMessage({
          message: t('Login.loginMessage'),
          type: 'danger',
        });

        return;
      }

      await TouchID.authenticate();

      try {
        const res = await authApi.getUserData({
          params: { token },
        });

        if (res?.data?.result?.error) {
          showMessage({
            message: t('Login.loginMessage'),
            type: 'danger',
          });

          return;
        }

        const userId = await AsyncStorage.getItem('userId');

        if (userId) {
          dispatch(setUserId(userId));
        }

        dispatch(getUserData(token));
        dispatch(setToken(token));
        dispatch(getInitialData());
        dispatch(setIsAuthorized(true));

        await AsyncStorage.setItem('isUserLoggedOut', 'false');
      } catch (err) {
        showMessage({
          message: t('Login.loginMessage'),
          type: 'danger',
        });

        return;
      }
    } catch {
      showMessage({
        message: 'Authentication Failed',
        type: 'danger',
      });
    }
  };

  const handleSaveMeChange = async val => {
    await setIsSaveMe(val ? 'true' : 'false');

    setIsRememberMeActive(val);
  };

  let validationSchema;

  if (loginInputType === LOGIN_INPUT_TYPES.email) {
    validationSchema = Yup.object({
      email: Yup.string().required(t('Login.required')),
      password: Yup.string().required(t('Login.required')),
    });
  }

  if (loginInputType === LOGIN_INPUT_TYPES.phone) {
    validationSchema = Yup.object({
      phone: Yup.string()
        .matches(phoneRegExp, t('Login.invalidPhone'))
        .required(t('Login.required')),
      password: Yup.string().required(t('Login.required')),
    });
  }

  const logoColor = isDark ? colors.mainDarkMode : 'white';

  return (
    <AuthLayout>
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
          <KeyboardAwareScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
            }}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={Keyboard.dismiss}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <View style={styles.logoWrapper}>
                <Image
                  source={logoIcon}
                  style={[
                    styles.logo,
                    {
                      tintColor: isDark ? colors.mainDarkMode : 'white',
                    },
                  ]}
                />
              </View>

              <TypographyText
                title={t('Login.logInWith')}
                textColor={colors.white}
                size={14}
                font={LUSAIL_REGULAR}
                style={{
                  alignSelf: 'center',
                  marginTop: 50,
                }}
              />

              <View
                style={[
                  styles.formikWrapper,
                  {
                    backgroundColor: isDark ? '#000' : '#fff',
                    paddingBottom: 80
                  },
                ]}
              >
                <Formik
                  initialValues={{
                    email: '',
                    phone: '+974',
                    password: '',
                  }}
                  onSubmit={values => {
                    isLoggedInWithCredentialsRef.current = true;

                    let loginValue = values.email;

                    if (values.phone && values.phone.length > 4) {
                      loginValue = values.phone;
                    }

                    login({
                      login: loginValue.toLowerCase(),
                      password: values.password,
                      device_type: Platform.OS,
                    });
                  }}
                  validationSchema={validationSchema}
                >
                  {({
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    submitCount,
                  }) => {
                    errors = submitCount > 0 ? errors : {};
                    // if (isLoginError && !errors.password && !errors.password) setFieldError('password', t('Login.somethingWrong'))
                    return (
                      <>
                        <TwoButtons
                          isLight={!isDark}
                          selectedButton={
                            loginInputType === LOGIN_INPUT_TYPES.email ? 0 : 1
                          }
                          onPress1={() => {
                            if (loginInputType !== LOGIN_INPUT_TYPES.email) {
                              setLoginInputType(LOGIN_INPUT_TYPES.email);
                              handleChange('phone')('');
                            }
                          }}
                          onPress2={() => {
                            if (loginInputType !== LOGIN_INPUT_TYPES.phone) {
                              setLoginInputType(LOGIN_INPUT_TYPES.phone);
                              handleChange('email')('');
                            }
                          }}
                          label1={t('Login.email')}
                          label2={t('Login.phone')}
                          style={{ marginVertical: 0 }}
                        />

                        {loginInputType === LOGIN_INPUT_TYPES.email && (
                          <Input
                            label={t('Login.email')}
                            placeholder={t('Login.emailPlaceholder')}
                            value={values.email}
                            onChangeText={e =>
                              handleChange('email')(e.toLowerCase())
                            }
                            error={errors.email}
                            returnKeyType={'next'}
                            autoCapitalize="none"
                            onSubmitEditing={() =>
                              ref_to_input2.current.focus()
                            }
                            keyboardType={
                              Platform.OS === 'android'
                                ? 'visible-password'
                                : undefined
                            }
                            secureTextEntry={
                              Platform.OS === 'android' ? true : false
                            }
                            wrapperStyle={{ marginTop: 10 }}
                          />
                        )}

                        {loginInputType === LOGIN_INPUT_TYPES.phone && (
                          <Input
                            initialValue={values.phone}
                            onChangePhoneNumber={handleChange('phone')}
                            error={errors.phone}
                            returnKeyType={'next'}
                            onSubmitEditing={() =>
                              ref_to_input2.current.focus()
                            }
                            label={t('ContactUs.mobileNumber')}
                            placeholder={t('Login.yourPhone')}
                            disableInputRtl
                            wrapperStyle={{ marginTop: 10 }}
                          />
                        )}

                        <Input
                          label={t('Login.password')}
                          placeholder={t('Login.passwordPlaceholder')}
                          secureTextEntry={true}
                          innerRef={ref_to_input2}
                          value={values.password}
                          onChangeText={e => {
                            if (isLoginError) {
                              dispatch(setIsLoginError(false));
                            }
                            handleChange('password')(e);
                          }}
                          error={
                            isLoginError
                              ? t('Login.somethingWrong')
                              : errors.password
                          }
                          returnKeyType={'next'}
                          onSubmitEditing={Keyboard.dismiss}
                          wrapperStyle={{ marginTop: 20 }}
                        />

                        <View
                          style={[styles.horizontalBlock, getFlexDirection()]}
                        >
                          <SaveMe
                            isActive={isRememberMeActive}
                            onChange={handleSaveMeChange}
                          />

                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('ForgotPassword')
                            }
                            style={[
                              styles.forgotPasswordBtn,
                              {
                                borderBottomColor: isDark
                                  ? colors.darkGrey
                                  : colors.darkBlue,
                              },
                            ]}
                          >
                            <TypographyText
                              title={t('Login.forgotPassword')}
                              textColor={
                                isDark ? colors.darkGrey : colors.darkBlue
                              }
                              size={14}
                              font={LUSAIL_REGULAR}
                            />
                          </TouchableOpacity>
                        </View>

                        <View style={styles.bottom}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('RegCodeVerification')
                            }
                            style={styles.link}
                          >
                            <TypographyText
                              title={t('Login.register')}
                              textColor={
                                isDark ? colors.mainDarkMode : colors.darkBlue
                              }
                              size={14}
                              font={LUSAIL_REGULAR}
                              style={{ fontWeight: '700' }}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.container}>
                          <Modal
                            transparent={true}
                            animationType="none"
                            visible={
                              isloadingAutologin == 'error' ||
                              isloadingAutologin
                            }
                            onRequestClose={() =>
                              dispatch(setIsloadingAutologin(false))
                            }
                          >
                            <View style={styles.modalBackground}>
                              <View style={styles.activityIndicatorWrapper}>
                                <TouchableOpacity
                                  style={styles.closeButton}
                                  onPress={() =>
                                    dispatch(setIsloadingAutologin(false))
                                  }
                                >
                                  <Text style={styles.closeButtonText}>X</Text>
                                </TouchableOpacity>
                                <ActivityIndicator
                                  size={'large'}
                                  color={colors.darkBlue}
                                  animating={true}
                                />
                                <TypographyText
                                  title={
                                    isloadingAutologin == 'error'
                                      ? 'Auto login failed...!'
                                      : autoLoginText
                                  }
                                  textColor={
                                    isDark ? colors.green : colors.darkBlue
                                  }
                                  size={16}
                                  font={BALOO_REGULAR}
                                />
                              </View>
                            </View>
                          </Modal>
                        </View>
                        <CommonButton
                          onPress={handleSubmit}
                          label={t('Login.login')}
                          loading={loginLoading}
                          textColor={
                            isDark ? colors.mainDarkModeText : colors.white
                          }
                          style={styles.loginBtn}
                        />
                      </>
                    );
                  }}
                </Formik>
              </View>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </TouchableOpacity>
      </ScrollView>
      <TopCircleShadow />
    </AuthLayout>
  );
};

const styles = {
  logoWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 45,
    backgroundColor: 'transparent',
  },
  goldShadeWrapper: {
    width: 500,
    height: 500,
    borderRadius: 250,
    position: 'absolute',
    right: -200,
    top: -220,
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
  bg: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    top: 0,
    width: '100%',
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  link: {
    paddingVertical: 5,
  },
  logo: {
    width: 100,
    height: 100,
  },
  emtiyazWhiteLogo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  logo2: {},
  formikWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bgtop: {
    width: '100%',
    height: '50%',
    position: 'absolute',
    top: '0%',
    zIndex: -10,
  },
  horizontalBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  firstInput: {
    marginTop: 20,
  },
  loginBtn: {
    marginTop: 25,
  },
  forgotPasswordBtn: {
    borderBottomWidth: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 200,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1,
    padding: 3,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
};

const mapStateToProps = state => ({
  isLoginError: state.authReducer.isLoginError,
  token: state.authReducer.token,
  isUserJustLogOut: state.authReducer.isUserJustLogOut,
  isloadingAutologin: state.authReducer.isloadingAutologin,
  loginLoading: state.authReducer.loginLoading,
});

export default connect(mapStateToProps, { login, autologin })(Login);
