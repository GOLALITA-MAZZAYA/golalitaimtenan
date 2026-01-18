import {StyleSheet, TouchableOpacity} from "react-native"
import {sized} from "../../../../../Svg";
import {useDispatch} from "react-redux";
import {subscribeNotification} from "../../../../../redux/notifications/notifications-thunks";
import {useTranslation} from "react-i18next";
import {colors} from "../../../../../components/colors";
import {useTheme} from "../../../../../components/ThemeProvider";
import NotificationSvg from '../../../../../assets/notification_yellow.svg';
import NotificationDisabledSvg from '../../../../../assets/notification.svg';

const NotificationIcon = ({isSubscribe, merchantId}) => {
    const {isDark} = useTheme();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const NotificationIcon = sized(NotificationSvg, 17, 20, '#fff');
    const NotificationDisabledIcon = sized(NotificationDisabledSvg, 17, 17, '#fff');

    return (
          <TouchableOpacity
                onPress={() =>
                  dispatch(subscribeNotification(
                    !isSubscribe,
                     merchantId,
                    t,
                  ))
                }
                style={[
                  styles.notificationIcon,
                  {
                    borderWidth: 1.5,
                    borderColor: isDark ? colors.mainDarkMode : colors.darkBlue,
                    backgroundColor: null,
                  },
                ]}
              >
                {isSubscribe ? (
                  <NotificationIcon
                    color={isDark ? colors.mainDarkMode : colors.darkBlue}
                  />
                ) : (
                  <NotificationDisabledIcon
                    color={isDark ? colors.mainDarkMode : colors.darkBlue}
                  />
                )}
              </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
  notificationIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DDDFE4",
    borderRadius: 50,
  }
});

export default NotificationIcon