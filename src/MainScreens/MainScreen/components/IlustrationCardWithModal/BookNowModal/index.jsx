import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import CommonButton from "../../../../../components/CommonButton/CommonButton";
import { TypographyText } from "../../../../../components/Typography";
import { colors } from "../../../../../components/colors";
import { BALOO_REGULAR, BALOO_SEMIBOLD } from "../../../../../redux/types";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Clipboard from "@react-native-clipboard/clipboard";
import { showMessage } from "react-native-flash-message";
import { TouchableOpacity } from "react-native-gesture-handler";

const BookNowModal = ({ visible, setModalVisible, config }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const copyUserName = () => {
    Clipboard.setString(config.userName);

    showMessage({
      message: t("General.copied"),
      type: "success",
    });
  };

  const copyPassword = () => {
    Clipboard.setString(config.password);

    showMessage({
      message: t("General.copied"),
      type: "success",
    });
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        presentationStyle="overFullScreen"
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TypographyText
              textColor={colors.black}
              size={22}
              font={BALOO_SEMIBOLD}
              title={t("MainScreen.ktsLoginInfo")}
            />

            <View style={[styles.credentialsWrapper, { marginTop: 20 }]}>
              <TypographyText
                textColor={colors.black}
                size={16}
                font={BALOO_REGULAR}
                title={`${t("MainScreen.ktsLogin")}: ${config.userName}`}
                style={styles.description}
              />
              <TouchableOpacity onPress={copyUserName} style={styles.copyBtn}>
                <TypographyText
                  textColor={colors.black}
                  size={14}
                  font={BALOO_REGULAR}
                  title={t("General.copy")}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.credentialsWrapper}>
              <TypographyText
                textColor={colors.black}
                size={16}
                font={BALOO_REGULAR}
                title={`${t("MainScreen.ktsPassword")}: ${config.password}`}
                style={styles.description}
              />
              <TouchableOpacity onPress={copyPassword} style={styles.copyBtn}>
                <TypographyText
                  textColor={colors.black}
                  size={14}
                  font={BALOO_REGULAR}
                  title={t("General.copy")}
                />
              </TouchableOpacity>
            </View>

            <CommonButton
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Website", {
                  title: config.title,
                  url: config.url,
                });
              }}
              label={t("MainScreen.ktsLinkBtn")}
              style={styles.redirectBtn}
            />

            <CommonButton
              onPress={() => setModalVisible(false)}
              label={t("MainScreen.ktsClose")}
              style={styles.redirectBtn}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  redirectBtn: {
    marginTop: 20,
  },
  credentialsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  copyBtn: {
    marginLeft: 16,
  },
});

export default BookNowModal;
