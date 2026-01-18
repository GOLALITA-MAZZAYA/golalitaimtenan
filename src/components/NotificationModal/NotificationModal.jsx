import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { colors } from "../colors";
import { getMerchantDetails } from "../../redux/merchant/merchant-thunks";
import CloseSvg from "../../assets/close.svg";
import { sized } from "../../Svg";
import { setIsNotificationModal } from "../../redux/notifications/notifications-actions";
import { ActivityIndicator } from "react-native";
import { getMessageNotifications } from "../../redux/notifications/notifications-thunks";
import NotificationItem from "./NotificationItem";
import { BALOO_MEDIUM } from "../../redux/types";
import { TypographyText } from "../Typography";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useRef } from "react";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import Portal from "../Portal";
import { useTheme } from "../ThemeProvider";

const CloseIcon = sized(CloseSvg, 14);

const NotificationModal = ({
  messageNotifications,
  setIsNotificationModal,
  getMessageNotifications,
  isVisible,
  isMerchantDetails,
  isMerchantDetailsLoading,
}) => {
  const { t } = useTranslation();
  const bottomSheetModalRef = useRef(null);
  const { isDark } = useTheme();

  const isModalShowed = useRef(null);

  const notifications = messageNotifications.filter(
    (d) => d.imp_notification === true
  );

  const isVisibleVar =
    isVisible &&
    notifications?.length > 0 &&
    !isMerchantDetailsLoading &&
    !isMerchantDetails;

  useEffect(() => {
    if (!messageNotifications?.length) {
      getMessageNotifications();
    }
  }, []);

  const handleClosePress = () => {
    setIsNotificationModal(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isVisibleVar) {
        isModalShowed.current = true;
        bottomSheetModalRef.current?.present();
      }
    }, 1500);

    return () => clearTimeout(timer); // Cleanup timer on unmount or dependency change
  }, [isVisibleVar]);

  useEffect(() => {
    if (!isVisibleVar && !!isModalShowed.current) {
      bottomSheetModalRef?.current?.close();
    }
  }, [isVisibleVar]);

  // variables
  const snapPoints = useMemo(() => ["75%"], []);

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <Portal name="home-notifications-modal">
      <BottomSheetModalProvider key="home-notifications-modal">
        <View style={styles.container}>
          <BottomSheetModal
            key="home-notifications-modal"
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backgroundStyle={{
              backgroundColor: isDark ? colors.navyBlue : colors.white,
            }}
            enableHandlePanningGesture={true}
            enableContentPanningGesture={true}
          >
            <View style={styles.header}>
              <TypographyText
                title={t("Notifications.newOffers")}
                size={18}
                font={BALOO_MEDIUM}
                style={styles.title}
                textColor={isDark ? colors.white : colors.darkBlue}
              />

              <TouchableOpacity
                onPress={handleClosePress}
                style={styles.notificationModal__close}
              >
                <CloseIcon color={isDark ? colors.white : colors.darkBlue} />
              </TouchableOpacity>
            </View>

            <BottomSheetFlatList
              showsVerticalScrollIndicator={false}
              data={notifications}
              contentContainerStyle={styles.contentContainerStyle}
              renderItem={({ item }) => <NotificationItem item={item} />}
              ListEmptyComponent={() => {
                return <ActivityIndicator />;
              }}
            />
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  contentContainer: {
    flexGrow: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 60,
  },
  notificationModal__close: {},
});

const mapStateToProps = (state) => ({
  messageNotifications: state.notificationsReducer.messageNotifications,
  isMerchantDetails: !!state.merchantReducer.merchantDetails,
  isMerchantDetailsLoading: state.merchantReducer.merchantDetailsLoading,
  messageNotificationsLoading:
    state.notificationsReducer.messageNotificationsLoading,
  isVisible: state.notificationsReducer.isNotificationModal,
});

export default connect(mapStateToProps, {
  getMerchantDetails,
  setIsNotificationModal,
  getMessageNotifications,
})(NotificationModal);
