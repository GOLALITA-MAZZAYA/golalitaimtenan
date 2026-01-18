import React, { useCallback, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../../components/ThemeProvider";
import { BALOO_MEDIUM } from "../../../../redux/types";
import { TypographyText } from "../../../../components/Typography";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../components/colors";
import Input from "../../../../components/Input/Input";
import CommonButton from "../../../../components/CommonButton/CommonButton";
import { sharePoints as sharePointsRequest } from "../../../../api/transactions";

const TransactionsModal = ({
  modalVisible,
  setModalVisible,
  phone,
  onSuccess,
  onError,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState(0);

  const sharePoints = useCallback(async () => {
    try {
      setLoading(true);

      const res = await sharePointsRequest(points, phone);

      if (res?.error) {
        onError(res.error);
        return;
      }

      onSuccess();
    } catch (err) {
      onError();
    } finally {
      setLoading(false);
    }
  }, [phone, points]);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <TouchableOpacity
        style={styles.centeredView}
        onPress={() => setModalVisible(false)}
      >
        <View
          style={[
            styles.modalView,
            { backgroundColor: isDark ? colors.darkBlue : colors.white },
          ]}
        >
          <TypographyText
            title={t("Transactions.howManyPoints")}
            textColor={isDark ? colors.white : colors.darkBlue}
            size={18}
            font={BALOO_MEDIUM}
            style={styles.title}
          />

          <Input
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={setPoints}
            value={points}
            maxLength={10}
          />

          <CommonButton
            label={"Apply"}
            style={styles.applyBtn}
            onPress={sharePoints}
          />

          {loading && <FullScreenLoader style={styles.loader} />}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: 300,
    height: 280,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    width: "100%",
  },
  applyBtn: {
    marginTop: 16,
  },
  title: {
    textAlign: "center",
  },
  loader: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    width: 300,
    height: 280,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 20,
  },
});

export default TransactionsModal;
