import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import Notification from "./Notification";
import { useTheme } from "../../components/ThemeProvider";
import { colors } from "../../components/colors";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  getMessageNotifications,
  readAllNotifications,
} from "../../redux/notifications/notifications-thunks";
import { SCREEN_HEIGHT, mainStyles } from "../../styles/mainStyles";
import { TypographyText } from "../../components/Typography";
import { BALOO_SEMIBOLD } from "../../redux/types";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import MainLayout from "../../components/MainLayout";
import NotificationsModal from "./NotificationsModal";

const Notifications = ({
  messageNotifications,
  readAllNotifications,
  getMessageNotifications,
  messageNotificationsLoading,
}) => {
  const [pressedNotification, setPressedNotification] = useState(null);
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    readAllNotifications();
    return () => {
      getMessageNotifications();
    };
  }, []);

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={
        <CommonHeader
          isWhite={isDark}
          label={t("Notifications.notifications")}
        />
      }
      headerHeight={50}
      contentStyle={{ height: SCREEN_HEIGHT - 120 }}
    >
      {pressedNotification && (
        <View
          style={[
            mainStyles.overlay,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          <NotificationsModal
            notification={pressedNotification}
            isSingle={true}
            setPressedNotification={setPressedNotification}
            setIsNotificationModal={setIsVisible}
            isVisible={isVisible}
          />
        </View>
      )}

      {messageNotificationsLoading && <FullScreenLoader />}

      {!messageNotificationsLoading && (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
          data={messageNotifications}
          renderItem={({ item, index }) => (
            <Notification
              key={index}
              notification={item}
              setPressedNotification={setPressedNotification}
            />
          )}
          ListEmptyComponent={() => (
            <View style={styles.noData}>
              <TypographyText
                title={t("General.noData")}
                textColor={colors.darkBlue}
                size={18}
                font={BALOO_SEMIBOLD}
              />
            </View>
          )}
        />
      )}
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  noData: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const mapStateToProps = (state) => ({
  messageNotifications: state.notificationsReducer.messageNotifications,
  messageNotificationsLoading:
    state.notificationsReducer.messageNotificationsLoading,
});

export default connect(mapStateToProps, {
  readAllNotifications,
  getMessageNotifications,
})(Notifications);
