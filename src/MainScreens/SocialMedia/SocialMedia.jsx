import React, { useCallback } from "react";
import {
  ImageBackground,
  Linking,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  mainStyles,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../styles/mainStyles";
import { styles } from "./styles";
import BackSvg from "../../assets/back_white.svg";
import { sized } from "../../Svg";
import { colors } from "../../components/colors";
import { BALOO_REGULAR, BALOO_SEMIBOLD } from "../../redux/types";
import { TypographyText } from "../../components/Typography";
import NotificationSvg from "../../assets/notification_white.svg";
import LinkedinSvg from "../../assets/linkedin.svg";
import InstagramSvg from "../../assets/instagram.svg";
import FacebookSvg from "../../assets/facebook.svg";
import TwitterSvg from "../../assets/twitter.svg";
import { getFlexDirection, isRTL } from "../../../utils";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const LinkedinIcon = sized(LinkedinSvg, 48);
const InstagramIcon = sized(InstagramSvg, 48);
const FacebookIcon = sized(FacebookSvg, 48);
const TwitterIcon = sized(TwitterSvg, 48);

const SocialMedia = ({ navigation, socialMedia }) => {
  const { t } = useTranslation();

  const toNotifications = useCallback(() => {
    navigation.navigate("Notifications");
  }, []);

  const BackIcon = sized(BackSvg, 24, 24, colors.white);
  const NotificationIcon = sized(NotificationSvg, 24, 24, colors.white);

  return (
    <ImageBackground
      style={styles.container}
      source={require("../../assets/social_bg.png")}
    >
      <SafeAreaView style={styles.container__inner}>
        <View
          style={[mainStyles.betweenRow, getFlexDirection(), mainStyles.p20]}
        >
          <TouchableOpacity
            style={{ transform: [{ rotate: isRTL() ? "180deg" : "0deg" }] }}
            onPress={navigation.goBack}
          >
            <BackIcon />
          </TouchableOpacity>
          <TypographyText
            textColor={colors.white}
            size={18}
            font={BALOO_SEMIBOLD}
            title={t("Drawer.followSocial")}
          />
          <TouchableOpacity onPress={toNotifications}>
            <NotificationIcon />
          </TouchableOpacity>
        </View>
        <View>
          <TypographyText
            textColor={colors.white}
            size={48}
            font={BALOO_SEMIBOLD}
            title={t("Drawer.weAreSocial")}
            style={mainStyles.centeredText}
          />
          <TypographyText
            textColor={colors.white}
            size={18}
            font={BALOO_SEMIBOLD}
            title={t("Drawer.socialUndertitle")}
            style={mainStyles.centeredText}
          />
        </View>
        <TypographyText
          textColor={colors.white}
          size={14}
          font={BALOO_REGULAR}
          title={t("Drawer.socialDescription")}
          style={[mainStyles.centeredText, mainStyles.p20]}
        />
        <View
          style={[mainStyles.betweenRow, getFlexDirection(), mainStyles.p20]}
        >
          <TouchableOpacity
            onPress={() => {
              if (socialMedia?.social_linkedin)
                Linking.openURL(socialMedia.social_linkedin);
            }}
          >
            <LinkedinIcon />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (socialMedia?.social_instagram)
                Linking.openURL(socialMedia.social_instagram);
            }}
          >
            <InstagramIcon />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (socialMedia?.social_facebook)
                Linking.openURL(socialMedia.social_facebook);
            }}
          >
            <FacebookIcon />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (socialMedia?.social_twitter)
                Linking.openURL(socialMedia.social_twitter);
            }}
          >
            <TwitterIcon />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const mapStateToProps = (state) => ({
  socialMedia: state.merchantReducer.socialMedia,
});

export default connect(mapStateToProps, {})(SocialMedia);
