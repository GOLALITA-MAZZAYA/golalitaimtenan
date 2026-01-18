import { StyleSheet } from "react-native";
import { mainStyles } from "../../styles/mainStyles";
import { colors } from "../../components/colors";

export const styles = StyleSheet.create({
  wrapper: {},
  item: {
    height: "100%",
    alignItems: "center",
    marginTop: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: "#DDDFE4",
    marginHorizontal: 3,
    marginBottom: 65,
  },
  dot__active: {
    backgroundColor: colors.green,
  },
  item__icon: {
    marginTop: -30,
  },
  item__label: {
    ...mainStyles.centeredText,
    paddingHorizontal: 10,
    marginTop: 10,
    lineHeight: 20,
  },
  back: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1000,
  },
  skip: {
    position: "absolute",
    right: 20,
    top: 50,
    zIndex: 1000,
  },
});
