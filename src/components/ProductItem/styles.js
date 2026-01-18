
import {StyleSheet} from "react-native";
import {colors} from "../colors";
import {mainStyles} from "../../styles/mainStyles";

const styles = StyleSheet.create({
  product: {
    ...mainStyles.lightShadow,
    borderRadius: 10,
    backgroundColor: colors.white,
    paddingTop: 11,
    paddingBottom: 22,
    marginBottom: 20,
    marginHorizontal: 20,
    // overflow: 'hidden'
  },
  product__pointsWrapper: {
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 0,
    overflow: 'hidden'
  },
  product__points: {
    minWidth: 66,
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -6,
    zIndex: 1000,
  },
  imgWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    borderStyle: 'solid',
    position: 'relative'
  }
})

export default styles
