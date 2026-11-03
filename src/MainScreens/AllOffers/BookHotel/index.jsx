import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import ModalInfo from "../../../components/ModalInfo/ModalInfo";
import FormikDate from "./FormikDate";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import NameBlock from "./NameBlock";
import PriceBlock from "./PriceBlock";
import FormikCounter from "../../../components/Formik/FormikCounter";
import FormikTabsSelect from "../../../components/Formik/FormikTabsSelect";
import FormikCustomInput from "../../../components/Formik/FormikCustomInput";
import { bookHotel } from "../../../api/offers";
import { showMessage } from "react-native-flash-message";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { HEADER_HEIGHT } from "../../../constants";
import { org } from "../../../org/config";

const personsOptions = [
  { label: '1', label_arabic: '1', value: 1 },
  { label: '2', label_arabic: '2', value: 2 },
  { label: '3', label_arabic: '3', value: 3 },
  { label: '4', label_arabic: '4', value: 4 },
]


const BookHotel = ({ user, route, navigation }) => {
  const [isSuccessBook, setIsSuccessBook] = useState(false);
  let params = route?.params;
  console.log("params boook hotel", params)
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);


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
        nights: 1
      }}
      validationSchema={Yup.object({
        name: Yup.string().required(t("Login.required")),
        x_moi_last_name: Yup.string().required(t("Login.required")),
        // country: Yup.string().required(t("Login.required")),
        // city: Yup.string().required(t("Login.required")),
        departure_date: Yup.string().required(t("Login.required")),
        return_date: Yup.string().required(t("Login.required")),
        nights: Yup.string().required(t("Login.required")),
        no_adult: Yup.string().required(t("Login.required")),
        no_children: Yup.string(),
      })}
      onSubmit={
        async ({ no_adult, no_children, departure_date, return_date, ...values }, { setFieldError }) => {
          console.log("here");
          // if (return_date - departure_date < 0) {
          //   setFieldError(
          //     "return_date",
          //     t("Profile.returnDateMoreThanDeparture")
          //   );
          // } else {
          try {
            setLoading(true);
            let payload = {
              Hotel: params?.name,
              no_adult: +no_adult,
              no_children: +no_children,
              departure_date,
              return_date,
              ...values,
              hotel_email: params?.email,
              organisation: org.displayName,
              org_id: org.id,
              merchant_id: params?.merchant_id,
              product_price:
                typeof values.product_price === "number"
                  ? Number(values.product_price)
                  : undefined,
              nights: 1,
              odoo_base_url: org.baseUrl,
              Hotel: params?.hotel
            }
            console.log("payload book hotel", payload)
            const res = await bookHotel(payload);

            if (res?.success) {
              showMessage({
                message: t('Profile.submitSuccess'),
                type: 'success',
              });

              setIsSuccessBook(true);
            } else {
              showMessage({
                message: t('Login.somethingWrong'),
                type: 'success',
              });
            }
          } catch (err) {
            console.log(err, 'err')
          } finally {
            setLoading(false)
          }

          // }
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

        console.log(errors, 'errors')
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
            <Header
              label={t("Merchants.requestReservation")}
              btns={['back']}
            />

            <ScrollView
              style={styles.list}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.contentContainerStyle}
            >

              <FormikDate
                label={t("BookHotel.checkInDate")}
                value={getDateString(values.departure_date)}
                name="departure_date"
              />

              <FormikDate
                label={t("BookHotel.checkOutDate")}
                value={getDateString(values.return_date)}
                name="return_date"
              />

              <FormikCounter name="nights" label={t("BookHotel.nights")} style={styles.blockMargin} />

              <FormikTabsSelect name="no_adult" label={t("BookHotel.numberOfGuests")} style={styles.blockMargin} options={personsOptions} />

              <FormikTabsSelect name="no_children" label={t("BookHotel.numberOfChildren")} style={styles.blockMargin} options={personsOptions} />


              <NameBlock name={params.title} style={styles.blockMargin} />

              <PriceBlock
                price={values.product_price}
                style={styles.blockMargin}
                total={values.nights ? values.product_price * values.nights : values.product_price}
              />

              <FormikCustomInput
                name="note"
                // label={t("BookHotel.noteLabel")}
                placeholder={t("BookHotel.notePlaceholder")}
                wrapperStyle={{ ...styles.blockMargin, height: 120 }}
                inputStyle={{ paddingTop: 20 }}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />

              <Button
                onPress={handleSubmit}
                text={t("BookHotel.confirm")}
                style={styles.submitBtn}
              />

            </ScrollView>

            {loading && <FullScreenLoader absolutePosition style={styles.loader} />}
          </>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20
  },
  blockMargin: {
    marginTop: 20
  },
  submitBtn: {
    marginTop: 27
  },
  contentContainerStyle: {
    paddingBottom: 60
  },
  loader: {
    width: "100%",
    height: Dimensions.get("window").height,
    top: -HEADER_HEIGHT,
  },
});

const mapStateToProps = (state) => ({
  user: state.authReducer.user,
});

export default connect(mapStateToProps, {})(BookHotel);

