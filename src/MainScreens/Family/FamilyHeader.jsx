import React from "react";
import { View } from "react-native";
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import { mainStyles } from "../../styles/mainStyles";
import { TypographyText } from "../../components/Typography";
import { colors } from "../../components/colors";
import { BALOO_BOLD, BALOO_REGULAR } from "../../redux/types";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../components/ThemeProvider";

const FamilyHeader = ({ user }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const textColot = isDark ? colors.white : colors.darkBlue;

  return (
    <View>
      <CommonHeader label={t("Family.familyMembers")} />
      <View style={[mainStyles.centeredRow, { marginTop: 14 }]}>
        <TypographyText
          textColor={textColot}
          size={14}
          font={BALOO_REGULAR}
          title={t("CardPage.availablePoint")}
          style={[]}
        />
      </View>
      <View style={[mainStyles.centeredRow, { marginBottom: 11 }]}>
        <TypographyText
          textColor={textColot}
          size={48}
          font={BALOO_BOLD}
          title={user.available_points}
          style={{ marginTop: -10 }}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.authReducer.user,
});

export default connect(mapStateToProps, {})(FamilyHeader);
