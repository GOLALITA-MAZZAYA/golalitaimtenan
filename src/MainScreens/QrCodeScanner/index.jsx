import React, { useRef, useState } from "react";
import MainLayout from "../../components/MainLayout";
import { colors } from "../../components/colors";
import { SCREEN_HEIGHT } from "../../styles/mainStyles";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../components/ThemeProvider";
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import { default as QRCodeScannerComponent } from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import { useRoute } from "@react-navigation/native";
import { TypographyText } from "../../components/Typography";
import { BALOO_SEMIBOLD } from "../../redux/types";
import { showMessage } from "react-native-flash-message";
import { useTranslation } from "react-i18next";

const checkIsLink = (data) => {
  if (typeof data !== "string") {
    return false;
  }

  if (!data.startsWith("http") && !data.startsWith("https")) {
    return false;
  }

  return true;
};

const QrCodeScanner = () => {
  const { isDark } = useTheme();
  const route = useRoute();
  const { title } = route.params;
  const scannerRef = useRef(null);
  const [scanData, setScanData] = useState(null);
  const { t } = useTranslation();

  const handleRead = (scanData) => {
    if (!checkIsLink(scanData?.data)) {
      showMessage({
        message: t("General.qrCodeWarning"),
        type: "warning",
      });

      scannerRef.current.reactivate();

      return;
    }

    setScanData(scanData);
  };

  const handeleOpenLink = () => {
    if (checkIsLink(scanData.data)) {
      Linking.openURL(scanData.data);
      return;
    }
  };

  const handleCancel = () => {
    setScanData(null);

    scannerRef.current.reactivate();
  };

  return (
    <MainLayout
      outsideScroll={true}
      headerChildren={<CommonHeader label={title} />}
      headerHeight={50}
      contentStyle={styles.contentStyle}
      style={{ backgroundColor: isDark ? colors.darkBlue : colors.white }}
    >
      <QRCodeScannerComponent
        ref={scannerRef}
        onRead={handleRead}
        contentStyle={styles.content}
        topViewStyle={{
          height: 0,
        }}
        markerStyle={{ height: 0 }}
        cameraStyle={styles.fullSpace}
        bottomViewStyle={styles.bottomView}
        bottomContent={
          scanData && (
            <View style={styles.btnsWrappper}>
              <TouchableOpacity
                onPress={handleCancel}
                style={[styles.btnWrapper, styles.cancelBtn]}
              >
                <TypographyText
                  title={t("General.cancel")}
                  textColor={colors.white}
                  size={12}
                  font={BALOO_SEMIBOLD}
                  style={{}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handeleOpenLink}
                style={[styles.btnWrapper, styles.linkBtn]}
              >
                <TypographyText
                  title={t("General.openLink")}
                  textColor={colors.white}
                  size={12}
                  font={BALOO_SEMIBOLD}
                  style={{}}
                />
              </TouchableOpacity>
            </View>
          )
        }
      />
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  fullSpace: {
    height: SCREEN_HEIGHT - 50,
  },
  contentStyle: {
    height: SCREEN_HEIGHT,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },
  btnsWrappper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  btnWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.darkBlue,
  },
  linkBtn: {
    marginLeft: 15,
  },
  cancelBtn: {
    marginRight: 15,
  },
  bottomView: {
    position: "absolute",
    flexDirection: "row",
    width: "100%",
    bottom: 150,
  },
  content: {
    height: SCREEN_HEIGHT,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },
});

export default QrCodeScanner;
