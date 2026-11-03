import React, { useMemo } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { BALOO_MEDIUM } from "../../../redux/types";
import { TypographyText } from "../../Typography";
import { useTheme } from "../../ThemeProvider";
import { colors } from "../../colors";
import { useTranslation } from "react-i18next";
import { CodeField, Cursor } from "react-native-confirmation-code-field";
import Modal from "../../../components/Form/Modal";
import { showMessage } from "react-native-flash-message";
import { Formik } from "formik";
import * as Yup from "yup";
import { mainStyles } from "../../../styles/mainStyles";

const Confirmationcode = (props) => {
  const {
    isModalVisible,
    generatedCode,
    setEmailVerified,
    setPhoneVerified,
    setModalVisible,
    method,
    confirmationcodeLoading,
  } = props;

  const { isDark } = useTheme();
  const { t } = useTranslation();

  // useMemo(() => {
  //   console.log("isModalVisible:", isModalVisible);
  // }, [isModalVisible]);

  return (
    <Modal
      visible={isModalVisible}
      onDismiss={() => {
        setModalVisible(false);
        method === "phone"
          ? setPhoneVerified("notverified")
          : setEmailVerified("notverified");
      }}
      title={
        method === "phone"
          ? t("Login.phonevalidation")
          : t("Login.emailvalidation")
      }
    >
      {confirmationcodeLoading ? (
        <ActivityIndicator />
      ) : (
        <Formik
          initialValues={{
            code: "",
          }}
          onSubmit={(values, { setFieldError }) => {
            if (generatedCode == values.code) {
              if (method === "phone") {
                setPhoneVerified("verified");
              } else if (method === "email") {
                setEmailVerified("verified");
              }
              setModalVisible(false);
              showMessage({
                message: t("Login.verifySuccess"),
                type: "success",
              });
            } else {
              setFieldError("code", t("Login.wrongCode"));
            }
          }}
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
            setFieldError,
          }) => {
            errors = submitCount > 0 ? errors : {};
            return (
              <View>
                <CodeField
                  value={values.code}
                  onChangeText={(text) => {
                    handleChange("code")(text);
                    if (text.length === 4) {
                      handleSubmit();
                    }
                  }}
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
                    textColor={"#FF406E"}
                    size={14}
                    font={BALOO_MEDIUM}
                  />
                )}
              </View>
            );
          }}
        </Formik>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  codeWrapper: {
    marginVertical: 30,
    paddingHorizontal: 20,
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

export default Confirmationcode;
