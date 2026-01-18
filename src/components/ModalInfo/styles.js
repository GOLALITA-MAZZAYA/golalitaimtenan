import {StyleSheet} from "react-native";
import {mainStyles, WINDOW_HEIGHT, WINDOW_WIDTH} from "../../styles/mainStyles";
import {colors} from "../colors";

export const styles = StyleSheet.create({
  modalView: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    width: WINDOW_WIDTH - 32,
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 8,
    paddingBottom: 21
  },
  modal__line: {
    height: 1,
    width: '100%',
    backgroundColor: '#CBD5E0',
    marginBottom: 21
  },
  modal__button: {
    ...mainStyles.lightShadow,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 50,

  }
})
