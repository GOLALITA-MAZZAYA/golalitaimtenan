import { StyleSheet } from "react-native";
import { useTheme } from "../../../../../components/ThemeProvider";
import { useEffect, useState } from "react";
import { colors } from "../../../../../components/colors";
import { getTemsAndConditions } from "../../../../../api/merchants";
import { useTranslation } from "react-i18next";
import InfoWithTitleBlock from "../../../../../components/InfoWithTitleBlock";
import DescriptionSvg from '../../../../../assets/loyaltyPoints/description.svg';

const TermsAndConditions = ({ merchantId, title, style = {} }) => {
  const { isDark } = useTheme();
  const { i18n } = useTranslation();
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
    <InfoWithTitleBlock
      style={{ ...styles.termsBlock, ...style }}
      title={title || i18n.t('ProductPage.terms')}
      description={language === "ar" ? data.terms_condition_ar : data.terms_condition}
      html
      icon={<DescriptionSvg color={colors.loyaltyPrimary} />}
    />
  )
};

const styles = StyleSheet.create({
  termsBlock: {
    marginTop: 26
  }
});

export default TermsAndConditions;
