import { Linking } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../ThemeProvider";
import { colors } from "../colors";
import HTMLView from "react-native-htmlview";

const ALLOWED_LINK_SCHEMES = ["http:", "https:", "mailto:", "tel:"];

// react-native-htmlview's default onLinkPress is a bare Linking.openURL(url)
// with no scheme check — a server-supplied javascript:/intent:/file: link
// would be opened unvalidated. Only allow known-safe schemes (or schemeless
// relative links, left to Linking to reject).
export const handleSafeLinkPress = url => {
  const match = typeof url === "string" && /^([a-zA-Z][a-zA-Z\d+.-]*:)/.exec(url.trim());
  const scheme = match ? match[1].toLowerCase() : null;

  if (scheme && !ALLOWED_LINK_SCHEMES.includes(scheme)) {
    console.warn("[HTMLRenderer] Blocked link with disallowed scheme:", url);
    return;
  }

  Linking.openURL(url);
};

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
      onLinkPress={handleSafeLinkPress}
      {...restProps}
    />
  );
};

export default HTMLRenderer;
