import {StyleSheet, View} from "react-native";
import Carousel from 'react-native-reanimated-carousel';
import {useRef} from "react";
import ProductListCard from "../../common/ProductListCard";
import {timeLeft} from "../../helpers";
import {isRTL} from "../../../../../utils";
import {SCREEN_WIDTH} from "../../../../styles/mainStyles";

const CARD_WIDTH = SCREEN_WIDTH - 32;

const Swiper = ({data, onImagePress}) => {
    const swiperRef = useRef(null);
    const activeIndexRef = useRef(0);

    return (
      <View style={styles.block}>
        <Carousel
              ref={swiperRef}
              width={CARD_WIDTH}
              height={242}
              data={[data.logo]}
              loop={false}
              style={styles.wrapper}
              onSnapToItem={(index) => activeIndexRef.current = index}
              renderItem={({item: base64}) => (
                  <ProductListCard
                    description={isRTL() ? data.name_arabic: data.name}
                    onPress={() => onImagePress(base64)}
                    uri={base64}
                    expiringDate={timeLeft(data.expiry_date)}
                    style={{width: CARD_WIDTH}}
                  />
              )}
        />
      </View>
    )
};

const styles = StyleSheet.create({
  wrapper: {
    height: 242
  },
  block: {

  },
});

export default Swiper;