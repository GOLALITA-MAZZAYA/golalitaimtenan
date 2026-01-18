import React, { useState } from "react";
import { TouchableOpacity, View, Animated } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { mainStyles } from "../../styles/mainStyles";
import GreenNotificationSvg from "../../assets/green_notification.svg";
import NotificationSvg from "../../assets/notification.svg";
import { sized } from "../../Svg";
import { colors } from "../../components/colors";
import { BALOO_REGULAR, BALOO_SEMIBOLD } from "../../redux/types";
import { TypographyText } from "../../components/Typography";
import DeleteSvg from "../../assets/delete.svg";
import styles from "./styles";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "../../components/ThemeProvider";
import DeleteWhiteSvg from "../../assets/delete_white.svg";
import { getFlexDirection } from "../../../utils";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { deleteNotification } from "../../redux/notifications/notifications-thunks";
import { getMerchantDetails } from "../../redux/merchant/merchant-thunks";
import { getNotificationDescription } from "./helpers";

const DeleteIcon = sized(DeleteSvg, 70, 24);
const DeleteWhiteIcon = sized(DeleteWhiteSvg, 70, 24);

const Notification = ({
  notification,
  deleteNotification,
  setPressedNotification,
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const iconColor = isDark ? colors.white : colors.grey;
  const NotificationIcon = sized(NotificationSvg, 17, 20, iconColor);
  const GreenNotificationIcon = sized(GreenNotificationSvg, 17, 20);

  const deleteButton = (progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });
    return (
      <Animated.View style={{ width: 100, transform: [{ translateX: trans }] }}>
        <LinearGradient
          colors={
            isDark
              ? [colors.green, colors.lightGreen]
              : [colors.darkBlue, colors.darkBlue]
          }
          style={styles.deleteButton}
        >
          <TouchableOpacity
            onPress={() =>
              deleteNotification({
                notification_id: notification.notification_id,
              })
            }
            activeOpacity={0.3}
            style={{ width: "100%", height: "100%", ...mainStyles.centeredRow }}
          >
            {isDark ? <DeleteWhiteIcon /> : <DeleteIcon />}
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  };
  const getTitle = (type, partner_name) => {
    switch (type) {
      case "sale_reward":
        return t("Notifications.rewardPoint");
      case "transfer":
        return t("Notifications.transfer");
      case "offer":
        return `${t("Notifications.offerFrom")} ${partner_name}`;
      case "sale_redeem":
        return t("Notifications.saleRedeem");
      case "product":
        return t("Notifications.product");
      default:
        return "";
    }
  };

  const { descriptionText } = getNotificationDescription(notification);

  return (
    <Swipeable rightThreshold={40} renderRightActions={deleteButton}>
      <TouchableOpacity
        onPress={() => setPressedNotification(notification)}
        style={[
          styles.notification,
          isDark && { borderBottomColor: colors.secBlue },
          getFlexDirection(),
          styles.fullWidth,
        ]}
      >
        <View style={[mainStyles.row, getFlexDirection(), styles.fullWidth]}>
          {notification.state === "unread" ? (
            <GreenNotificationIcon />
          ) : (
            <NotificationIcon />
          )}
          <View style={styles.descriptionWrapper}>
            <TypographyText
              textColor={isDark ? colors.white : colors.black}
              size={14}
              font={BALOO_SEMIBOLD}
              title={getTitle(
                notification.notification_type,
                notification.merchant_name
              )}
              numberOfLines={2}
            />
            <TypographyText
              textColor={colors.grey}
              size={14}
              font={BALOO_REGULAR}
              title={descriptionText}
              numberOfLines={2}
              style={{ lineHeight: 20 }}
            />
          </View>
        </View>
        <View style={styles.dateWrapper}>
          <TypographyText
            textColor={colors.grey}
            size={12}
            font={BALOO_REGULAR}
            title={notification.date}
            numberOfLines={2}
            style={styles.date}
          />
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default connect(null, { deleteNotification, getMerchantDetails })(
  Notification
);
