import { StyleSheet, View } from "react-native";
import { useTheme } from "../../../../../components/ThemeProvider";
import { useEffect, useState } from "react";
import { colors } from "../../../../../components/colors";
import { TypographyText } from "../../../../../components/Typography";
import { getTemsAndConditions } from "../../../../../api/merchants";
import { useTranslation } from "react-i18next";
import HTMLRenderer from "../../../../../components/HTMLRenderer";

const TermsAndConditions = ({ merchantId, title }) => {
  const { isDark } = useTheme();
  const { i18n } = useTranslation();
  const btnColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const language = i18n.language;

  const getTerms = async () => {
    try {
      setLoading(true);

      const terms = await getTemsAndConditions(merchantId);

      if (terms?.[0]) {
        setData(terms?.[0]);
      }
    } catch (err) {
      console.log(err, "get terms and conditios error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTerms();
  }, [merchantId]);

  if (loading || !data) {
    return null;
  }

  return (
    <View style={styles.infoItem}>
      <View style={styles.infoItemTitleWrapper}>
        <View
          style={[
            styles.infoItemTitle,
            { backgroundColor: isDark ? colors.navyBlue : "#fff" },
          ]}
        >
          <TypographyText
            textColor={btnColor}
            size={15}
            style={{ fontWeight: "700" }}
            title={title}
          />
        </View>
      </View>

      <HTMLRenderer
        value={
          language === "ar" ? data.terms_condition_ar : data.terms_condition
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  controllBtns: {
    flexDirection: "row",
    marginTop: 20,
  },
  infoItem: {
    marginTop: 40,
  },
  infoItemTitleWrapper: {
    width: "100%",
  },
  infoItemTitle: {
    borderRadius: 10,
  },
  infoItemValue: {
    marginTop: 3,
  },
});

export default TermsAndConditions;
