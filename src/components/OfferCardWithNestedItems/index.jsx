import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { TypographyText } from "../Typography";
import { BALOO_REGULAR, BALOO_SEMIBOLD } from "../../redux/types";
import { colors } from "../colors";
import { useTheme } from "../ThemeProvider";
import StartIcon from "../../assets/star.svg";
import { sized } from "../../Svg";
import FullScreenLoader from "../Loaders/FullScreenLoader";
import { getFlexDirection, isRTL } from "../../../utils";

const IMAGE_SIZE = 66;

const CardWithNesetedItems = (props) => {
  const { parentProps } = props;

  const { isDark } = useTheme();

  const StartIconSmall = sized(StartIcon, 22, 22);

  return (
    <TouchableOpacity
      onPress={() => parentProps.onPress()}
      style={[
        styles.wrapper,
        {
          backgroundColor: isDark ? colors.categoryGrey : "#F5F5F5",
        },
      ]}
    >
      <View
        style={[
          styles.image,
          {
            backgroundColor: isDark ? "#fff" : "#F5F5F5",
          },
        ]}
      >
        <ImageBackground
          source={{ uri: parentProps.uri }}
          style={styles.image}
        ></ImageBackground>
      </View>
      <View style={[styles.row, getFlexDirection()]}>
        <View
          style={[
            styles.infoWrapper,
            { flexDirection: isRTL() ? "row-reverse" : "row" },
          ]}
        >
          <TypographyText
            textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
            size={18}
            font={BALOO_SEMIBOLD}
            title={parentProps.name}
            style={styles.name}
            numberOfLines={2}
          />

          <View
            style={[
              styles.discountWrapper,
              {
                flexDirection: isRTL() ? "row-reverse" : "row",
                borderLeftWidth: isRTL() ? 0 : 1,
                borderRightWidth: isRTL() ? 1 : 0,
                borderLeftColor: isRTL()
                  ? "transparent"
                  : !isDark
                  ? colors.darkBlue
                  : "grey",
                borderRightColor: isRTL()
                  ? !isDark
                    ? colors.darkBlue
                    : colors.mainDarkMode
                  : "transparent",
              },
            ]}
          >
            <View style={styles.discountBlock}>
              {!!parentProps.description && !parentProps.loadingDescription && (
                <TypographyText
                  textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
                  size={14}
                  font={BALOO_REGULAR}
                  title={parentProps?.description}
                  style={{
                    alignSelf: isRTL() ? "flex-end" : "flex-start",
                  }}
                />
              )}
            </View>
            <TouchableOpacity onPress={() => parentProps.onPressFavourite()}>
              {parentProps.isSaved ? (
                <StartIconSmall
                  color={isDark ? colors.mainDarkMode : colors.darkBlue}
                  fill={isDark ? colors.mainDarkMode : colors.darkBlue}
                />
              ) : (
                <StartIconSmall
                  color={isDark ? colors.white : colors.darkBlue}
                  fill={isDark ? colors.white : "transparent"}
                />
              )}
            </TouchableOpacity>
          </View>

          {parentProps.loadingDescription && (
            <FullScreenLoader style={{ alignSelf: "flex-start" }} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4.59,
    elevation: 5,
    borderRadius: 10,
    marginHorizontal: 5,
    marginTop: 16,
    marginBottom: 16,
  },
  name: {
    flex: 1,
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  discountWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  valueText: {
    color: "#E32251",
  },
  image: {
    width: "100%",
    height: 150,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    flex: 1,
    resizeMode: "contain",
    overflow: "hidden",
  },
  infoWrapper: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: isRTL() ? "row-reverse" : "row",
    justifyContent: "space-between",

    padding: 6,
  },
  childWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#DDDFE4",
    padding: 8,
    marginTop: 16,
  },
  childInfoWrapper: {
    flex: 1,
    justifyContent: "space-around",
    height: IMAGE_SIZE,
    marginLeft: 8,
  },
  infoLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  loader: {
    marginTop: 16,
  },
  noDataText: {
    marginTop: 16,
    alignSelf: "center",
  },
  logo: {
    backgroundColor: "#fff",
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 4,
    padding: 4,
  },
  toggleBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
  discountBlock: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    flex: 1,
    // width:'100%'
  },
  loyaltyImage: {
    width: 50,
    height: 25,
  },
  newIcon: {
    position: "absolute",
    top: -10,
    right: -16,
    backgroundColor: "#E32251",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  newText: {
    color: "#fff",
  },
});

export default CardWithNesetedItems;
