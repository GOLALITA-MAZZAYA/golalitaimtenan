import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import Header from "../../../components/Header";
import MainLayout from "../../../components/MainLayout";
import { useTheme } from "../../../components/ThemeProvider";
import { TypographyText } from "../../../components/Typography";
import { useTranslation } from "react-i18next";
import { colors } from "../../../components/colors";
import CommonButton from "../../../components/CommonButton/CommonButton";
import { BALOO_BOLD, LUSAIL_REGULAR } from "../../../redux/types";

const ARHowToUse = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const handleStartPress = () => {
    navigation.navigate("ARMerchants");
  };

  const textColor = isDark ? colors.white : "#1C1C1E";
  const btnTextColor = isDark ? colors.mainDarkModeText : colors.white;

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={
        <Header label={t("Drawer.offersAroundYou")} btns={["back"]} />
      }
      headerHeight={50}
      contentStyle={styles.contentStyle}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Image */}
        <Image
          source={require("../../../assets/360info.png")}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Text Section */}
        <View style={styles.textWrapper}>
          <TypographyText
            title={t("ar.title")}
            textColor={textColor}
            size={24}
            font={BALOO_BOLD}
            style={styles.text}
          />
          <TypographyText
            title={t("ar.infoDescription")}
            textColor={textColor}
            size={15}
            font={LUSAIL_REGULAR}
            style={styles.description}
          />
        </View>

        {/* Start Button */}
        <CommonButton
          onPress={handleStartPress}
          label={t("ar.start")}
          style={styles.startBtn}
          textColor={btnTextColor}
        />
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  contentStyle: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 14,
    marginBottom: 20,
  },
  textWrapper: {
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  text: {
    marginBottom: 12,
  },
  description: {
    lineHeight: 24,
  },
  startBtn: {
    width: 220,
    borderRadius: 14,
    alignSelf: "center",
    marginBottom: 10,
  },
});

export default ARHowToUse;