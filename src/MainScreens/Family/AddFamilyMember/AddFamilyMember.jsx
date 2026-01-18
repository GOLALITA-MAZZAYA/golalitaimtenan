import React, { useRef, useState } from "react";
import {
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import CommonHeader from "../../../components/CommonHeader/CommonHeader";
import { styles } from "./styles";
import { sized } from "../../../Svg";
import CameraSvg from "../../../assets/camera.svg";
import { mainStyles } from "../../../styles/mainStyles";
import { launchImageLibrary } from "react-native-image-picker";
import { Formik } from "formik";
import Input from "../../../components/Input/Input";
import { useTranslation } from "react-i18next";
import CommonButton from "../../../components/CommonButton/CommonButton";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  addFamilyMember,
  editFamilyMember,
} from "../../../redux/transactions/transactions-thunks";
import { connect } from "react-redux";
import { colors } from "../../../components/colors";
import { useTheme } from "../../../components/ThemeProvider";
import authApi from "../../../redux/auth/auth-api";
import { showMessage } from "react-native-flash-message";

const CameraIcon = sized(CameraSvg, 36, 32);

const AddFamilyMember = ({
  navigation,
  route,
  addFamilyMember,
  editFamilyMember,
}) => {
  let params = route?.params;
  const [image, setImage] = useState(null);
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const ref_to_input2 = useRef();
  const ref_to_input3 = useRef();
  const ref_to_input4 = useRef();
  const pickImage = async () => {
    let data = await launchImageLibrary({
      mediaTypee: "photo",
      quality: 1,
      includeBase64: true,
    });

    const base64 = data?.assets?.[0]?.base64;

    if (!base64) {
      alert("Error, can not set image");

      return;
    }

    setImage(base64);
  };

  return (
    <Formik
      initialValues={{
        fullName: params?.selectedFamily?.name ?? "",
        last_name: params?.selectedFamily?.x_moi_last_name ?? "",
        email: params?.selectedFamily?.email ?? "",
        phone: params?.selectedFamily?.phone ?? "+974",
        password: "",
      }}
      validationSchema={Yup.object({
        fullName: Yup.string().required(t("Login.required")),
        last_name: Yup.string().required(t("Login.required")),
        email: Yup.string()
          .email(t("ContactUs.enterValidEmail"))
          .required(t("Login.required")),
        phone: Yup.string()
          .min(7, t("ContactUs.enterValidPhone"))
          .required(t("Login.required")),
        password: Yup.string().required(t("Login.required")),
      })}
      onSubmit={async (values, { setFieldError }) => {
        let isAnyError = false;

        const phoneRes = await authApi.checkPhone({
          params: { phone: values.phone },
        });

        if (phoneRes.data.result?.error) {
          setFieldError("phone", t("Profile.phoneExists"));
          return;
        }

        if (!isAnyError) {
          let body = {
            name: values.fullName,
            last_name: values.last_name,
            phone: values.phone,
            password: values.password,
            email: values.email,
            image_1920: image,
          };
          if (params?.isEdit) {
            editFamilyMember(
              { ...body, member_id: params?.selectedFamily?.id },
              navigation
            );
          } else {
            addFamilyMember(body, navigation, (errMessage) => {
              showMessage({
                message: errMessage,
                type: "danger",
              });
            });
          }
        }
      }}
    >
      {({ values, handleChange, handleSubmit, errors, submitCount }) => {
        errors = submitCount > 0 ? errors : {};
        return (
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: isDark ? colors.darkBlue : colors.white,
            }}
          >
            <CommonHeader
              isWhite={isDark}
              label={
                params?.isEdit ? t("Profile.editMember") : t("Family.addMember")
              }
            />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  Keyboard.dismiss();
                }}
              >
                <View style={mainStyles.centeredRow}>
                  <TouchableOpacity
                    onPress={pickImage}
                    style={styles.changePhoto}
                  >
                    {image ? (
                      <Image
                        style={styles.photo}
                        source={{ uri: `data:image/png;base64,${image}` }}
                      />
                    ) : (
                      <CameraIcon />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={[mainStyles.p20]}>
                  <Input
                    label={t("Profile.fullName")}
                    value={values.fullName}
                    returnKeyType={"next"}
                    onSubmitEditing={() => ref_to_input2.current.focus()}
                    onChangeText={handleChange("fullName")}
                    error={errors.fullName}
                    wrapperStyle={styles.input}
                  />
                  <Input
                    innerRef={ref_to_input2}
                    label={t("Profile.lastName")}
                    value={values.last_name}
                    returnKeyType={"next"}
                    onSubmitEditing={() => ref_to_input3.current.focus()}
                    onChangeText={handleChange("last_name")}
                    error={errors.last_name}
                    wrapperStyle={styles.input}
                  />
                  <Input
                    label={t("ContactUs.email")}
                    value={values.email}
                    innerRef={ref_to_input3}
                    returnKeyType={"next"}
                    onSubmitEditing={() => ref_to_input4.current.focus()}
                    onChangeText={(e) => {
                      handleChange("email")(e.toLowerCase());
                    }}
                    autoCapitalize="none"
                    error={errors.email}
                    style={{ textTransform: "lowercase" }}
                    autoCorrect={false}
                    keyboardType={
                      Platform.OS === "ios" ? "default" : "visible-password"
                    }
                    // secureTextEntry={true}

                    secureTextEntry={false}
                    wrapperStyle={styles.input}
                  />

                  <View style={{ zIndex: -1 }}>
                    <Input
                      label={t("Login.password")}
                      value={values.password}
                      innerRef={ref_to_input4}
                      returnKeyType={"next"}
                      onSubmitEditing={Keyboard.dismiss}
                      onChangeText={handleChange("password")}
                      error={errors.password}
                      wrapperStyle={styles.input}
                    />
                    <Input
                      label={t("ContactUs.mobileNumber")}
                      initialValue={values.phone}
                      onChangePhoneNumber={handleChange("phone")}
                      returnKeyType={"next"}
                      onSubmitEditing={Keyboard.dismiss}
                      error={errors.phone}
                      wrapperStyle={[styles.input]}
                      disableInputRtl
                    />
                  </View>
                  <CommonButton
                    style={{ marginBottom: 40 }}
                    onPress={handleSubmit}
                    label={
                      params?.isEdit
                        ? t("Profile.editMember")
                        : t("Family.addMember")
                    }
                  />
                </View>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        );
      }}
    </Formik>
  );
};

export default connect(null, { addFamilyMember, editFamilyMember })(
  AddFamilyMember
);
