import {StyleSheet, TouchableOpacity, View} from "react-native";
import Image from "../../../../components/AppImage";
import Carousel from 'react-native-reanimated-carousel';
import {useRef} from "react";
import {SCREEN_WIDTH} from "../../../../styles/mainStyles";

const CARD_WIDTH = SCREEN_WIDTH - 32;

const LoyaltyGiftCardSwiper = ({url, onImagePress}) => {
    const swiperRef = useRef(null);
    const activeIndexRef = useRef(0);

    return (
      <View style={styles.block}>
        <Carousel
          ref={swiperRef}
          width={CARD_WIDTH}
          height={242}
          data={[url]}
          loop={false}
          onSnapToItem={(index) => activeIndexRef.current = index}
          style={styles.wrapper}
          renderItem={() => (
            <TouchableOpacity onPress={() => onImagePress(url)} style={styles.imageWrapper}>
              <Image source={{ uri: url }} style={styles.image}/>
            </TouchableOpacity>
          )}
        />
      </View>
    )
};

const styles = StyleSheet.create({
  wrapper: {
    height: 242,
    borderRadius: 40,
    overflow: 'hidden',
  },
  block: {

  },
  imageWrapper: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: 242,
    borderRadius: 40
  }
});

export default LoyaltyGiftCardSwiper;