import { TouchableOpacity } from "react-native";
import { BALOO_SEMIBOLD } from "../../../../redux/types";
import { StyleSheet } from "react-native";
import { TypographyText } from "../../../../components/Typography";

const CommonButton = (props) => {
  const { text, icon, onPress, wrapperStyle, textStyle, disabled } = props;
  const textColor = "#999CAD";
  const borderColor = "#DDDFE4";

  return (
    <TouchableOpacity
      style={[styles.wrapper, { borderColor: borderColor }, wrapperStyle]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon}
      <TypographyText
        textColor={textColor}
        size={12}
        font={BALOO_SEMIBOLD}
        title={text}
        style={[styles.text, textStyle]}
        numberOfLines={1}
        ellipsizeMode="tail"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 32,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginLeft: 8,
  },
});

export default CommonButton;
