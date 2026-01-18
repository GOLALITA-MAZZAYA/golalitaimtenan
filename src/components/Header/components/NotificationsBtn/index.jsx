import { StyleSheet, TouchableOpacity } from "react-native";
import { TypographyText } from "../../../Typography";
import { LUSAIL_REGULAR } from "../../../../redux/types";
import NotificationSvg from "../../../../assets/notification.svg";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "../../../ThemeProvider";
import { colors } from "../../../colors";
import { useNavigation } from "@react-navigation/native";

const NotificationsBtn = () => {
  const messageNotifications = useSelector(
    (state) => state.notificationsReducer.messageNotifications
  );
  const { isDark } = useTheme();
  const navigation = useNavigation();

  const isNotifications =
    !!messageNotifications &&
    !!messageNotifications?.filter((m) => m.state === "unread")?.length;

  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={() => {
        navigation.navigate("Notifications");
      }}
    >
      <View style={styles.iconWrapper}>
        <NotificationSvg
          color={
            isNotifications
              ? colors.mainDarkMode
              : isDark
              ? colors.white
              : "#999CAD"
          }
          height={20}
          width={20}
        />
        {isNotifications && (
          <View style={styles.countWrapper}>
            <TypographyText
              textColor={colors.white}
              size={7}
              font={LUSAIL_REGULAR}
              title={
                messageNotifications?.filter((m) => m.state === "unread")
                  ?.length
              }
              style={styles.text}
              numberOfLines={1}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  text: {
    fontWeight: "700",
  },
  countWrapper: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FA634D",
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NotificationsBtn;
