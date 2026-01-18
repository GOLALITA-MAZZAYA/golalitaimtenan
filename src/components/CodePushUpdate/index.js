import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import { Platform } from "react-native";
import CodePush from "react-native-code-push";
import { TypographyText } from "../Typography";
import { useTranslation } from "react-i18next";
import { useTheme } from "../ThemeProvider";
import { colors } from "../colors";
import { BALOO_MEDIUM } from "../../redux/types";
import CommonButton from "../CommonButton/CommonButton";
import RNRestart from "react-native-restart";

const IOS_PRODUCTION_KEY = "YM0xSEUc2VL0nNNJVQyUkGrnH4S82KSNRJ8MA";
const ANDROID_PRODUCTION_KEY = "IKSj9MKfJmF3drkL65iCd2110J-qvOhf8EWU5";

const CodePushUpdate = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isUpdateInstalled, setIsUpdateInstalled] = useState(false);

  const { t } = useTranslation();
  const { isDark } = useTheme();

  const checkForUpdate = async () => {
    try {
      const update = await CodePush.checkForUpdate();
      console.log(update, "update");
      if (update) {
        setIsUpdateAvailable(true);
      }
    } catch (error) {
      if (isUpdateAvailable) {
        setIsUpdateAvailable(false);
      }
      //   setIsUpdateLoading(false);
      console.error("CodePush update error:", error);
    }
  };

  const update = async () => {
    try {
      setIsUpdateLoading(true);

      const res = await CodePush.sync(
        {
          deploymentKey:
            Platform.OS === "ios" ? IOS_PRODUCTION_KEY : ANDROID_PRODUCTION_KEY,
          updateDialog: false,
          installMode: CodePush.InstallMode.ON_NEXT_RESTART,
        },
        (syncStatus) => {
          switch (syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
              console.log("checking");
              break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
              console.log("downloading");
              break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
              console.log("installing");
              break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
              console.log("installed");
              setIsUpdateInstalled(true);
              break;
          }
        }
      );

      if (res === 0) {
        setIsUpdateAvailable(false);
      }
    } catch (err) {
      setIsUpdateAvailable(false);
      console.log(err, "err");
    } finally {
    }
  };

  const restart = () => {
    RNRestart.restart?.() || RNRestart.Restart?.();
  };

  useEffect(() => {
    checkForUpdate();
  }, []);

  const updateInfoText = t("CodePush.updateInfo");
  const downloadText = t("CodePush.download");
  const restartInfoText = t("CodePush.restartInfo");
  const restartText = t("CodePush.restart");

  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        {!isUpdateLoading && !isUpdateInstalled && (
          <TypographyText
            title={updateInfoText}
            textColor={isDark ? colors.white : colors.darkBlue}
            size={18}
            font={BALOO_MEDIUM}
          />
        )}
        {isUpdateLoading && !isUpdateInstalled && <ActivityIndicator />}

        {!isUpdateLoading && !isUpdateInstalled && (
          <CommonButton
            label={downloadText}
            onPress={update}
            style={styles.btn}
            wrapperStyle={styles.btnWrapper}
            textStyle={{ color: "#fff" }}
          />
        )}

        {isUpdateInstalled && (
          <TypographyText
            title={restartInfoText}
            textColor={isDark ? colors.white : colors.darkBlue}
            size={18}
            font={BALOO_MEDIUM}
          />
        )}

        {isUpdateInstalled && (
          <CommonButton
            label={restartText}
            onPress={restart}
            style={styles.btn}
            wrapperStyle={styles.btnWrapper}
            textStyle={{ color: "#fff" }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 2000,
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    width: 260,
    height: 160,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
  },
  textStyle: {},
  btnWrapper: {
    backgroundColor: "#00A3FF",
    marginHorizontal: 20,
    borderWidth: 0,
    marginTop: 25,
  },
  btn: {
    marginTop: 20,
  },
});

export default CodePushUpdate;
