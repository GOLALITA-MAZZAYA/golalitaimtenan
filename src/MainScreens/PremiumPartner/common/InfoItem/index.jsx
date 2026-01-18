import { StyleSheet, View } from "react-native";
import { BALOO_REGULAR } from "../../../../redux/types";
import { colors } from "../../../../components/colors";
import { TouchableOpacity } from "react-native";
import { isRTL } from "../../../../../utils";
import { TypographyText } from "../../../../components/Typography";

const InfoItem = (props) => {
  const { onPress, label, icon, style } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.wrapper, style]}
      disabled={!onPress}
    >
      <View style={styles.icon}>{icon}</View>
      <TypographyText
        textColor={colors.green}
        size={14}
        font={BALOO_REGULAR}
        title={label}
        style={[isRTL() ? { marginRight: 8 } : { marginLeft: 8 }]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 25,
    height: 25,
  },
});

export default InfoItem;
