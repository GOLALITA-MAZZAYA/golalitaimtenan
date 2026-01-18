import React, { useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Video from "react-native-video";

const { width: screenWidth } = Dimensions.get("window");

const MP4Slider = ({ data, style, playInterval = 3000, width=screenWidth-40 }) => {
  const [activeIndex, setActiveIndex] = useState(0);


  const renderItem = ({ item, index }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.itemContainer}>
      <View style={styles.videoWrapper}>
        <Video
          source={item}
          style={styles.itemVideo}
          resizeMode="cover"
          repeat
          muted
          paused={index !== activeIndex} // only active video plays
        />
        {/* Overlay for Android to hide corners */}
        <View style={styles.overlay} pointerEvents="none" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.wrapper, style, {width}]}>
      <Carousel
        loop={data?.length > 1}
        width={width}
        height={145}
        autoPlay
        autoPlayInterval={playInterval}
        data={data}
        scrollAnimationDuration={1000}
        renderItem={renderItem}
        onSnapToItem={(index) => setActiveIndex(index)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 145,
    width: "100%",
    borderRadius: 8,
    overflow: 'hidden'
  },
  itemContainer: {
    width: "100%",
    height: 145,
    paddingHorizontal: 0,
    borderRadius: 8,
  },
  videoWrapper: {
    flex: 1,
  },
  itemVideo: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
});

export default MP4Slider;
