import { StyleSheet } from "react-native";
import { colors } from "../../components/colors";
import { mainStyles } from "../../styles/mainStyles";

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
    marginTop: 12,
  },
  bottom: {
    position: "absolute",
    bottom: 95,
    width: "100%",
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 12,
  },
  merchantInfo: {
    backgroundColor: colors.white,
    padding: 5,
    width: 140,
    marginBottom: 10,
    zIndex: 1000,
  },
  merchantInfo__logo: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  merchantInfo__category: {
    width: 25,
    height: 25,
    borderRadius: 50,
    marginRight: 5,
  },
  merchantInfo__triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 0,
    borderRightWidth: 6,
    borderBottomWidth: 8,
    borderLeftWidth: 6,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: colors.white,
    borderLeftColor: "transparent",
    transform: [{ rotate: "180deg" }],
    position: "absolute",
    bottom: -8,
    left: 63,
  },
  geoButton: {
    ...mainStyles.shadow,
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    position: "absolute",
    bottom: 405,
    right: 6,
    zIndex: 100,
  },
});

export default styles;
