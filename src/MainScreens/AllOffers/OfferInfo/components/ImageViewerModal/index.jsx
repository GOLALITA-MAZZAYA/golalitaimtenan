import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { colors } from "../../../../../components/colors";
import { TypographyText } from "../../../../../components/Typography";
import {
  mainStyles,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../../../../styles/mainStyles";
import { BALOO_REGULAR } from "../../../../../redux/types";
import CloseSvg from "../../../../../assets/close_white.svg";
import { sized } from "../../../../../Svg";

const CloseIcon = sized(CloseSvg, 24);

const ImageViewerModal = ({ onClose, isVisible, data, initialIndex = 0 }) => {
  return (
    <Modal visible={isVisible} transparent={true}>
      <ImageViewer
        supportedOrientations={[
          "portrait",
          "portrait-upside-down",
          "landscape",
          "landscape-left",
          "landscape-right",
        ]}
        pageAnimateTime={100}
        saveToLocalByLongPress={false}
        index={initialIndex}
        renderImage={({ source, style }) => (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: source.uri }}
              style={[styles.image, style]}
              resizeMode="contain"
            />
          </View>
        )}
        renderHeader={() => (
          <View style={[mainStyles.row, styles.closeIconWrapper]}>
            <TouchableOpacity onPress={() => onClose(false)}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
        )}
        onSwipeDown={() => onClose(false)}
        enableSwipeDown={true}
        imageUrls={data}
        loadingRender={() => (
          <ActivityIndicator size="large" color={colors.darkBlue} />
        )}
        renderIndicator={(currentIndex, allSize) => (
          <View style={styles.imagesIndicator}>
            <TypographyText
              textColor={colors.white}
              size={16}
              font={BALOO_REGULAR}
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
    right: 20,
    position: "absolute",
    zIndex: 100,
    width: SCREEN_WIDTH,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  image: {
    width: "100%",
    height: "100%",
    marginTop: (SCREEN_HEIGHT / 100) * 22,
  },
  imagesIndicator: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
  },
});

export default ImageViewerModal;
