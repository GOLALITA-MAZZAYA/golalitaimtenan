import { StyleSheet } from "react-native";
import { mainStyles, SCREEN_WIDTH } from "../../styles/mainStyles";
import { colors } from "../colors";

export const styles = StyleSheet.create({
  item: {
    ...mainStyles.lightShadow,
    ...mainStyles.betweenRow,
    borderRadius: 10,
    backgroundColor: colors.white,
    padding: 8,
    marginBottom: 16,
    // width: SCREEN_WIDTH - 40,
  },
  logo: {
    width: 47,
    height: 47,
    borderRadius: 50,
  },
  logoWrapper: {
    ...mainStyles.logoWrapper,
    shadowOpacity: 0,
  },
  arrow: {
    marginRight: 8,
  },
});
