import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { CodeField, Cursor } from "react-native-confirmation-code-field";
import { useDispatch } from "react-redux";
import authApi from "../../../redux/auth/auth-api";
import { transactionsApi } from "../../../redux/transactions/transactions-api";
import { getFamilyMembers } from "../../../redux/transactions/transactions-thunks";
import { showMessage } from "react-native-flash-message";
import { colors } from "../../../components/colors";
import {
  getPixel,
  mainStyles,
  SCREEN_HEIGHT,
} from "../../../styles/mainStyles";
import { TypographyText } from "../../../components/Typography";
import { BALOO_MEDIUM } from "../../../redux/types";
import { useTheme } from "../../../components/ThemeProvider";
import CommonButton from "../../../components/CommonButton/CommonButton";
import Header from "../../../components/Header";
import { getAuthToken } from "../../../utils/tokenStorage";

const FamilyEmailVerification = ({ route, navigation }) => {
  const params = route.params;
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const randomCode = useRef(Math.floor(1000 + Math.random() * 9000));
  const dispatch = useDispatch();

  const sendVerificationCode = async () => {
    try {
      return authApi.validate_code({
        params: {
          email: params.email,
          validate_code: randomCode.current,
          method: "email",
        },
      });
    } catch (err) {
      showMessage({
        type: "danger",
        message: t("General.error"),
      });
    }
  };

  const checkIfCodeValid = (codeFromInput) =>
    +randomCode.current === +codeFromInput;

  const saveFamilyMember = async () => {
    const { isEdit, ...body } = params;
    const token = await getAuthToken();

    return isEdit
      ? transactionsApi.editFamilyMember({ params: { token, ...body } })
      : transactionsApi.addFamilyMember({ params: { ...body, token } });
  };

  const onSubmit = async (values, { setFieldError }) => {
    try {
      const isCodeValid = checkIfCodeValid(values.code);

      if (!isCodeValid) {
        setFieldError("code", t("Login.wrongCode"));
        return;
      }

      setLoading(true);

      const res = await saveFamilyMember();

      const errorMessage =
        res.data?.error?.data?.message || res?.data?.result?.error;

      if (errorMessage) {
        showMessage({
          message: errorMessage,
          type: "danger",
        });
        return;
      }

      dispatch(getFamilyMembers());

      showMessage({
        message: t(
          params.isEdit ? "Family.memberUpdated" : "Family.memberAdded",
        ),
        type: "success",
      });

      navigation.pop(2);
    } catch (error) {
      showMessage({
        type: "danger",
        message: t("General.error"),
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
            <Header btns={["back"]} />
            <View
              style={[
                mainStyles.centeredRow,
                { marginTop: getPixel(10), flexDirection: "column" },
              ]}
            >
              <Image
                source={require("../../../assets/shield.png")}
                style={mainStyles.registerIcon}
              />
              <TypographyText
                title={t("Login.enter4DigitsEmail") + " " + params?.email}
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
                  code: "",
                }}
                onSubmit={onSubmit}
                validationSchema={Yup.object({
                  code: Yup.string().required(t("Login.required")),
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
                        onChangeText={handleChange("code")}
                        cellCount={4}
                        rootStyle={[
                          styles.codeWrapper,
                          errors.code && { marginBottom: 20 },
                        ]}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        renderCell={({ index, symbol, isFocused }) => (
                          <View style={styles.cellWrapper} key={index}>
                            <Text
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
                          textColor={"#FF406E"}
                          size={14}
                          font={BALOO_MEDIUM}
                          style={{ marginBottom: 60, alignSelf: "center" }}
                        />
                      )}
                      <CommonButton
                        onPress={handleSubmit}
                        label={t("Login.verify")}
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  cell: {
    color: "#312B3E",
    fontSize: 24,
    fontFamily: BALOO_MEDIUM,
    textAlign: "center",
  },
});

export default FamilyEmailVerification;
