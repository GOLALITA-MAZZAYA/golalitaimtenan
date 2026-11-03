import {ActivityIndicator, Modal, StyleSheet, TouchableOpacity, View} from "react-native";
import Image from "../../../../../components/AppImage";
import ImageViewer from "react-native-image-zoom-viewer";
import {colors} from "../../../../../components/colors";
import {TypographyText} from "../../../../../components/Typography";
import {mainStyles, SCREEN_HEIGHT, SCREEN_WIDTH} from "../../../../../styles/mainStyles";
import {BALOO_REGULAR} from "../../../../../redux/types";
import CloseSvg from '../../../../../assets/close_white.svg';
import {sized} from "../../../../../Svg";

const ImageViewerModal = ({ onClose, isVisible, data, initialIndex = 0}) => {

  const CloseIcon = sized(CloseSvg, 24);

    return (

    <Modal visible={isVisible} transparent={true}>
          <ImageViewer
            supportedOrientations={[
              'portrait',
              'portrait-upside-down',
              'landscape',
              'landscape-left',
              'landscape-right',
            ]}
            pageAnimateTime={100}
            saveToLocalByLongPress={false}
            index={initialIndex}
            renderImage={({ source, style }) => {
              return (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingVertical: 10,
                  }}
                >
                  <Image
                    source={{
                      uri: source.uri 
                    }}
                    style={[
                      {
                        width: '100%',
                        height: '100%',
                        marginTop: (SCREEN_HEIGHT / 100) * 22,
                      },
                      style,
                    ]} // your custom style object
                    contentFit="contain"
                    // any supported props by Image
                  />
                </View>
              );
            }}
            renderHeader={props => {
              return (
                <View
                  style={[
                    mainStyles.row,
                    {
                      justifyContent: 'flex-end',
                      top: 80,
                      right: 20,
                      position: 'absolute',
                      zIndex: 100,
                      width: SCREEN_WIDTH,
                      
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => onClose(false)}
                    style={mainStyles.modalClose}
                  >
                    <CloseIcon />
                  </TouchableOpacity>
                </View>
              );
            }}
            onSwipeDown={() => onClose(false)}
            enableSwipeDown={true}
            imageUrls={data}
            loadingRender={() => (
              <ActivityIndicator size={'large'} color={colors.loyaltyPrimary} />
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
    )
};

const styles = StyleSheet.create({
  modalClose: {
    position: "absolute",
    top: 30,
    zIndex: 1000,
  }
});

export default ImageViewerModal;