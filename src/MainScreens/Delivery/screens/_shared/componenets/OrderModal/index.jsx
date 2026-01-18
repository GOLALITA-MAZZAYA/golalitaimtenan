import { useTranslation } from "react-i18next";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { ORDER_STATUSES_CONFIG } from "../../../OrderHistoryList/config";
import { BALOO_MEDIUM, BALOO_REGULAR } from "../../../../../../redux/types";
import { colors } from "../../../../../../components/colors";
import CloseSvg from "../../../../../../assets/close.svg";

const OrderModal = ({ onClose, orderStatus }) => {
  const { t } = useTranslation();

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={!!orderStatus}
      onRequestClose={() => {
        onClose();
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.buttonClose}
            onPress={() => onClose()}
          >
            <CloseSvg
              color={colors.darkBlue}
              style={{ alignSelf: "flex-end" }}
              height={16}
              width={16}
            />
          </TouchableOpacity>
          <View style={styles.statusWrapper}>
            <Text style={styles.text}>{`${t(
              "OrderHistoryList.status"
            )}:`}</Text>
            <Text
              style={[
                styles.text,
                { color: ORDER_STATUSES_CONFIG?.[orderStatus]?.color },
              ]}
            >
              {t(ORDER_STATUSES_CONFIG?.[orderStatus]?.translation)}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalView: {
    width: 250,
    backgroundColor: "white",
    borderRadius: 6,
    padding: 16,
  },
  buttonClose: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  statusWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  text: {
    fontFamily: BALOO_MEDIUM,
  },
});

export default OrderModal;
