import React, { useCallback, useEffect } from "react";
import {
  Keyboard,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../components/colors";
import { mainStyles } from "../../../styles/mainStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Formik } from "formik";
import Input from "../../../components/Input/Input";
import CommonButton from "../../../components/CommonButton/CommonButton";
import { useTheme } from "../../../components/ThemeProvider";
import { useTranslation } from "react-i18next";
import authApi from "../../../redux/auth/auth-api";
import { SizedBox } from "../../Delivery/screens/_shared/componenets/SizedBox";
import SelectLocation from "../../../components/SelectLocation";
import { getConfig } from "./config";
import { useRoute } from "@react-navigation/native";
import CommonHeader from "../../../components/CommonHeader/CommonHeader";
import { getLocationSchema } from "./schema";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { BALOO_MEDIUM } from "../../../redux/types";
import { TypographyText } from "../../../components/Typography";
import { connect } from "react-redux";
import { createLocation } from "../../../redux/locations/locations-thunks";

const LocationForm = ({ navigation, loading, createLocation }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const route = useRoute();
  let paramsLocation = route.params?.selectedLocation;
  const navigatedFrom = route.params?.navigatedFrom;

  const handleSelectLocationPress = () => {
    navigation.navigate("locations", {
      screen: "locations-map",
    });
  };

  const handleSubmit = (values) => {
    const copyValues = { ...values };

    createLocation(
      {
        location_name: copyValues.location_name,
        location_landmark: "",
        zone: copyValues.zone,
        building_number: copyValues.building_number,
        street_number: copyValues.street_number,
        apartment_number: copyValues.apartment_number,
        floor: copyValues.floor,
        lat: paramsLocation.latitude,
        long: paramsLocation.longitude,
      },
      () => {
        navigation.navigate(...navigatedFrom);
      }
    );
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <>
      <Formik
        initialValues={{
          location_name: paramsLocation?.city || "",
          zone: paramsLocation?.region || "",
          street_number:
            paramsLocation?.streetNumber || paramsLocation?.streetNumber || "",
          building_number: "",
          apartment_number: "",
          floor: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={getLocationSchema()}
        enableReinitialize
      >
        {({
          values,
          handleChange,
          handleSubmit,
          errors,
          submitCount,
          setErrors,
          resetForm,
        }) => {
          errors = submitCount > 0 ? errors : {};

          return (
            <View
              scrollEnabled={Platform.OS === "android"}
              style={{
                backgroundColor: isDark ? colors.darkBlue : colors.bg,
                flex: 1,
              }}
            >
              <SafeAreaView style={{ flex: 1 }}>
                <CommonHeader
                  isWhite={isDark}
                  label={t("LocationForm.title")}
                  onBackPress={handleBackPress}
                  style={{
                    backgroundColor: isDark ? colors.darkBlue : undefined,
                  }}
                />
                <KeyboardAwareScrollView
                  contentContainerStyle={{ paddingBottom: 60 }}
                >
                  <StatusBar barStyle={"dark-content"} />
                  <SizedBox size={20} />
                  <SelectLocation
                    onPress={() => {
                      setErrors({});
                      resetForm();
                      handleSelectLocationPress();
                    }}
                    location={paramsLocation}
                    isDark={isDark}
                  />

                  {!paramsLocation && (
                    <TypographyText
                      title={t("LocationForm.required")}
                      textColor={"#FF406E"}
                      size={14}
                      font={BALOO_MEDIUM}
                      style={{ paddingHorizontal: 20 }}
                    />
                  )}

                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      Keyboard.dismiss();
                    }}
                    style={{ flex: 1 }}
                  >
                    <View style={mainStyles.p20}>
                      <>
                        {getConfig().map((item) => (
                          <Input
                            key={item.key}
                            label={item.label}
                            placeholder={item.placeholder}
                            value={values[item.key]}
                            error={errors[item.key]}
                            wrapperStyle={{ marginBottom: 10 }}
                            disableInputRtl={item.phone}
                            onChangeText={handleChange(item.key)}
                          />
                        ))}

                        <View style={{ zIndex: -1 }}>
                          <CommonButton
                            onPress={handleSubmit}
                            label={t("LocationForm.save")}
                          />
                        </View>
                      </>
                    </View>
                  </TouchableOpacity>
                </KeyboardAwareScrollView>
              </SafeAreaView>
              {loading && <FullScreenLoader absolutePosition />}
            </View>
          );
        }}
      </Formik>
    </>
  );
};

const mapStateToProps = (state) => ({
  locations: state.locationsReducer.locations,
  loading: state.locationsReducer.loading,
});

export default connect(mapStateToProps, { createLocation })(LocationForm);
