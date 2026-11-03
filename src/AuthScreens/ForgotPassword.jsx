import React, { useState } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  View,
} from 'react-native';
import { colors } from '../components/colors';
import { TypographyText } from '../components/Typography';
import { LUSAIL_REGULAR } from '../redux/types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '../components/Input/Input';
import CommonButton from '../components/CommonButton/CommonButton';
import { useTheme } from '../components/ThemeProvider';
import { useTranslation } from 'react-i18next';
import ModalInfo from '../components/ModalInfo/ModalInfo';
import { connect } from 'react-redux';
import { sendOTPEmail } from '../redux/auth/auth-thunks';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '../components/Header';
import { org } from '../org/config';
import { logo } from '../org/assets';

const ForgotPassword = ({
  navigation,
  sendOTPEmail,
  profileLoading,
}) => {
  const [isSuccessSend, setIsSuccessSend] = useState(false);
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const logoIcon = logo;

  const handleSubmit = ({ email }, { setFieldError }) => {
      sendOTPEmail(email, setFieldError);
  };

  const logoColor = isDark ? colors.mainDarkMode : colors.darkBlue;

  return (
    <>
      {isSuccessSend && (
        <ModalInfo
          isSuccess={true}
          onCancel={() => {
            setIsSuccessSend(false);
            navigation.goBack();
          }}
          onSubmit={() => {
            setIsSuccessSend(false);
            navigation.goBack();
          }}
          title={t('Login.emailSent')}
          description={t('Login.linkSentOnEmail')}
        />
      )}
      <View
        scrollEnabled={Platform.OS === 'android'}
        style={{
          backgroundColor: isDark ? colors.darkBlue : colors.bg,
          flex: 1
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Header btns={['back']} />

          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
             <View>
                  <Image
                    source={logoIcon}
                    style={[styles.logo,{ tintColor: logoColor}]}
                  />
  

                <TypographyText
                  title={t('Login.pleaseEnterData', { appName: org.displayName })}
                  textColor={logoColor}
                  size={18}
                  font={LUSAIL_REGULAR}
                  style={styles.title}
                />
   

              <View style={styles.formikWrapper}>
                <Formik
                  initialValues={{
                    email: '',
                  }}
                  onSubmit={handleSubmit}
                  validationSchema={Yup.object({
                     email: Yup.string().required(t('Login.required')),
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
                            autoCorrect={false}
                            autoComplete="email"
                            textContentType="emailAddress"
                            keyboardType="email-address"
                          />
                
                        <CommonButton
                          onPress={handleSubmit}
                          label={t('OnBoarding.next')}
                          style={{ marginTop: 26 }}
                          textColor={
                            isDark ? colors.mainDarkModeText : colors.white
                          }
                          loading={profileLoading}
                        />
                      </>
                    );
                  }}
                </Formik>
              </View>
           </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </View>
    </>
  );
};

const styles = {
  title: {
    fontWeight: '700',
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 30,
    width: 300
  },
  formikWrapper: {
    paddingHorizontal: 20,
    marginTop: 40
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 60,
  },
  logo: {
    height: 100,
    width: 100,
    alignSelf: 'center'
  },
};

export default connect(
  state => ({ profileLoading: state.authReducer.profileLoading }),
  { sendOTPEmail },
)(ForgotPassword);
