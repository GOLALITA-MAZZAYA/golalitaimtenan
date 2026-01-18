import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { BALOO_MEDIUM } from "../../../../../../../redux/types";

const BtnWithIcon = ({ text, icon, onPress, color, style }) => {
  return (
    <TouchableOpacity
      style={[styles.wrapper, { borderColor: color }, style]}
      onPress={onPress}
    >
      {icon}

      <Text style={[styles.text, { color }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 20,
  },
  text: {
    fontSize: 18,
    fontFamily: BALOO_MEDIUM,
    marginLeft: 4,
  },
});

export default BtnWithIcon;
