import { StyleSheet, View } from "react-native";
import { useTheme } from "../ThemeProvider";
import { colors } from "../colors";
import { BALOO_SEMIBOLD } from "../../redux/types";
import { TypographyText } from "../Typography";
import { useTranslation } from "react-i18next";

const InfoBlock = ({ children, title }) => {
  const { isDark } = useTheme();
  const { i18n } = useTranslation();
  const language = i18n.language;
  const borderColor = {
    borderColor: isDark ? "rgba(211,211,211,0.3)" : "rgba(211,211,211,0.3)",
  };
  const backgroundColor = {
    backgroundColor: isDark ? colors.navyBlue : "#fff",
  };
  const textColor = isDark ? colors.mainDarkMode : colors.darkBlue;

  return (
    <View style={[styles.infoItem, borderColor]}>
      <View style={styles.infoItemTitleWrapper}>
        <View style={[styles.infoItemTitle, backgroundColor, borderColor]}>
          <TypographyText
            textColor={textColor}
            size={15}
            font={BALOO_SEMIBOLD}
            style={styles.textStyle}
            title={title}
          />
        </View>
      </View>
      <View
        style={[
          styles.block,
          { alignItems: language === "ar" ? "flex-end" : "flex-start" },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoItem: {
    width: "100%",
    marginTop: 40,
   // borderWidth: 1.5,
    //borderRadius: 10,
    //padding: 12,
    //position: "relative",
  //  paddingTop: 30,
  },
  infoItemTitleWrapper: {
   // padding: 6,
   // position: "absolute",
   // top: -30,
    width: "100%",
   // justifyContent: "center",
    //alignItems: "center",
  },
  infoItemTitle: {
   // borderWidth: 1.5,
    //borderRadius: 10,
    //padding: 8,
  },
  infoItemValue: {
    marginTop: 3,
  },
  textStyle: {
    fontWeight: "700",
  },
  block: {
    alignItems: "flex-start",
  },
});

export default InfoBlock;
