import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import { colors } from "../../colors";
import { useTheme } from "../../ThemeProvider";

const FullScreenLoader = (props) => {
  const { isDark } = useTheme();

  const color = props.color
    ? props.color
    : isDark
    ? colors.white
    : colors.darkBlue;

  if (props.absolutePosition) {
    return (
      <View style={[styles.absoluteWrapper, props?.style]}>
        <ActivityIndicator color={color} />
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, props?.style]}>
      <ActivityIndicator color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  absoluteWrapper: {
    position: "absolute",
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});

export default FullScreenLoader;
