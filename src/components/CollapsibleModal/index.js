import { StyleSheet, View, Dimensions, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Modal from "react-native-modal";

const { height, width } = Dimensions.get("screen");

const CollapsibleModal = (props) => {
  const { onCloseModal, visible, children, style } = props;

  return (
    <View style={styles.container}>
      <Modal
        isVisible={visible}
        style={styles.bottomModal}
        animationInTiming={1000}
        animationOutTiming={1000}
        onBackdropPress={onCloseModal}
      >
        <View style={[styles.content, style]}>
          <View style={styles.toggleBtnWrapper}>
            <TouchableOpacity
              style={styles.toggleLine}
              hitSlop={20}
              onPress={onCloseModal}
            ></TouchableOpacity>
          </View>
          <ScrollView style={{ width: width, paddingHorizontal: 20 }}>
            {children}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height * 0.7,
    width: width,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  toggleLine: {
    width: 100,
    height: 4,
    backgroundColor: "#DDDFE4",
    borderRadius: 4,
  },
  toggleBtnWrapper: {
    marginBottom: 25,
    marginTop: 16,
  },
});

export default CollapsibleModal;
