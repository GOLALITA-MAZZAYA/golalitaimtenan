import {StyleSheet} from "react-native";
import {colors} from "../colors";

export const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top: -15,
    backgroundColor: colors.bg,
    height: 100,
    borderRadius: 5,
    width: '100%',
    zIndex: 1000,
  },
  dropdown__item: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  }
})
