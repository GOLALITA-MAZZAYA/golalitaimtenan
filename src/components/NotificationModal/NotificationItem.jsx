import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { BALOO_MEDIUM } from "../../redux/types";
import { colors } from "../colors";
import { TypographyText } from "../Typography";
import { getMerchantDetails } from "../../redux/merchant/merchant-thunks";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { navigationRef } from "../../Navigation/RootNavigation";
import { useTheme } from "../ThemeProvider";
import { readNotification } from "../../redux/notifications/notifications-thunks";
import { getNotificationDescription } from "../../MainScreens/Notifications/helpers";
import HTMLRenderer from "../HTMLRenderer";

const NotificationItem = ({ item }) => {
  const dispatch = useDispatch();
  const navigation = navigationRef;
  const { i18n,t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();

  const language = i18n.language;
  const handleItemPress = () => {
    if (item.merchant_id) {
      dispatch(getMerchantDetails(item.merchant_id, navigation, t, "Back"));
      dispatch(readNotification(item.notification_id));

      return;
    }

    if (item.url_notification) {
      Linking.openURL(item.url_notification);
    }
  };

  const { descriptionText, descriptionHtml } = getNotificationDescription(item);

  return (
    <TouchableOpacity style={styles.wrapper} onPress={handleItemPress}>
      {loading && (
        <View style={styles.loaderBlock}>
          <ActivityIndicator />
        </View>
      )}
      <TypographyText
        title={language === "ar" ? item?.merchant_name_arabic : item?.merchant_name }
        textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
        size={16}
        font={BALOO_MEDIUM}
        style={[styles.name,{alignSelf:language === "ar" ? "flex-end" :"flex-start"}]}
      />
      <Image
        source={{ uri: item.offer_image }}
        style={styles.logo}
        resizeMode="cover"
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
      {!!descriptionHtml && (
        <HTMLRenderer value={descriptionHtml} style={{ marginTop: 10 ,alignSelf:language === "ar" ? "flex-end" :"flex-start"}} />
      )}

      {!descriptionHtml && descriptionText && (
        <TypographyText
          title={descriptionText}
          textColor={isDark ? colors.white : colors.darkBlue}
          size={14}
          font={BALOO_MEDIUM}
          style={styles.description}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    // height: 150,
    borderRadius: 8,
    aspectRatio: 135 / 76,
    marginBottom: 10,
  },
  wrapper: {
    width: "100%",
    marginBottom: 25,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  description: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
  loaderBlock: {
    position: "absolute",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NotificationItem;
