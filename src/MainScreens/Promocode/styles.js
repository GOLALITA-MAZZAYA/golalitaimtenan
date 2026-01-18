import { StyleSheet } from "react-native";
import { mainStyles, SCREEN_HEIGHT } from "../../styles/mainStyles";
import { colors } from "../../components/colors";
import { BALOO_REGULAR, BALOO_SEMIBOLD } from "../../redux/types";

export const styles = StyleSheet.create({
  container: {
    ...mainStyles.lightShadow,
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 30,
    minHeight: (SCREEN_HEIGHT / 100) * 72,
  },
  icon: {
    position: "absolute",
    top: -5,
    right: -5,
    zIndex: 100,
  },
  codeWrapper: {
    marginTop: 35,
  },
  cell: {
    borderWidth: 1,
    borderColor: colors.label,
    borderStyle: "solid",
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    color: colors.label,
    fontSize: 40,
    fontFamily: BALOO_SEMIBOLD,
    textAlign: "center",
  },
  label: {
    color: colors.grey,
    marginTop: 6,
  },
  rulesWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
