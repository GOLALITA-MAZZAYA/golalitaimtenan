import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { LUSAIL_REGULAR } from "../../redux/types";
import { Formik } from "formik";
import { TypographyText } from "../Typography";
import ArrowSvg from "../../assets/arrow_down_thin.svg";
import { sized } from "../../Svg";
import { useTheme } from "../ThemeProvider";
import { colors } from "../colors";
import { useTranslation } from "react-i18next";

const FilterScreen = (props) => {
  const {
    onReset,
    onClose,
    onSubmit,
    children,
    title,
    initialValues,
    onBackPress,
    defaultValues,
  } = props;

  const { isDark } = useTheme();
  const { t } = useTranslation();

  const ArrowIcon = sized(
    ArrowSvg,
    30,
    30,
    isDark ? colors.white : colors.darkBlue
  );

  const btnBackgroundColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const btnTextColor = isDark ? colors.mainDarkModeText : colors.white;

  return (
    <SafeAreaView
      style={[
        styles.main,
        { backgroundColor: isDark ? colors.darkBlue : colors.white },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
          <ArrowIcon />
        </TouchableOpacity>
        <View style={styles.title}>
          <TypographyText
            textColor={isDark ? colors.white : colors.darkBlue}
            size={20}
            font={LUSAIL_REGULAR}
            title={title}
            numberOfLines={1}
            style={{ marginRight: 32, fontWeight: "700" }}
          />
        </View>
      </View>
      <View style={styles.main}>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {({ submitForm, dirty, resetForm }) => {
            const isDirty =
              dirty ||
              Object.values(initialValues).filter((item) => {
                return Array.isArray(item) && item.length > 0;
              }).length > 0;

            const handleReset = () => {
              defaultValues
                ? resetForm({ values: defaultValues })
                : resetForm();

              resetForm(defaultValues);

              onReset?.();
            };

            return (
              <>
                <ScrollView
                  style={styles.body}
                  showsVerticalScrollIndicator={false}
                >
                  {children}
                </ScrollView>
                <View style={styles.footer}>
                  {!!isDirty ? (
                    <>
                      <View>
                        <TouchableOpacity
                          onPress={handleReset}
                          style={[
                            styles.filtersBtn,
                            {
                              backgroundColor: btnBackgroundColor,
                            },
                          ]}
                        >
                          <TypographyText
                            textColor={btnTextColor}
                            size={12}
                            font={LUSAIL_REGULAR}
                            title={t("Merchants.reset")}
                            numberOfLines={2}
                            style={{ fontWeight: "700" }}
                          />
                        </TouchableOpacity>
                      </View>
                      <View>
                        <TouchableOpacity
                          onPress={submitForm}
                          style={[
                            styles.filtersBtn,
                            {
                              backgroundColor: btnBackgroundColor,
                            },
                          ]}
                        >
                          <TypographyText
                            textColor={btnTextColor}
                            size={12}
                            font={LUSAIL_REGULAR}
                            title={t("Merchants.apply")}
                            numberOfLines={2}
                            style={{ fontWeight: "700" }}
                          />
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <View style={styles.footerClose}>
                      <TouchableOpacity
                        onPress={onClose}
                        style={[
                          styles.filtersBtn,
                          {
                            backgroundColor: btnBackgroundColor,
                          },
                        ]}
                      >
                        <TypographyText
                          textColor={btnTextColor}
                          size={12}
                          font={LUSAIL_REGULAR}
                          title={t("Merchants.close")}
                          numberOfLines={2}
                          style={{ fontWeight: "700" }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </>
            );
          }}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 20,
  },
  body: {
    flex: 1,
  },
  footer: {
    height: 32,
    marginVertical: 20,
    flexDirection: "row",
    paddingHorizontal: 15,
    justifyContent: "space-around",
  },
  footerClose: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footerLeft: {
    width: "50%",
    paddingRight: 5,
  },
  footerRight: {
    width: "50%",
    paddingLeft: 5,
  },
  header: {
    flexDirection: "row",
  },
  title: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filtersBtn: {
    width: 125,
    height: 32,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  backBtn: {
    width: 32,
    height: 32,
    transform: [{ rotate: "90deg" }],
    marginLeft: 10,
  },
});

export default FilterScreen;
