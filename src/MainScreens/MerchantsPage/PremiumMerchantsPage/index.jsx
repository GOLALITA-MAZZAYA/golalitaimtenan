import React, {useEffect} from "react";
import { StyleSheet } from "react-native";
import { colors } from "../../../components/colors";
import { SCREEN_HEIGHT } from "../../../styles/mainStyles";
import { connect } from "react-redux";
import { getPremiumMerchantList } from "../../../redux/merchant/merchant-thunks";
import { useTranslation } from "react-i18next";
import { setMerchants } from "../../../redux/merchant/merchant-actions";
import MainLayout from "../../../components/MainLayout";
import { useTheme } from "../../../components/ThemeProvider";
import PremiumMerchants from "../../../components/PremiumMerchants";
import { getMerchantDetails } from "../../../redux/merchant/merchant-thunks";
import Header from "../../../components/Header";
import {getUserLocationThunk} from "../../../redux/global/global-thunks";

const PremiumMerchantsPage = ({ navigation, getMerchantDetails, getUserLocationThunk }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  useEffect(() => {
      getUserLocationThunk
  },[])

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={
        <Header
          label={t("Drawer.premiumMerchants")}
          btns={["back"]}
          additionalBtnsProps={{
            back: {
              onPress: () => {
                navigation.navigate("Main");
              },
            },
          }}
        />
      }
      headerHeight={50}
      contentStyle={styles.contentStyle}
      style={{ backgroundColor: isDark ? colors.darkBlue : colors.white }}
    >
      <PremiumMerchants
        isDark={isDark}
        onPress={(merchantId) => {
          getMerchantDetails(
            merchantId,
            navigation,
            t,
            t("MainScreen.localClient")
          );
        }}
      />
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  loaderWrapper: {
    marginVertical: 30,
  },
  categoryWrapper: {
    marginTop: 16,
  },
  contentStyle: {
    height: SCREEN_HEIGHT, //- 120,
    paddingHorizontal: 20,
  },
  contentContainerStyle: {
    paddingBottom: 60,
    flexGrow: 1,
  },
  categoryTouchable: {
    flexDirection: "row",
    alignItems: "center",
  },
});

const mapStateToProps = (state) => ({
  organizations: state.merchantReducer.organizations,
});

export default connect(mapStateToProps, {
  getPremiumMerchantList,
  setMerchants,
  getMerchantDetails,
  getUserLocationThunk
})(PremiumMerchantsPage);
