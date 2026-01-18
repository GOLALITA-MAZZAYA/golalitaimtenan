import { SafeAreaView, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { useTheme } from "../../components/ThemeProvider";
import { useTranslation } from "react-i18next";
import { colors } from "../../components/colors";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import Header from "../../components/Header";

const PrivacyPolicy = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        {
          backgroundColor: isDark ? colors.darkBlue : colors.white,
        },
        styles.fullScreen,
      ]}
    >
      <SafeAreaView style={styles.fullScreen}>
        <Header label={t("Drawer.privacyPolicy")} btns={["back"]} />
        <WebView
          startInLoadingState
          source={{
            uri: "https://www.golalita.com/privacy-policy",
          }}
          style={styles.webView}
          renderLoading={() => <FullScreenLoader absolutePosition />}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  fullScreen: {
    flex: 1,
  },
});

export default PrivacyPolicy;
