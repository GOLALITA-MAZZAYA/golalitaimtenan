import React, { useCallback, useRef } from "react";
import { useTheme } from "../../components/ThemeProvider";
import {
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../components/colors";
import { getPixel, mainStyles, SCREEN_HEIGHT } from "../../styles/mainStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TypographyText } from "../../components/Typography";
import { LUSAIL_REGULAR } from "../../redux/types";
import { Formik } from "formik";
import * as Yup from "yup";
import Input from "../../components/Input/Input";
import CommonButton from "../../components/CommonButton/CommonButton";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  changePassword,
  register,
  sendOTP,
} from "../../redux/auth/auth-thunks";
import AuthLayout from "../component/AuthLayout";
import TopCircleShadow from "../../components/TopCircleShadow";

const CreatePassword = ({
  navigation,
  route,
  register,
  changePassword,
  loading,
  profileLoading,
}) => {
  let params = route?.params;
  const { isDark } = useTheme();
  const ref_to_input2 = useRef();
  const { t } = useTranslation();
  const toLogin = useCallback(() => {
    navigation.navigate("Login");
  }, []);

  const logoIcon = require("../../assets/logo.png");

  return (
    <AuthLayout light>
      <View
        scrollEnabled={Platform.OS === "android"}
        style={{
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
              {/* <BackgroundSvg style={styles.bg} /> */}
              <View
                style={[
                  mainStyles.centeredRow,
                  { marginTop: getPixel(10), flexDirection: "column" },
                ]}
              >
                <View style={styles.logoWrapper}>
                  <Image
                    source={logoIcon}
                    style={[
                      styles.logo,
                      {
                        tintColor: isDark ? colors.mainDarkMode : "black",
                      },
                    ]}
                  />
                </View>

                <TypographyText
                  title={
                    params?.isForgotPassword
                      ? t("Login.forgotPasswordDescription")
                      : t("Login.createPasswordDescription")
                  }
                  textColor={isDark ? colors.white : colors.darkBlue}
                  size={18}
                  font={LUSAIL_REGULAR}
                  style={{
                    marginTop: 20,
                    fontWeight: "700",
                    textAlign: "center",
                    width: 320,
                  }}
                />
              </View>
              <View style={[mainStyles.p20, { marginTop: 40 }]}>
                <Formik
                  initialValues={{
                    password: "",
                    repeatPassword: "",
                  }}
                  onSubmit={(values, { setFieldError }) => {
                    if (params?.isForgotPassword) {
                      changePassword(
                        {
                          token: params?.token,
                          new_password: values.repeatPassword,
                        },
                        navigation,
                        setFieldError,
                        t
                      );
                    } else {
                      register({
                        ...params.registerBody,
                        password: values.password,
                      });
                    }
                  }}
                  validationSchema={Yup.object({
                    password: Yup.string()
                      .min(8, t("Login.min8chars"))
                      .required(t("Login.required")),
                    repeatPassword: Yup.string().oneOf(
                      [Yup.ref("password"), null],
                      t("Login.passwordsMustMatch")
                    ),
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
                        <Input
                          label={t("Login.password")}
                          placeholder={t("Login.passwordPlaceholder")}
                          value={values.password}
                          onChangeText={handleChange("password")}
                          error={errors.password}
                          keyboardType={"password"}
                          returnKeyType={"next"}
                          secureTextEntry={true}
                          onSubmitEditing={() => ref_to_input2.current.focus()}
                          wrapperStyle={{ marginBottom: 10 }}
                        />
                        <Input
                          label={t("Profile.confirmPassword")}
                          placeholder={t("Login.confirmPasswordPlaceholder")}
                          innerRef={ref_to_input2}
                          value={values.repeatPassword}
                          onChangeText={handleChange("repeatPassword")}
                          error={errors.repeatPassword}
                          secureTextEntry={true}
                          returnKeyType={"next"}
                          onSubmitEditing={Keyboard.dismiss}
                          wrapperStyle={{ marginBottom: 50, marginTop: 20 }}
                        />
                        <CommonButton
                          onPress={handleSubmit}
                          label={
                            params?.isForgotPassword
                              ? t("OnBoarding.next")
                              : t("Login.register")
                          }
                          loading={loading || profileLoading}
                          textColor={
                            isDark ? colors.mainDarkModeText : colors.white
                          }
                        />
                      </>
                    );
                  }}
                </Formik>
                <View style={styles.bottom}>
                  <TypographyText
                    title={t("Login.haveAccount")}
                    textColor={isDark ? colors.white : colors.grey}
                    size={14}
                    font={LUSAIL_REGULAR}
                  />

                  <TouchableOpacity onPress={toLogin} style={styles.link}>
                    <TypographyText
                      title={"Sign In"}
                      textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
                      size={18}
                      style={mainStyles.underline}
                      font={LUSAIL_REGULAR}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </View>
      <TopCircleShadow />
    </AuthLayout>
  );
};

const styles = {
  bg: {
    position: "absolute",
    left: "5%",
    right: "5%",
    top: 0,
    width: "100%",
  },
  bottom: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
  },
  link: {
    paddingVertical: 5,
  },
  logoWrapper: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: "transparent",
  },
  logo: {
    width: 80,
    height: 80,
  },
};

const mapStateToProps = (state) => ({
  loading: state.authReducer.loginLoading,
  profileLoading: state.authReducer.profileLoading,
});

export default connect(mapStateToProps, { sendOTP, changePassword, register })(
  CreatePassword
);
