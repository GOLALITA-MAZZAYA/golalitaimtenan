import { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { View } from "react-native";
import CommonHeader from "../../../components/CommonHeader/CommonHeader";
import Pdf from 'react-native-pdf-jsi';
import { useTheme } from "../../../components/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../components/colors";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { TypographyText } from "../../../components/Typography";
import { useTranslation } from "react-i18next";
import { BALOO_MEDIUM } from "../../../redux/types";

const Menu = (props) => {
  const { isDark } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const company_contract_url = props.route?.params?.company_contract_url;

  const [error, setError] = useState(!company_contract_url);

  const handleBackPress = () => {
    navigation.goBack ? navigation.goBack() : navigation.navigate("Main");
  };


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? colors.darkBlue : colors.white,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <CommonHeader
          isWhite={isDark}
          label={t("Merchants.contract")}
          onBackPress={handleBackPress}
          style={{ backgroundColor: isDark ? colors.darkBlue : undefined }}
        />

        {!!company_contract_url && !error && (
          <Pdf
            source={{
              uri: company_contract_url,
            }}
            onError={(error) => {
              console.log(error, "errr");
              setError(true);
            }}
            style={styles.pdf}
            renderActivityIndicator={() => {
              return <FullScreenLoader style={styles.loader} />;
            }}
            trustAllCerts={false}
          />
        )}

        {error && (
          <View style={styles.errorWrapper}>
            <TypographyText
              title={t("General.error")}
              textColor={isDark ? colors.white : colors.darkBlue}
              size={18}
              font={BALOO_MEDIUM}
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  pdf: { flex: 1 },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  errorWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Menu;
