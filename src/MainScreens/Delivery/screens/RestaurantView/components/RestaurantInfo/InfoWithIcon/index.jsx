import { StyleSheet, Text, View } from "react-native";
import { BALOO_REGULAR } from "../../../../../../../redux/types";
import { colors } from "../../../../../../../components/colors";

const InfoWithIcon = ({ text, icon, isDark }) => {
  return (
    <View style={styles.wrapper}>
      {icon}

      <Text
        style={[
          styles.text,
          { color: isDark ? colors.white : colors.darkBlue },
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    fontFamily: BALOO_REGULAR,
    marginLeft: 4,
  },
});

export default InfoWithIcon;
