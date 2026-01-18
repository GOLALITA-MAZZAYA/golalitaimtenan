import { useTranslation } from "react-i18next";
import { useTheme } from "../ThemeProvider";
import { colors } from "../colors";
import HTMLView from "react-native-htmlview";

export const getHtmlStyleSheet = (isDark, language, color) => {
  const styles = {
    div: {
      color: color || `${isDark ? colors.white : colors.darkBlue}`,
    },
    a: {
      color: isDark ? colors.white : colors.darkBlue,
      textDecorationLine: "underline",
      textDecorationStyle: "solid",
      textDecorationColor: isDark ? colors.white : colors.darkBlue,
    },
  };

  if (language === "ar") {
    styles["span"] = {
      textAlign: "right",
    };
    styles["p"] = {
      textAlign: "right",
    };
    styles["div"] = {
      textAlign: "right",
    };
    // styles["a"] = {
    //   textAlign: "right",
    // };
    styles["li"] = {
      textAlign: "right",
    };
    styles["ol"] = {
      textAlign: "right",
    };
    styles["ul"] = {
      textAlign: "right",
    };
  }

  return styles;
};

const HTMLRenderer = ({ value, color, ...restProps }) => {
  const { isDark } = useTheme();
  const { i18n } = useTranslation();

  const textColor =
    color !== undefined ? color : isDark ? colors.white : colors.darkBlue;

  return (
    <HTMLView
      value={value}
      stylesheet={getHtmlStyleSheet(isDark, i18n.language, color)}
      addLineBreaks={true}
      paragraphBreak={false}
      textComponentProps={{
        style: {
          color: textColor,
        },
      }}
      {...restProps}
    />
  );
};

export default HTMLRenderer;
