import {StyleSheet} from "react-native";
import {BALOO_REGULAR} from "../../redux/types";
import {colors} from "../colors";

const styles = StyleSheet.create({
  searchWrapper: {
    width: '80%',
    position: 'relative',
    borderRadius: 10,
    height: 32,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#999CAD',
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchIcon: {
    paddingHorizontal: 9
  },
  input: {
    width: '80%',
    fontSize: 14,
    fontFamily: BALOO_REGULAR,
    color: colors.grey,
    lineHeight: 24
  }
})

export default styles
