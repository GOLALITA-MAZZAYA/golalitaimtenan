import { StyleSheet } from "react-native";
import { colors } from "../../components/colors";

const styles = StyleSheet.create({
  swiperWrapper: {
    position: "relative",
  },
  borderBottom: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderBottomColor: colors.lightGrey,
  },
  key: {
    marginBottom: 3,
  },
  value: {
    marginBottom: 10,
  },
  imagesIndicator: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
  },
});

export default styles;
