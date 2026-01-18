import {StyleSheet} from "react-native";
import {colors} from "../../components/colors";

const styles = StyleSheet.create({
  changePhoto: {
    width: 100,
    height: 100,
    marginTop: 32,
    marginBottom: 25,
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    position: 'relative'
  },
  changePhoto__icon: {
    position: 'absolute',
    width: 32,
    height: 32,
    bottom: 0,
    right: 0,
    zIndex: 100
  }
})

export default styles
