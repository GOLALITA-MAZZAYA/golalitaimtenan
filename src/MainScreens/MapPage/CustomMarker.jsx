import React, { useEffect, useState } from "react";
import { Image, Linking, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { colors } from "../../components/colors";
import { mainStyles } from "../../styles/mainStyles";
import FastImage from "react-native-fast-image";
import { TypographyText } from "../../components/Typography";
import { LUSAIL_REGULAR } from "../../redux/types";
import { Marker } from "react-native-maps";
import { sized } from "../../Svg";
import FullStarSvg from "../../assets/full_star.svg";
import HalfStarSvg from "../../assets/half_star.svg";
import { useTheme } from "../../components/ThemeProvider";

const FullStarIcon = sized(FullStarSvg, 16);
const HalfStarIcon = sized(HalfStarSvg, 16);

const logoIcon = require("../../../assets/logo.png");

const CustomMarker = ({ item, pressedItem, setPressedItem, index }) => {
  const isDark = useTheme();
  const [isTrackChanges, setIsTrackChanges] = useState(false);
  useEffect(() => {
    setIsTrackChanges(true);
    setTimeout(() => {
      setIsTrackChanges(false);
    }, 0);
  }, [pressedItem]);

  return (
    <Marker
      key={`marker${index}`}
      // tracksViewChanges={isTrackChanges}

      coordinate={{
        latitude: item.partner_latitude,
        longitude: item.partner_longitude,
      }}
      onPress={() => {
        console.log(pressedItem, "pressedItem");
        if (pressedItem)
          Linking.openURL(
            `https://www.google.com/maps/dir/Current+Location/${pressedItem.partner_latitude},${pressedItem.partner_longitude}`
          );
        setPressedItem(item);
      }}
      onSelect={() => setPressedItem(item)}
      onCalloutPress={() => setPressedItem(item)}
    >
      {/*<View style={{*/}
      {/*  alignItems: 'center',*/}
      {/*  justifyContent: 'center'*/}
      {/*}}>{(pressedItem === item || currentSlide === index) ? <PressedMarkerIcon/> : <MarkerIcon/>}</View>*/}
      {pressedItem !== null &&
        pressedItem?.merchant_id === item.merchant_id && (
          <TouchableOpacity
            style={[
              styles.merchantInfo,
              isDark && { backgroundColor: colors.darkBlue },
            ]}
          >
            <View style={mainStyles.centeredRow}>
              <FastImage
                style={styles.merchantInfo__logo}
                source={{
                  uri: pressedItem.merchant_logo,
                }}
              />
            </View>
            <TypographyText
              textColor={isDark ? colors.white : colors.darkBlue}
              size={12}
              font={LUSAIL_REGULAR}
              title={pressedItem.name ?? pressedItem.merchant_name}
              style={[mainStyles.centeredText, { fontWeight: "700" }]}
            />
            <View style={mainStyles.centeredRow}>
              <TypographyText
                textColor={colors.orange}
                size={12}
                font={LUSAIL_REGULAR}
                title={pressedItem.rating ?? pressedItem.merchant_rating}
                style={{ fontWeight: "700" }}
              />
              {[1, 2, 3, 4, 5].map((index) => {
                return (
                  <View key={index}>
                    {index <=
                    +(pressedItem.rating ?? pressedItem.merchant_rating) ? (
                      <FullStarIcon />
                    ) : (
                      <HalfStarIcon />
                    )}
                  </View>
                );
              })}
            </View>
            <View style={mainStyles.centeredRow}>
              <Image
                source={{ uri: pressedItem.category_logo }}
                style={styles.merchantInfo__category}
              />
              {/*<FastImage*/}
              {/*  */}
              {/*  cacheKey={`category_${pressedItem.category_logo.split('/')[pressedItem.category_logo.split('/').length - 3]}`}*/}
              {/*/>*/}
              <TypographyText
                textColor={isDark ? colors.white : colors.darkBlue}
                size={12}
                font={LUSAIL_REGULAR}
                title={pressedItem.category}
                style={{ fontWeight: "700" }}
              />
            </View>
            <View
              style={[
                styles.merchantInfo__triangle,
                isDark && { borderBottomColor: colors.darkBlue },
              ]}
            />
          </TouchableOpacity>
        )}
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image source={logoIcon} style={{ width: 25, height: 25 }} />
      </View>
    </Marker>
  );
};

export default CustomMarker;
