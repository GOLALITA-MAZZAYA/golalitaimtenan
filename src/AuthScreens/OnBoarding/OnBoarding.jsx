import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Swiper from "react-native-swiper";
import { styles } from "./styles";
import { sized } from "../../Svg";
import { mainStyles, SCREEN_WIDTH } from "../../styles/mainStyles";
import { TypographyText } from "../../components/Typography";
import { colors } from "../../components/colors";
import { LUSAIL_REGULAR } from "../../redux/types";
import BackSvg from "../../assets/back.svg";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../components/ThemeProvider";
import { getConfig } from "./config";
import CommonButton from "../../components/CommonButton/CommonButton";
import i18next from "i18next";
import { getIfEverLoggedIn } from "../../api/asyncStorage";

const OnBoarding = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const [isSkip, setIsSkip] = useState(false);
  const [isFirstSlide, setIsFirstSlide] = useState(true);

  const swiperRef = useRef();

  const swiperData = useMemo(() => getConfig(i18n.language), [i18n.language]);

  const iconsAndTextColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const backgroundColor = isDark ? colors.darkBlue : colors.bg;

  const logoIcon = require("../../../assets/logo.png");

  const BackIcon = sized(BackSvg, 13, 24, iconsAndTextColor);

  const handleIndexChange = (index) => {
    if (index === 0 && !isFirstSlide) {
      setIsFirstSlide(true);
    }

    if (index !== 0 && isFirstSlide) {
      setIsFirstSlide(false);
    }

    if (index === 4) setIsSkip(true);

    return null;
  };

  const handleScipPress = async () => {
    console.log("hqew");
    const ifEverLoggedIn = await getIfEverLoggedIn();

    console.log(ifEverLoggedIn, "ifEverLoggedIn");

    if (ifEverLoggedIn) {
      navigation.navigate("Login");
    }

    if (!ifEverLoggedIn) {
      navigation.navigate("RegCodeVerification");
    }

    AsyncStorage.setItem("isBoard", false.toString());
  };

  useEffect(() => {
    if (isSkip) {
      setTimeout(handleScipPress, 3000);
    }
  }, [isSkip]);

  const handleBackPress = () => {
    swiperRef.current.scrollBy(-1);
  };

  return (
    <View style={{ backgroundColor, flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      {!isFirstSlide && (
        <TouchableOpacity onPress={handleBackPress} style={styles.back}>
          <BackIcon />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={handleScipPress} style={styles.skip}>
        <TypographyText
          textColor={iconsAndTextColor}
          size={18}
          font={LUSAIL_REGULAR}
          title={t("OnBoarding.skip")}
          style={{ fontWeight: "700" }}
        />
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        onIndexChanged={handleIndexChange}
        loop={false}
        dot={<View style={styles.dot} />}
        activeDot={
          <View style={[styles.dot, { backgroundColor: iconsAndTextColor }]} />
        }
        style={styles.wrapper}
        autoplay={!isFirstSlide}
        autoplayTimeout={3}
      >
        {swiperData.map((item, index) => {
          if (!index) {
            return (
              <TouchableOpacity
                style={[
                  styles.item,
                  mainStyles.p20,
                  { justifyContent: "space-evenly" },
                ]}
                activeOpacity={1}
                key={item.key}
              >
                <View
                  style={[
                    localStyles.logosBlock,
                    {
                      // marginTop: 75
                      alignItems: "center",
                      width: "98%",
                    },
                  ]}
                >
                  <View style={localStyles.logo}>
                    <Image
                      source={logoIcon}
                      style={[
                        localStyles.logoBig,
                        {
                          tintColor: isDark
                            ? colors.mainDarkMode
                            : colors.darkBlue,
                        },
                      ]}
                    />
                  </View>
                  <TypographyText
                    title={t("OnBoarding.welcomeTo")}
                    textColor={iconsAndTextColor}
                    size={24}
                    font={LUSAIL_REGULAR}
                    style={[
                      mainStyles.centeredText,
                      {
                        //marginVertical: 24,
                        fontWeight: "900",
                      },
                    ]}
                  />
                </View>

                <View>
                  <CommonButton
                    label={"English"}
                    textColor={
                      i18next.language === "en"
                        ? isDark
                          ? colors.mainDarkModeText
                          : colors.white
                        : isDark
                        ? colors.white
                        : colors.darkBlue
                    }
                    style={{
                      backgroundColor:
                        i18next.language === "en"
                          ? isDark
                            ? colors.mainDarkMode
                            : colors.darkBlue
                          : "transparent",
                      borderStyle: "solid",
                      borderWidth: i18next.language === "en" ? 0 : 1,
                      borderColor: isDark
                        ? colors.mainDarkMode
                        : colors.darkBlue,
                      shadowColor: "rgba(0, 0, 0, 0)",
                      marginBottom: 20,
                    }}
                    onPress={() => {
                      i18next.changeLanguage("en");

                      swiperRef.current.scrollBy(1);
                    }}
                  />
                  <CommonButton
                    label={"عربي"}
                    textColor={
                      i18next.language === "ar"
                        ? isDark
                          ? colors.mainDarkModeText
                          : colors.white
                        : isDark
                        ? colors.mainDarkMode
                        : colors.darkBlue
                    }
                    style={{
                      backgroundColor:
                        i18next.language === "ar"
                          ? isDark
                            ? colors.mainDarkMode
                            : colors.darkBlue
                          : "transparent",
                      borderStyle: "solid",
                      borderWidth: i18next.language === "ar" ? 0 : 1,
                      borderColor: isDark
                        ? colors.mainDarkMode
                        : colors.darkBlue,
                      shadowColor: "rgba(0, 0, 0, 0)",
                      marginBottom: 20,
                    }}
                    onPress={() => {
                      i18next.changeLanguage("ar");
                      swiperRef.current.scrollBy(1);
                    }}
                  />
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <Image
              source={item.image}
              key={item.key}
              resizeMode="stretch"
              style={localStyles.swiperImage}
            />
          );
        })}
      </Swiper>
    </View>
  );
};

const localStyles = StyleSheet.create({
  swiperImage: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
  logo: {
    marginBottom: 30,
  },
  logoBig: {
    height: 165,
    width: 165,
  },
  additionalLogo: {
    height: 100,
    resizeMode: "contain",
    //width: 165,
  },
  logosBlock: {
    //   flexDirection: "row",
    // alignItems: "flex-end",
  },
});

export default OnBoarding;
