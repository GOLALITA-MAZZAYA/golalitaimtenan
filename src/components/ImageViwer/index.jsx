import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { SCREEN_HEIGHT } from "../../styles/mainStyles";
import CloseSvg from "../../assets/close_white.svg";
import { colors } from "../colors";
import { useTheme } from "../ThemeProvider";

const ImageViwerModal = ({ images, children }) => {
  const [isFullImage, setIsFullImage] = useState(false);
  const { isDark } = useTheme();

  const renderHeader = () => (
    <View style={styles.closeWrapper}>
      <TouchableOpacity onPress={() => setIsFullImage(false)}>
        <CloseSvg />
      </TouchableOpacity>
    </View>
  );

  const loadingRender = () => (
    <ActivityIndicator
      size={"large"}
      color={isDark ? colors.mainDarkMode : colors.darkBlue}
    />
  );

  return (
    <>
      <Modal visible={isFullImage} transparent={true}>
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
          index={0}
          renderHeader={renderHeader}
          onSwipeDown={() => setIsFullImage(false)}
          enableSwipeDown={true}
          imageUrls={images}
          loadingRender={loadingRender}
          renderIndicator={(currentIndex, allSize) => null}
        />
      </Modal>

      {children?.(setIsFullImage)}
    </>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    marginTop: (SCREEN_HEIGHT / 100) * 22,
  },
  closeWrapper: {
    justifyContent: "space-between",
    top: 50,
    right: 20,
    position: "absolute",
    zIndex: 100,
    width: "90%",
  },
});

export default ImageViwerModal;
