import React, { useRef, useState } from "react";
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../components/colors";
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import { Formik } from "formik";
import * as Yup from "yup";
import { mainStyles } from "../../styles/mainStyles";
import Input from "../../components/Input/Input";
import CommonButton from "../../components/CommonButton/CommonButton";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../components/ThemeProvider";
import { connect } from "react-redux";
import { sized } from "../../Svg";
import EditSvg from "../../assets/edit.svg";
import { bookNow } from "../../redux/merchant/merchant-thunks";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ModalInfo from "../../components/ModalInfo/ModalInfo";

const EditIcon = sized(EditSvg, 17, 19);

const BookHotel = ({ user, bookNow, route, navigation }) => {
  const [isSuccessBook, setIsSuccessBook] = useState(false);
  let params = route?.params;
  const ref_to_input4 = useRef();
  const ref_to_input5 = useRef();
  const ref_to_input6 = useRef();
  const ref_to_input7 = useRef();
  const ref_to_input8 = useRef();
  const [isDepartureDateVisible, setIsDepartureDateVisible] = useState(false);
  const [isReturnDateVisible, setIsReturnDateVisible] = useState(false);
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const getDateString = (date) => {
    if (!date.getFullYear) return "";
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  return (
    <Formik
      initialValues={{
        name: user.name ?? "",
        x_moi_last_name: user.x_moi_last_name ?? "",
        phone: user.phone ?? "",
        email: user.email ?? "",
        // country: "",
        // city: "",
        departure_date: "",
        return_date: "",
        no_adult: "",
        no_children: "",
        note: "",
        product_id: params?.product_id,
        product_name: params?.product_name,
        product_price: params?.product_price,
      }}
      validationSchema={Yup.object({
        name: Yup.string().required(t("Login.required")),
        x_moi_last_name: Yup.string().required(t("Login.required")),
        // country: Yup.string().required(t("Login.required")),
        // city: Yup.string().required(t("Login.required")),
        departure_date: Yup.string().required(t("Login.required")),
        return_date: Yup.string().required(t("Login.required")),
      })}
      onSubmit={(
        { no_adult, no_children, departure_date, return_date, ...values },
        { setFieldError }
      ) => {
        console.log("here");
        if (return_date - departure_date < 0) {
          setFieldError(
            "return_date",
            t("Profile.returnDateMoreThanDeparture")
          );
        } else {
          bookNow(
            {
              Hotel: params?.name,
              no_adult: +no_adult,
              no_children: +no_children,
              departure_date: getDateString(departure_date),
              return_date: getDateString(return_date),
              ...values,
              hotel_email: params?.email,
              organisation:"Golalita",
              product_price:
                typeof values.product_price === "number"
                  ? Number(values.product_price)
                  : undefined,
            },
            t,
            setIsSuccessBook
          );
        }
      }}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        errors,
        submitCount,
        setFieldValue,
      }) => {
        errors = submitCount > 0 ? errors : {};
        return (
          <>
            {isSuccessBook && (
              <ModalInfo
                isSuccess={true}
                onCancel={() => {
                  setIsSuccessBook(false);
                  navigation.goBack();
                }}
                onSubmit={() => {
                  setIsSuccessBook(false);
                  navigation.goBack();
                }}
                title={t("Family.sentSuccess")}
                description={t("Family.sentBookForm")}
              />
            )}
            <TouchableOpacity
              activeOpacity={1}
              onPress={Keyboard.dismiss}
              style={{
                backgroundColor: isDark ? colors.darkBlue : colors.white,
                flex: 1,
              }}
            >
              <SafeAreaView style={{ flex: 1 }}>
                <CommonHeader
                  isWhite={isDark}
                  label={t("Merchants.requestReservation")}
                />
                <View
                  style={[
                    mainStyles.p20,
                    {
                      flex: 1,
                      justifyContent: "space-between",
                      marginBottom: 30,
                    },
                  ]}
                >
                  <ScrollView
                    style={{ marginBottom: 10 }}
                    showsVerticalScrollIndicator={false}
                  >
                    <TouchableOpacity activeOpacity={1}>
                      <View style={{ marginTop: 20, marginHorizontal: 4 }}>
                        <Input
                          innerRef={ref_to_input4}
                          label={t("Profile.departureDate")}
                          value={getDateString(values.departure_date)}
                          onChangeText={() => {}}
                          placeholder={t("Profile.departureDate")}
                          returnKeyType={"next"}
                          error={errors.departure_date}
                          wrapperStyle={{ marginBottom: 20 }}
                          onFocus={() => setIsDepartureDateVisible(true)}
                          onSubmitEditing={() => ref_to_input5.current.focus()}
                        />
                        <Input
                          innerRef={ref_to_input5}
                          label={t("Profile.returnDate")}
                          value={getDateString(values.return_date)}
                          onChangeText={() => {}}
                          placeholder={t("Profile.returnDate")}
                          returnKeyType={"next"}
                          error={errors.return_date}
                          onFocus={() => setIsReturnDateVisible(true)}
                          wrapperStyle={{ marginBottom: 20 }}
                          onSubmitEditing={() => ref_to_input6.current.focus()}
                        />
                        {values.product_name && (
                          <Input
                            label={"Name"}
                            value={values.product_name}
                            placeholder={"Name placeholder"}
                            error={errors.product_name}
                            wrapperStyle={{ marginBottom: 20 }}
                            editable={false}
                          />
                        )}
                        {values.product_price !== undefined && (
                          <Input
                            label={"Price"}
                            value={values.product_price.toString()}
                            placeholder={"Price placeholder"}
                            error={errors.product_price}
                            wrapperStyle={{ marginBottom: 20 }}
                            editable={false}
                          />
                        )}
                        <Input
                          innerRef={ref_to_input6}
                          label={t("Profile.numberAdults")}
                          value={values.no_adult}
                          onChangeText={handleChange("no_adult")}
                          placeholder={t("Profile.numberAdults")}
                          returnKeyType={"next"}
                          wrapperStyle={{ marginBottom: 20 }}
                          keyboardType={"numeric"}
                          onSubmitEditing={() => ref_to_input7.current.focus()}
                        />
                        <Input
                          innerRef={ref_to_input7}
                          label={t("Profile.numberChildren")}
                          value={values.no_children}
                          onChangeText={handleChange("no_children")}
                          placeholder={t("Profile.numberChildren")}
                          returnKeyType={"next"}
                          wrapperStyle={{ marginBottom: 20 }}
                          keyboardType={"numeric"}
                          onSubmitEditing={() => ref_to_input8.current.focus()}
                        />
                        <Input
                          innerRef={ref_to_input8}
                          value={values.note}
                          onChangeText={handleChange("note")}
                          // label={t("Profile.note")}
                          placeholder={t("Profile.note")}
                          wrapperStyle={{ marginBottom: 20 }}
                          returnKeyType={"next"}
                          onSubmitEditing={Keyboard.dismiss}
                          height={335}
                          icon={<EditIcon />}
                          error={errors.note}
                        />
                      </View>
                    </TouchableOpacity>
                  </ScrollView>
                  <CommonButton
                    onPress={handleSubmit}
                    label={t("ContactUs.send")}
                  />
                </View>
              </SafeAreaView>
              <DateTimePickerModal
                isVisible={isDepartureDateVisible}
                mode="date"
                onConfirm={(date) => {
                  setIsDepartureDateVisible(false);
                  setFieldValue("departure_date", date);
                }}
                onCancel={() => setIsDepartureDateVisible(false)}
              />
              <DateTimePickerModal
                isVisible={isReturnDateVisible}
                mode="date"
                onConfirm={(date) => {
                  setIsReturnDateVisible(false);
                  setFieldValue("return_date", date);
                }}
                onCancel={() => setIsReturnDateVisible(false)}
              />
            </TouchableOpacity>
          </>
        );
      }}
    </Formik>
  );
};

const mapStateToProps = (state) => ({
  user: state.authReducer.user,
});

export default connect(mapStateToProps, { bookNow })(BookHotel);
