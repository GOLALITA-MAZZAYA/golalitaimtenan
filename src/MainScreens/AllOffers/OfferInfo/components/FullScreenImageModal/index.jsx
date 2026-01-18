import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Modal, View } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import {
  mainStyles,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../../../../styles/mainStyles";
import { colors } from "../../../../../components/colors";
import { TypographyText } from "../../../../../components/Typography";
import CloseSvg from "../../../../../assets/close_white.svg";
import { sized } from "../../../../../Svg";

const supportedOrientations = [
  "portrait",
  "portrait-upside-down",
  "landscape",
  "landscape-left",
  "landscape-right",
];

const CloseIcon = sized(CloseSvg, 24);

const FullScreenImageModal = ({ visible, url, onClose }) => {
  return (
    <Modal visible={visible} transparent={true}>
      <ImageViewer
        supportedOrientations={supportedOrientations}
        pageAnimateTime={100}
        saveToLocalByLongPress={false}
        index={0}
        renderImage={({ _, style }) => (
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: url,
              }}
              style={[styles.image, style]}
            />
          </View>
        )}
        renderHeader={() => {
          return (
            <View style={[mainStyles.row, styles.closeIconWrapper]}>
              <TouchableOpacity onPress={onClose}>
                <CloseIcon />
              </TouchableOpacity>
            </View>
          );
        }}
        onSwipeDown={onClose}
        enableSwipeDown={true}
        imageUrls={[
          {
            url,
            width: SCREEN_WIDTH,
            height: 232,
          },
        ]}
        loadingRender={() => (
          <ActivityIndicator size={"large"} color={colors.green} />
        )}
        renderIndicator={(currentIndex, allSize) => (
          <View style={styles.imagesIndicator}>
            <TypographyText
              textColor={colors.white}
              size={16}
              title={`${currentIndex}/${allSize}`}
            />
          </View>
        )}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 10,
  },
  closeIconWrapper: {
    top: 80,
    right: 1,
    position: "absolute",
    zIndex: 100,
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    marginTop: (SCREEN_HEIGHT / 100) * 22,
  },
});

export default FullScreenImageModal;
