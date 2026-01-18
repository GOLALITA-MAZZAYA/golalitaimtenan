import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { TypographyText } from "../../../../components/Typography";
import { BALOO_MEDIUM } from "../../../../redux/types";
import { colors } from "../../../../components/colors";

const GiftCard = ({ name, description, isDark, onPress, imageUrl, index }) => {
  const borderColorStyle = {
    borderColor: isDark ? colors.white : "#DDDFE4",
    backgroundColor: isDark ? colors.navyBlue : null,
  };

  return (
    <TouchableOpacity style={[styles.card, borderColorStyle, {marginTop: index ? 20: 0}]} onPress={onPress}>
      <View style={styles.header}>
        <TypographyText
          title={description}
          textColor={colors.green}
          size={12}
          font={BALOO_MEDIUM}
        />
      </View>
      <View style={styles.nameWrapper}>
        <TypographyText
          title={name}
          textColor={isDark ? colors.white : colors.darkBlue}
          size={18}
          font={BALOO_MEDIUM}
          numberOfLines={1}
          style={{ paddingHorizontal: 5 }}
        />
      </View>
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.cardImage}
          resizeMode="stretch"
        />
      )}

      <View style={styles.block}>
        <View style={[styles.block1, borderColorStyle]}>
          <View
            style={[
              styles.block2,
              { backgroundColor: isDark ? colors.navyBlue : colors.white },
              borderColorStyle,
            ]}
          >
            <View
              style={[
                styles.block3,
                { backgroundColor: isDark ? colors.navyBlue : colors.white },
              ]}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderWidth: 1.5,
    borderRadius: 12,
    //padding: 8,
  },
  header: {
    height: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardImage: {
    height: 220,

    borderRadius: 12,
    // margin: 10,
    backgroundColor: colors.lightGrey,
    // marginVertical:17
  },
  nameWrapper: {
    justifyContent: "center",
    // alignItems: "center",
    marginTop: 22,
  },
  block: {
    width: "100%",
    height: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 8,
    top: 18,
  },
  block1: {
    width: 40,
    height: 10,
    borderWidth: 1,
    borderColor: "#DDDFE4",
    borderRadius: 10,
  },
  block2: {
    height: 18,
    width: 18,
    borderWidth: 1,
    borderColor: "#DDDFE4",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: "absolute",
    left: 10,
    top: -10,
  },
  block3: {
    width: 30,
    height: 7.5,
    position: "absolute",
    bottom: -1,
    left: -5,
    borderRadius: 10,
  },
});

export default GiftCard;
