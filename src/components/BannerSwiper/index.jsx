import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions } from "react-native";
import { colors } from "../colors";
import { SCREEN_WIDTH } from "../../styles/mainStyles";

const BannerSwiper = ({
  banners = [],
  singleBannerUrl = null,
  images = null, // New: array of image URIs directly
  onBannerPress,
  isDark = false,
  style,
  aspectRatio = 23 / 10,
  fixedHeight = null, // New: fixed height instead of aspect ratio
  autoplay = true,
  autoplayTimeout = 3,
  loop = true,
  resizeMode = "cover", // New: configurable resizeMode
  imageStyle = {}, // New: additional image styles
  containerPadding = 20, // New: configurable padding
}) => {
  const scrollViewRef = useRef(null);
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [actualWidth, setActualWidth] = useState(null);
  const autoplayTimerRef = useRef(null);

  // Support both banners array and direct images array
  const imageList = images
    ? images
    : banners?.length
    ? banners.map(b => (typeof b === 'string' ? b : b.banner_image))
    : singleBannerUrl
    ? [singleBannerUrl]
    : [];

  if (!imageList.length) {
    return null;
  }

  const totalImages = imageList.length;

  // Calculate dimensions
  // When containerPadding is 0, we'll measure the actual width via onLayout
  // Otherwise subtract padding from screen width
  const initialWidth = containerPadding === 0 
    ? SCREEN_WIDTH - 40 // Assume parent has 20px padding on each side
    : SCREEN_WIDTH - (containerPadding * 2);
  const containerWidth = actualWidth || initialWidth;
  const containerHeight = fixedHeight || (containerWidth / aspectRatio);
  const imageHeight = containerHeight;

  // Calculate image width for scroll calculations - must be explicit pixel value for pagingEnabled
  const imageWidth = containerWidth;

  // Handle scroll to update current index
  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / containerWidth);
    const clampedIndex = Math.max(0, Math.min(index, totalImages - 1));
    if (clampedIndex !== currentIndex) {
      setCurrentIndex(clampedIndex);
    }
  };

  // Autoplay functionality
  useEffect(() => {
    if (autoplay && totalImages > 1 && containerWidth > 0) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          let nextIndex = prevIndex + 1;
          // Always loop back to 0 when reaching the end for continuous playback
          if (nextIndex >= totalImages) {
            nextIndex = 0;
          }
          scrollViewRef.current?.scrollTo({
            x: nextIndex * containerWidth,
            animated: true,
          });
          return nextIndex;
        });
      }, autoplayTimeout * 1000);
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, totalImages, autoplayTimeout, containerWidth]);

  const renderPagination = () => {
    if (totalImages <= 1) return null;
    return (
      <View style={styles.pagination}>
        {imageList.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && {
                backgroundColor: isDark ? colors.green : colors.darkBlue,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const wrapperStyle = containerPadding === 0
    ? { height: containerHeight, width: "100%" }
    : { height: containerHeight, width: containerWidth };

  return (
    <View 
      ref={containerRef}
      onLayout={(e) => {
        if (containerPadding === 0) {
          const { width } = e.nativeEvent.layout;
          if (width && width > 0 && width !== actualWidth) {
            setActualWidth(width);
          }
        }
      }}
      style={[styles.wrapper, wrapperStyle, style]}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {imageList.map((imageUri, index) => {
          const bannerItem = banners?.[index];
          
          return (
            <TouchableOpacity
              key={`banner-${index}-${imageUri}`}
              onPress={() => {
                // Pass the imageUri if using images array, otherwise pass bannerItem
                onBannerPress?.(images ? imageUri : (bannerItem || imageUri), index);
              }}
              style={[
                styles.imageContainer, 
                { 
                  width: containerWidth, 
                  height: imageHeight,
                  overflow: 'hidden',
                  borderRadius: imageStyle.borderRadius || 0,
                }
              ]}
              activeOpacity={0.9}
            >
              <Image
                key={`img-${index}-${imageUri}`}
                style={[
                  { 
                    width: containerWidth, 
                    height: imageHeight,
                    borderRadius: imageStyle.borderRadius || 0,
                  }, 
                  imageStyle
                ]}
                source={{ uri: imageUri }}
                resizeMode={resizeMode}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: "hidden",
    position: "relative",
  },
  scrollView: {
    width: "100%",
    height: "100%",
  },
  scrollContent: {
    flexDirection: "row",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  pagination: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 50,
    backgroundColor: colors.white,
    marginHorizontal: 3,
  },
});

export default BannerSwiper;