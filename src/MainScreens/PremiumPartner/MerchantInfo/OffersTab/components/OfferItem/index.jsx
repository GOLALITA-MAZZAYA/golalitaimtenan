import { Dimensions, TouchableOpacity } from "react-native";
import { colors } from "../../../../../../components/colors";
import { View } from "react-native";
import { TypographyText } from "../../../../../../components/Typography";
import { BALOO_SEMIBOLD } from "../../../../../../redux/types";
import HeartSvg from "../../../../../../assets/heart.svg";
import { StyleSheet } from "react-native";
import OfferSvg from "../../../../../../assets/offer.svg";

const IMAGE_SIZE = 66;
const originalWidth = 283;
const originalHeight = 110;
const aspectRatio = originalWidth / originalHeight;
const windowWidth = Dimensions.get("window").width - 40;
const cardHeight = 120;

const OfferItem = (props) => {
  const { onItemPress, onSavePress, isLiked, name, type, discRibbon } = props;

  const heartColor = isLiked ? "black" : "#DDDFE4";

  return (
    <TouchableOpacity
      onPress={onItemPress}
      style={[styles.row, styles.childWrapper]}
    >
      <View
        style={{
          width: windowWidth,
          aspectRatio,
          position: "absolute",
          left: 0,
        }}
      >
        <OfferSvg
          width="100%"
          height="100%"
          viewBox={`0 0 ${originalWidth} ${originalHeight}`}
        />
      </View>

      <View style={styles.typeWrapper}>
        <TypographyText
          textColor={colors.mainDarkModeText}
          size={12}
          font={BALOO_SEMIBOLD}
          title={type}
          style={styles.typeText}
          numberOfLines={2}
        />
      </View>

      <View style={styles.descriptionWrapper}>
        <TypographyText
          textColor={colors.white}
          size={15}
          font={BALOO_SEMIBOLD}
          title={name}
          style={styles.nameText}
          numberOfLines={2}
        />

        <TypographyText
          textColor={colors.white}
          size={18}
          font={BALOO_SEMIBOLD}
          title={discRibbon}
          style={styles.descriptionText}
          numberOfLines={2}
        />

        <TouchableOpacity onPress={onSavePress} style={styles.heartBtn}>
          <HeartSvg color={heartColor} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 5,
    marginTop: 16,
  },
  infoBlockWrapper: {
    marginTop: 10,
  },
  heartBtn: {
    paddingLeft: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  valueText: {
    color: "#E32251",
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 4,
  },
  imageBackground: {
    marginTop: 16,
    marginRight: 10,
    width: "100%",
    height: "100%",
  },
  childWrapper: {
    borderRadius: 8,
    padding: 8,
    position: "relative",
    backgroundColor: "transparent",
    height: cardHeight,
    width: "100%",
    marginBottom: 30,
  },
  childInfoWrapper: {
    flex: 1,
    justifyContent: "space-around",
    height: IMAGE_SIZE,
    marginLeft: 8,
  },
  infoLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeWrapper: {
    position: "absolute",
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth * 0.22,
    height: 140,
  },

  typeText: {
    transform: [{ rotate: "270deg" }],
  },
  descriptionWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    height: 140,
    width: windowWidth - windowWidth * 0.3,
    right: 0,
    padding: 16,
  },
  nameText: {
    paddingRight: 15,
    textAlign: "center",
  },
  descriptionText: {
    marginTop: 10,
  },
  heartBtn: {
    position: "absolute",
    top: 15,
    right: 10,
  },
});

export default OfferItem;
