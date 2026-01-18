import { Dimensions, PixelRatio, StyleSheet } from "react-native";
import { colors } from "../components/colors";
import { getFlexDirection, isRTL } from "../../utils";

export const SCREEN_HEIGHT = Dimensions.get("screen").height;
export const SCREEN_WIDTH = Dimensions.get("screen").width;
export const WINDOW_HEIGHT = Dimensions.get("window").height;
export const WINDOW_WIDTH = Dimensions.get("window").width;

export const getPixel = (size) => {
  return PixelRatio.getPixelSizeForLayoutSize(size);
};

export const mainStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  centeredRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  centeredText: {
    width: "100%",
    textAlign: "center",
  },
  betweenRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  p20: {
    paddingHorizontal: 20,
  },
  mb20: {
    marginBottom: 20,
  },
  mt20: {
    marginTop: 20,
  },
  ml5: {
    marginLeft: 5,
  },
  shadow: {
    shadowColor: colors.darkBlue,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.33,
    shadowRadius: 20,
    elevation: 24,
  },
  b10: {
    borderRadius: 10,
  },
  logoWrapper: {
    shadowColor: "rgba(153, 156, 173, 0.3)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.63,
    shadowRadius: 5,
    elevation: 10,
    width: 64,
    height: 64,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderRadius: 50,
    position: "relative",
  },
  lightShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  swiper: {
    width: "100%",
    height: "100%",
  },
  swiperContainer: {
    width: "100%",
    aspectRatio: 23 / 10,
  },
  swiperContainerWithHeight: {
    width: SCREEN_WIDTH - 40, // Account for paddingHorizontal: 20
    height: ((SCREEN_WIDTH - 40) * 10) / 23,
    overflow: "hidden",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 50,
    backgroundColor: colors.white,
    marginHorizontal: 3,
  },
  swiper__img: {
    width: "100%",
    height: 230,
    // resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    width: SCREEN_WIDTH,
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    left: 0,
    top: 0,
    alignItems: "flex-end",
    paddingBottom: 23,
    zIndex: 99999,
  },
  twoButtons: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.white,
    borderStyle: "solid",
    borderRadius: 100,
  },
  twoButtons__item: {
    borderRadius: 18,
    flexDirection: "row",
    // height: 32,
  },
  twoButtons__button: {
    paddingHorizontal: 18,
    alignItems: "center",
    paddingVertical: 8,
    flexDirection: "row",
  },
  twoButtons__selected: {
    backgroundColor: colors.white,
  },
  categoryInner: {
    width: 44,
    height: 44,
    borderRadius: 10,
    // shadowColor: 'rgba(153, 156, 173, 0.2)',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.33,
    // shadowRadius: 30,
    // elevation: 10,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "transparent",
  },
  categoryInner__icon: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  categoryWrapper: {
    marginRight: 0,
    alignItems: "center",
    width: 70,
  },
  tooltip: {
    shadowColor: "rgba(51, 42, 64, 0.15)",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.53,
    shadowRadius: 15,
    elevation: 24,
    backgroundColor: colors.white,
    position: "absolute",
    width: 110,
    paddingVertical: 5,
    paddingHorizontal: 11,
    top: -75,
    right: 0,
    borderRadius: 5,
  },
  tooltip__close: {
    position: "absolute",
    top: 5,
    right: 0,
  },
  square: {
    width: 13,
    height: 13,
    transform: [{ rotate: "45deg" }],
    position: "absolute",
    bottom: -12,
    backgroundColor: colors.white,
    left: "40%",
  },
  swiper__image: {
    width: "100%",
    height: 145,
    borderRadius: 10,
  },
  banner_ad: {
    width: "100%",
    height: 230,
    marginBottom: 20,
  },
  notificationModal: {
    width: (SCREEN_WIDTH / 100) * 90,
    height: SCREEN_HEIGHT / 1.7,
    backgroundColor: colors.white,
    borderRadius: 8,
    position: "relative",
    zIndex: 1000,
  },
  notificationModal__image: {
    width: "100%",
    height: (SCREEN_WIDTH / 100) * 70,
    borderRadius: 8,
  },
  notificationModal__button: {
    width: "50%",
    height: 45,
    marginTop: 30,
  },
  notificationModal__close: {
    position: "absolute",
    top: -13,
    right: -13,
    backgroundColor: colors.white,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    shadowColor: colors.darkBlue,
    zIndex: 1000,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.33,
    shadowRadius: 20,
    elevation: 24,
  },
  borderButton: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.orange,
    borderStyle: "solid",
  },
  select: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#8286B1",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 10,
    marginVertical: 10,
  },
  selectedButton: {
    backgroundColor: colors.navyBlue,
    borderColor: colors.navyBlue,
  },
  selectedOrange: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  registerIcon: {
    width: 110,
    height: 130,
  },
  modal__close: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1000,
  },
  generalShadow: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4.59,
    elevation: 5,
  },
});
