import React, { memo, useMemo } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { TypographyText } from "../Typography";
import { BALOO_REGULAR, BALOO_SEMIBOLD } from "../../redux/types";
import StartIcon from "../../assets/star.svg";
import { sized } from "../../Svg";
import FullScreenLoader from "../Loaders/FullScreenLoader";
import { getFlexDirection, isRTL } from "../../../utils";
import useIsGuest from "../../hooks/useIsGuest";

const CardWithNesetedItems = ({ parentProps }) => {
  const {
    uri,
    name,
    description,
    loadingDescription,
    isSaved,
    onPress,
    onPressFavourite,
  } = parentProps;

  const isGuest = useIsGuest();

  const StarIconSmall = useMemo(() => sized(StartIcon, 22, 22), []);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.wrapper}
    >
      <ImageBackground
        source={{ uri }}
        style={styles.image}
        imageStyle={styles.imageBorder}
      >
        <View style={[styles.bottomBlock, getFlexDirection()]}>
          <View style={styles.infoWrapper}>
            <TypographyText
              title={name}
              size={15}
              font={BALOO_SEMIBOLD}
              textColor={'white'}
              numberOfLines={2}
              style={styles.name}
            />


          </View>
          <View style={[styles.descriptionBlock,{flexDirection: isRTL() ? 'row-reverse': 'row'}]}>
            {!!description && !loadingDescription && (
              <TypographyText
                title={description}
                size={12}
                font={BALOO_REGULAR}
                textColor={'white'}
                style={styles.description}
                numberOfLines={2}
              />
            )}

          </View>
        </View>

        {!isGuest && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressFavourite}
            style={styles.favoriteButton}
          >
            <StarIconSmall
              color={'white'}
              fill={isSaved ? 'white' : "transparent"}
            />
          </TouchableOpacity>
        )}

        {loadingDescription && (
          <FullScreenLoader style={styles.loader} />
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 5,
    marginVertical: 16,
    borderRadius: 14,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4.59,
    elevation: 5,
  },

  image: {
    width: "100%",
    height: 200,
    justifyContent: "flex-end",
  },

  imageBorder: {
    borderRadius: 14,
  },

  bottomBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 10,
  },

  infoWrapper: {
    flex: 1,
    marginHorizontal: 10
  },

  name: {
    fontWeight: '600'
  },

  description: {
    alignSelf: isRTL() ? "flex-end" : "flex-start",
    marginTop: 5
  },

  favoriteButton: {
    marginLeft: 12,
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 5,
    borderRadius: 16
  },

  loader: {
    alignSelf: "flex-start",
    margin: 16,
  },
  descriptionBlock: {
    marginHorizontal: 10
  }
});

export default memo(CardWithNesetedItems);
