import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { TypographyText } from "../Typography";
import { BALOO_SEMIBOLD } from "../../redux/types";
import { colors } from "../colors";
import { sized } from "../../Svg";
import LinearGradient from "react-native-linear-gradient";

const IlustrationCard = (props) => {
  const { title, onPress, style, Icon } = props;

  return (
    <View style={[styles.wrapper, style]}>
      <View style={{ flex: 1 }}>
        <Image source={Icon} style={styles.image} resizeMode="stretch" />
      </View>

      <LinearGradient
        colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0)"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradient}
      >
        <TouchableOpacity onPress={onPress} style={styles.btn}>
          <TypographyText
            textColor={colors.white}
            size={12}
            font={BALOO_SEMIBOLD}
            title={title}
            numberOfLines={2}
          />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
    backgroundColor: "#fff",
    borderRadius: 5,
    height: 233,
    marginHorizontal: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  btn: {
    height: 32,
    backgroundColor: "#027DC1",
    borderRadius: 100,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 16,
  },
  gradient: {
    alignSelf: "center",
    position: "absolute",

    bottom: 0,
    height: 65,
    width: "100%",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});

export default IlustrationCard;
