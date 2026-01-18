import { Image, View, StyleSheet } from "react-native";
import { BALOO_BOLD } from "../../redux/types";
import { TypographyText } from "../Typography";
import HeartSvg from "../../assets/heart.svg";
import { sized } from "../../Svg";
import { TouchableOpacity } from "react-native-gesture-handler";

const OfferCard = (props) => {
  const {
    url,
    name,
    price,
    style,
    onPress,
    onLikePress,
    isSaved,
    isDark,
    descriptionSale,
    workTime,
  } = props;

  const HeartIcon = sized(HeartSvg, 20, 20, isSaved ? "#ff0000" : "#999CAD");

  return (
    <TouchableOpacity
      style={[
        styles.wrapper,
        style,
        {
          backgroundColor: isDark ? "#1F2666" : "transparent",
          borderColor: isDark ? "#1F2666" : "#fff",
        },
      ]}
      onPress={onPress}
    >
      <View
        style={{
          flexDirection: "row",
          flex: 1,
        }}
      >
        <Image source={{ uri: url }} style={styles.logo} />
        <View
          style={[
            styles.textWrapper,
            {
              justifyContent: !!price ? "space-between" : "center",
            },
          ]}
        >
          <TypographyText
            textColor={isDark ? "#fff" : "#08003B"}
            size={14}
            font={BALOO_BOLD}
            title={name}
            numberOfLines={2}
          />

          {!!price && (
            <TypographyText
              textColor={"#E32251"}
              size={14}
              font={BALOO_BOLD}
              title={price}
              numberOfLines={1}
              style={{ marginTop: 3 }}
            />
          )}
        </View>

        {!!descriptionSale && (
          <TypographyText
            textColor={"#E32251"}
            size={14}
            font={BALOO_BOLD}
            title={descriptionSale}
            numberOfLines={1}
            style={{ marginTop: 3 }}
          />
        )}

        {!!workTime && (
          <TypographyText
            textColor={"#E32251"}
            size={14}
            font={BALOO_BOLD}
            title={workTime}
            numberOfLines={1}
            style={{ marginTop: 3 }}
          />
        )}
      </View>
      <TouchableOpacity style={styles.like} onPress={onLikePress}>
        <HeartIcon />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#DDDFE4",
    flexDirection: "row",
    alignItems: "center",
  },
  textWrapper: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: "space-between",
  },
  logo: {
    width: 66,
    height: 66,
    borderRadius: 4,
  },
  like: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OfferCard;
