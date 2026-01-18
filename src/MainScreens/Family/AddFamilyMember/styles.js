import {StyleSheet} from "react-native";
import {colors} from "../../../components/colors";

export const styles = StyleSheet.create({
  changePhoto: {
    width: 100,
    height: 100,
    marginTop: 32,
    marginBottom: 25,
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    position: 'relative',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    marginBottom: 20
  }
})
