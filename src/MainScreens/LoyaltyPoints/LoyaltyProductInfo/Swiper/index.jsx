import {StyleSheet} from "react-native";
import Carousel from 'react-native-reanimated-carousel';
import {getLoyaltyProductImageUri, timeLeft} from "../../helpers";
import ProductListCard from "../../common/ProductListCard";
import {isRTL} from "../../../../../utils";
import {useRef} from "react";
import {SCREEN_WIDTH} from "../../../../styles/mainStyles";

const CARD_WIDTH = SCREEN_WIDTH - 40;
const IMAGE_ASPECT_RATIO = 16 / 9;
const CARD_HEIGHT = CARD_WIDTH / IMAGE_ASPECT_RATIO;

const Swiper = ({data, onImagePress}) => {
    const swiperRef = useRef(null);
    const activeIndexRef = useRef(0);

    const handleArrowPress = () => {
        swiperRef.current?.next()
    }


    const imageSource = getLoyaltyProductImageUri(data, "image_1920");
    const fullScreenUri = imageSource;

    return (
      <Carousel
            ref={swiperRef}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            data={[imageSource]}
            loop={false}
            style={styles.wrapper}
            onSnapToItem={(index) => activeIndexRef.current = index}
            renderItem={({item: uri}) => (
                <ProductListCard
                  description={isRTL() ? data.arabic_name: data.name}
                  onPress={() => onImagePress(fullScreenUri)}
                  uri={uri}
                  expiringDate={timeLeft(data.loyalty_expiry_date)}
                  onArrowPress={handleArrowPress}
                  value={data.minimum_loyalty_points}
                  aspectRatio={IMAGE_ASPECT_RATIO}
                  style={{width: CARD_WIDTH}}
                />
            )}
      />
    )
};

const styles = StyleSheet.create({
  wrapper: {
    height: CARD_HEIGHT
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
});

export default Swiper;