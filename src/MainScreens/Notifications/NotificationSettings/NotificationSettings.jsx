import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, View } from "react-native";
import { colors } from "../../../components/colors";
import CommonHeader from "../../../components/CommonHeader/CommonHeader";
import { BALOO_SEMIBOLD } from "../../../redux/types";
import { TypographyText } from "../../../components/Typography";
import { useTheme } from "../../../components/ThemeProvider";
import { mainStyles } from "../../../styles/mainStyles";

import SettingsItem from "./SettingsItem";
import { connect } from "react-redux";
import {
  getNotifications,
  subscribeNotification,
} from "../../../redux/notifications/notifications-thunks";
import { setNotifications } from "../../../redux/notifications/notifications-actions";
import { useTranslation } from "react-i18next";

const NotificationSettings = ({
  notifications,
  isNotificationsSettingsLoading,
  getNotifications,
  setNotifications,
  subscribeNotification,
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  useEffect(() => {
    getNotifications();
    return () => {
      setNotifications([]);
    };
  }, []);

  return (
    <View
      style={{
        backgroundColor: isDark ? colors.darkBlue : colors.white,
        flex: 1,
      }}
    >
      <SafeAreaView>
        <CommonHeader
          isWhite={isDark}
          label={t("Notifications.notificationSettings")}
        />
        <View style={[mainStyles.p20, { marginTop: 25 }]}>
          <TypographyText
            textColor={isDark ? colors.white : colors.darkBlue}
            size={18}
            font={BALOO_SEMIBOLD}
            title={t("Notifications.allMerchants")}
            style={{ marginBottom: 25 }}
          />
        </View>
        {isNotificationsSettingsLoading && notifications.length === 0 && (
          <View style={[mainStyles.centeredRow, { marginVertical: 30 }]}>
            <ActivityIndicator size={"large"} color={colors.green} />
          </View>
        )}
        <FlatList
          data={notifications.filter((n) => n.merchant_id !== false)}
          renderItem={({ item, index }) => {
            return (
              <>
                <SettingsItem
                  icon={item.merchant_logo}
                  categoryIcon={item.merchant_category_logo}
                  merchant_id={item.merchant_id}
                  label={item.merchant_name}
                  isActive={item.is_subscribe}
                  setIsActive={() => {
                    if (!item.is_subscribe) {
                      subscribeNotification(true, item.merchant_id);
                    } else {
                      subscribeNotification(false, item.merchant_id);
                    }
                  }}
                />
                {index ===
                  notifications.filter((n) => n.merchant_id !== false).length -
                    1 && <View style={{ height: 150 }} />}
              </>
            );
          }}
          keyExtractor={(item) => item.merchant_id.toString()}
        />
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state) => ({
  notifications: state.notificationsReducer.notifications,
  isNotificationsSettingsLoading:
    state.loadersReducer.isNotificationsSettingsLoading,
});

export default connect(mapStateToProps, {
  getNotifications,
  setNotifications,
  subscribeNotification,
})(NotificationSettings);
