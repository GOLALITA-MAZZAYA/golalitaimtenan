import { Dimensions } from "react-native";

let { width, height } = Dimensions.get("window");
if (width > height) {
  [width, height] = [height, width];
}

//Guideline sizes are based on standard ~5" screen mobile device

const guidelineBaseWidth = 375;
// const guidelineBaseWidth = 500;

const guidelineBaseHeight = 812;

const horizontalScale = (size) => (width / guidelineBaseWidth) * size;

const verticalScale = (size) => (height / guidelineBaseHeight) * size;

const moderateScale = (size, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

export { horizontalScale, verticalScale, moderateScale };
