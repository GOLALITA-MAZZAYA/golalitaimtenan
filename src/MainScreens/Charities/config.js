import {colors} from "../../components/colors";

export const getHtmlStyleSheet = ( language) => {
  const styles = {
    div: {
      color: colors.loyaltyTextSecondary,
    },
    a: {
      color: colors.loyaltyTextSecondary,
      textDecorationLine: "underline",
      textDecorationStyle: "solid",
      textDecorationColor: colors.loyaltyTextSecondary,
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