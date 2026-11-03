import React, { useEffect, useState } from "react";
import {
  Image as RNImage,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Modal,
  ActivityIndicator,
} from "react-native";
import Image from "../../../components/AppImage";

import { sized } from "../../../Svg";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { SCREEN_HEIGHT, mainStyles } from "../../../styles/mainStyles";
import { colors } from "../../../components/colors";
import { useTheme } from "../../../components/ThemeProvider";
import CommonButton from "../../../components/CommonButton/CommonButton";
import ImageViewer from "react-native-image-zoom-viewer";
import { connect } from "react-redux";
import HTMLRenderer from "../../../components/HTMLRenderer";
import CloseSvg from "../../../assets/close.svg";
import { getMerchantDetails } from "../../../redux/merchant/merchant-thunks";
import { getNotificationDescription } from "../helpers";

const CloseIcon = sized(CloseSvg, 14, 14, "white");

const NotificationsModal = ({
  notification,
  isSingle,
  getMerchantDetails,
  setIsNotificationModal,
  setPressedNotification,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const [fullImage, setFullImage] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState(16 / 9);

  const { descriptionHtml } = getNotificationDescription(notification);

  useEffect(() => {
    if (!notification.offer_image) return;

    RNImage.getSize(
      notification.offer_image,
      (width, height) => setImageAspectRatio(width / height),
      () => {}
    );
  }, [notification.offer_image]);

  return (
    <View
      style={[
        mainStyles.notificationModal,
        { backgroundColor: isDark ? colors.borderGrey : colors.white },
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          setPressedNotification(null);
        }}
        style={[
          mainStyles.notificationModal__close,
          { backgroundColor: isDark ? colors.navyBlue : colors.white },
        ]}
      >
        <CloseIcon color={isDark ? colors.white : colors.darkBlue} />
      </TouchableOpacity>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View activeOpacity={1} style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              setFullImage(notification.offer_image);
            }}
            style={{
              paddingHorizontal: 16,
              marginTop: 16,
            }}
          >
            <Image
              source={{ uri: notification.offer_image }}
              style={[
                mainStyles.notificationModal__image,
                { aspectRatio: imageAspectRatio },
              ]}
              contentFit="contain"
            />
          </TouchableOpacity>
          <HTMLRenderer
            style={{ paddingHorizontal: 16, marginTop: 16 }}
            value={descriptionHtml}
            color={isDark ? colors.white : "black"}
          />

          <View
            style={[
              mainStyles.centeredRow,
              { flexDirection: "column", marginBottom: 20 },
            ]}
          >
            <CommonButton
              label={t("MainScreen.readMore")}
              style={mainStyles.notificationModal__button}
              onPress={() => {
                if (notification.url_notification) {
                  Linking.openURL(notification.url_notification);
                } else {
                  getMerchantDetails(notification.merchant_id, navigation, t);
                }
              }}
            />
            {!isSingle && (
              <View style={mainStyles.centeredRow}>
                <CommonButton
                  label={t("MainScreen.seeNotifications")}
                  style={[
                    mainStyles.notificationModal__button,
                    { marginVertical: 10, width: "70%" },
                  ]}
                  onPress={() => {
                    setIsNotificationModal(null);
                    navigation.navigate("Notifications");
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <Modal visible={!!fullImage} transparent={true}>
        <ImageViewer
          supportedOrientations={[
            "portrait",
            "portrait-upside-down",
            "landscape",
            "landscape-left",
            "landscape-right",
          ]}
          saveToLocalByLongPress={false}
          index={0}
          renderImage={({ source, style }) => {
            return (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingVertical: 10,
                }}
              >
                <Image
                  source={{
                    uri: source.uri,
                  }}
                  style={[
                    {
                      width: "100%",
                      height: "100%",
                      marginTop: (SCREEN_HEIGHT / 100) * 22,
                    },
                    style,
                  ]} // your custom style object
                  contentFit="contain"
                // any supported props by Image
                />
              </View>
            );
          }}
          renderHeader={(props) => {
            return (
              <View
                style={[
                  mainStyles.row,
                  {
                    justifyContent: "space-between",
                    top: 50,
                    left: 20,
                    position: "absolute",
                    zIndex: 100,
                    width: "90%",
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => setFullImage(false)}
                  style={mainStyles.modal__close}
                >
                  <CloseIcon />
                </TouchableOpacity>
              </View>
            );
          }}
          onSwipeDown={() => setFullImage(false)}
          enableSwipeDown={true}
          imageUrls={[{ url: fullImage }]}
          loadingRender={() => (
            <ActivityIndicator size={"large"} color={colors.green} />
          )}
          renderIndicator={() => null}
        />
      </Modal>
    </View>
  );
};

export default connect(null, {
  getMerchantDetails,
})(NotificationsModal);
