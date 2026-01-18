import { View } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../colors";

const TopCircleShadow = () => {
  return <View style={styles.goldShadeWrapper}></View>;
};

const styles = StyleSheet.create({
  goldShadeWrapper: {
    width: 500,
    height: 500,
    borderRadius: 250,
    // paddingTop: 100,
    // paddingBottom: 85,
    backgroundColor: "rgba(0,0,0,1)",
    position: "absolute",
    right: -224,
    top: -500,
    shadowColor: "#DDBD6B",
    shadowOffset: {
      height: 250,
    },
    shadowOpacity: 0.2,
    shadowRadius: 100,
    elevation: 50,
    zIndex: 10000,
  },
});

export default TopCircleShadow;
