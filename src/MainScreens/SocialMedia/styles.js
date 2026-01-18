import {StyleSheet} from "react-native";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "../../styles/mainStyles";

export const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  container__inner: {
    height: SCREEN_HEIGHT / 1.7,
    justifyContent: 'space-between'
  }
})