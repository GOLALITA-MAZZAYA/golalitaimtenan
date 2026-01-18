import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { mainStyles } from "../../styles/mainStyles";
import BurgerSvg from "../../assets/burger.svg";
import { sized } from "../../Svg";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../components/colors";
import { BALOO_BOLD, BALOO_REGULAR, BALOO_SEMIBOLD } from "../../redux/types";
import { TypographyText } from "../../components/Typography";
import BackWhiteSvg from "../../assets/back_white.svg";
import { useTheme } from "../../components/ThemeProvider";
import DarkBurgerSvg from "../../assets/dark_burger.svg";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { getFlexDirection, isRTL } from "../../../utils";

const BurgerIcon = sized(BurgerSvg, 29, 24);
const DarkBurgerIcon = sized(DarkBurgerSvg, 29, 24);

const MainScreenHeader = ({ headerLabel, user }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const navigation = useNavigation();
  const iconColor = isDark ? colors.white : colors.darkBlue;

  const BackWhiteIcon = sized(BackWhiteSvg, 13, 24, iconColor);

  return (
    <View style={[styles.container, mainStyles.p20]}>
      <View
        style={[
          mainStyles.betweenRow,
          { alignItems: "flex-start" },
          getFlexDirection(),
        ]}
      >
        <TouchableOpacity
          style={[
            { padding: 15, marginLeft: -15, marginTop: -5 },
            isRTL() && { transform: [{ rotate: "180deg" }] },
          ]}
          onPress={() => {
            if (headerLabel) navigation.goBack();
            else navigation.openDrawer();
          }}
        >
          {headerLabel ? (
            <BackWhiteIcon />
          ) : isDark ? (
            <DarkBurgerIcon />
          ) : (
            <BurgerIcon />
          )}
        </TouchableOpacity>
        {headerLabel ? (
          <TypographyText
            textColor={iconColor}
            size={18}
            font={BALOO_SEMIBOLD}
            title={headerLabel}
          />
        ) : (
          <TouchableOpacity
            style={[
              {
                height: 78,
                width: 78,
                marginLeft: 0,
                borderRadius: 50,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Image
              style={{ width: 76, height: 76, borderRadius: 50 }}
              source={{ uri: user?.organisation_logo }}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{ backgroundColor: "white", padding: 1, borderRadius: 50 }}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image
            style={styles.avatar}
            source={
              user?.photo
                ? { uri: user.photo }
                : require("../../assets/avatar.png")
            }
          />
        </TouchableOpacity>
      </View>
      <View>
        <View style={[mainStyles.centeredRow, { marginTop: 14 }]}>
          <TypographyText
            textColor={iconColor}
            size={14}
            font={BALOO_REGULAR}
            title={t("CardPage.availablePoint")}
            style={[]}
          />
        </View>
        <View style={[mainStyles.centeredRow, { marginBottom: 11 }]}>
          <TypographyText
            textColor={iconColor}
            size={48}
            font={BALOO_BOLD}
            title={user?.available_points}
            style={{ marginTop: -10 }}
          />
        </View>
      </View>
      <View
        style={[
          mainStyles.betweenRow,
          { alignItems: "stretch" },
          getFlexDirection(),
        ]}
      >
        <TouchableOpacity
          style={[styles.stat, isDark && { backgroundColor: colors.darkBlue }]}
        >
          <View style={[, getFlexDirection(), { alignItems: "center" }]}>
            <Image
              source={require("../../../assets/logo.png")}
              style={styles.logo}
            />
            <TypographyText
              textColor={isDark ? colors.white : colors.darkBlue}
              size={24}
              font={BALOO_BOLD}
              title={user?.total_points_used}
              style={{ marginLeft: 3 }}
            />
          </View>
          <TypographyText
            textColor={isDark ? colors.white : colors.darkBlue}
            size={18}
            font={BALOO_SEMIBOLD}
            title={t("MainScreen.pointUsed")}
            style={[]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.stat, isDark && { backgroundColor: colors.darkBlue }]}
        >
          <TypographyText
            textColor={isDark ? colors.white : colors.darkBlue}
            size={24}
            font={BALOO_BOLD}
            title={user?.total_saving}
            style={[]}
          />
          <TypographyText
            textColor={isDark ? colors.white : colors.darkBlue}
            size={18}
            font={BALOO_SEMIBOLD}
            title={t("MainScreen.totalSaving")}
            style={[]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 50,
  },
  stat: {
    width: "49%",
    backgroundColor: colors.white,
    borderRadius: 8,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 7,
  },
  logo: {
    height: 20,
    width: 20,
  },
});

const mapStateToProps = (state) => ({
  user: state.authReducer.user,
});

export default connect(mapStateToProps, {})(MainScreenHeader);
