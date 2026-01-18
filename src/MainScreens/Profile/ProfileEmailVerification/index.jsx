import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { CodeField, Cursor } from 'react-native-confirmation-code-field';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../../../redux/auth/auth-selectors';
import authApi from '../../../redux/auth/auth-api';
import { showMessage } from 'react-native-flash-message';
import { getUserData } from '../../../redux/auth/auth-thunks';
import { colors } from '../../../components/colors';
import {
  getPixel,
  mainStyles,
  SCREEN_HEIGHT,
} from '../../../styles/mainStyles';
import { TypographyText } from '../../../components/Typography';
import { BALOO_MEDIUM } from '../../../redux/types';
import { useTheme } from '../../../components/ThemeProvider';
import CommonButton from '../../../components/CommonButton/CommonButton';
import Header from '../../../components/Header';

const ProfileEmailVerification = ({ route, navigation }) => {
  let params = route.params;
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const userId = useSelector(state => state.authReducer.userId);
  const [loading, setLoading] = useState(false);
  const randomCode = useRef(Math.floor(1000 + Math.random() * 9000));
  const dispatch = useDispatch();

  const sendVerificationCode = async () => {
    try {
      return authApi.validate_code({
        params: {
          email: params.email,
          validate_code: randomCode.current,
          method: 'email',
        },
      });
    } catch (err) {
      showMessage({
        type: 'danger',
        message: t('General.error'),
      });
    }
  };

  const checkIfCodeValid = codeFromInput =>
    +randomCode.current === +codeFromInput;

  const updateProfile = (body, userId, token) => {
    return authApi.updateProfile(userId, {
      params: {
        token,
        update_vals: JSON.stringify(body),
      },
    });
  };

  const onSubmit = async (values, { setFieldError }) => {
    try {
      if (!userId) {
        showMessage({
          type: 'danger',
          message: t('General.error'),
        });

        return;
      }

      console.log(values.code, 'dawdaw');
      console.log(randomCode.current, 'current');

      const isCodeValid = checkIfCodeValid(values.code);

      if (!isCodeValid) {
        setFieldError('code', t('Login.wrongCode'));
        return;
      }

      setLoading(true);

      const token = await AsyncStorage.getItem('token');

      console.log(userId, 'userID');

      const res = await updateProfile(params, userId, token);

      if (res?.data?.result?.error) {
        showMessage({
          message: res?.data?.result?.error,
          type: 'danger',
        });

        return;
      }

      if (!res?.data?.result?.success) {
        showMessage({
          message: t('Profile.profileUpdateError'),
          type: 'danger',
        });

        return;
      }

      dispatch(getUserData(token));

      showMessage({
        message: t('Profile.profileUpdated'),
        type: 'success',
      });

      setTimeout(() => {
        navigation.navigate('Profile');
      }, 3000);
    } catch (error) {
      console.log(error, 'error');
      showMessage({
        type: 'danger',
        message: t('General.error'),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    sendVerificationCode();
  }, []);

  return (
    <View
      scrollEnabled={Platform.OS === 'android'}
      style={{
        backgroundColor: isDark ? colors.darkBlue : colors.bg,
        height: SCREEN_HEIGHT,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView>
          <TouchableOpacity
            activeOpacity={1}
            onPress={Keyboard.dismiss}
            style={{ flex: 1 }}
          >
            <Header btns={['back']} />
            <View
              style={[
                mainStyles.centeredRow,
                { marginTop: getPixel(10), flexDirection: 'column' },
              ]}
            >
              <Image
                source={require('../../../assets/shield.png')}
                style={mainStyles.registerIcon}
              />
              <TypographyText
                title={t('Login.enter4DigitsEmail') + ' ' + params?.email}
                textColor={isDark ? colors.white : colors.darkBlue}
                size={18}
                font={BALOO_MEDIUM}
                style={[
                  mainStyles.centeredText,
                  { marginTop: 20, paddingHorizontal: 50 },
                ]}
              />
            </View>
            <View style={[mainStyles.p20, { marginTop: getPixel(7) }]}>
              <Formik
                initialValues={{
                  code: '',
                }}
                onSubmit={onSubmit}
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
                }) => {
                  errors = submitCount > 0 ? errors : {};
                  return (
                    <>
                      <CodeField
                        value={values.code}
                        onChangeText={handleChange('code')}
                        cellCount={4}
                        rootStyle={[
                          styles.codeWrapper,
                          errors.code && { marginBottom: 20 },
                        ]}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
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
                      {errors.code && (
                        <TypographyText
                          title={errors.code}
                          textColor={'#FF406E'}
                          size={14}
                          font={BALOO_MEDIUM}
                          style={{ marginBottom: 60, alignSelf: 'center' }}
                        />
                      )}
                      <CommonButton
                        onPress={handleSubmit}
                        label={t('Login.verify')}
                        loading={loading}
                      />
                    </>
                  );
                }}
              </Formik>
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </SafeAreaView>
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
    color: '#312B3E',
    fontSize: 24,
    fontFamily: BALOO_MEDIUM,
    textAlign: 'center',
  },
});

export default ProfileEmailVerification;
