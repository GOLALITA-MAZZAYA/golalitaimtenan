import Header from "../../components/Header";
import MainLayout from "../../components/MainLayout";
import InfoBlocks from "./components/InfoBlocks";
import CommonButton from "../../components/CommonButton/CommonButton";
import { colors } from "../../components/colors";
import { SCREEN_HEIGHT } from "../../styles/mainStyles";
import { ScrollView, StyleSheet, Linking } from "react-native";
import { useTheme } from "../../components/ThemeProvider";
import { useTranslation } from "react-i18next";
import { getData } from "./data";

const MumayizInfo = ({ route }) => {
  const { title } = route.params;
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const data = getData();

  const handleMerchatDetails = () => {
    Linking.openURL("https://admin.mumayizat.om/product?externalapp=true&company_name=GOLALITA");
  };

  return (
    <>
      <MainLayout
        outsideScroll={true}
        headerChildren={<Header label={title} btns={["back"]} />}
        headerHeight={50}
        contentStyle={{ height: SCREEN_HEIGHT - 120, paddingHorizontal: 20 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
        >
          <InfoBlocks 
          data={data}          
          onPress={() => handleMerchatDetails()}
          label={t("ProductPage.mumayizat")}
          textColor={isDark ? colors.mainDarkModeText : colors.white}
          style={styles.merchantBtn}
          />
        </ScrollView>
      </MainLayout>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  loader: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  merchantBtn: {
    marginTop: 20,
  },
});

export default MumayizInfo;
