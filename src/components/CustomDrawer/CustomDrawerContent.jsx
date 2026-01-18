import React from "react";
import { StyleSheet } from "react-native";
import CustomDrawer from "./CustomDrawer";
import { colors } from "../colors";

const CustomDrawerContent = ({ navigation, descriptors, state }) => {
  let focusedOptions = descriptors[state.routes[state.index].key].options;
  let routeName =
    state.routes[state.routes.length - 1]?.state?.routes[0]?.state?.routes[
      state.routes[state.routes.length - 1]?.state?.routes[0]?.state?.routes
        ?.length - 1
    ]?.name;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return <CustomDrawer routeName={routeName} styles={styles} />;
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  drawer: {
    paddingRight: 10,
    flex: 1,
  },
  close: {},

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 11,
  },
  bottom: {
    marginBottom: 30,
  },
  imgWrapper: {
    position: "relative",
    marginRight: 11,
    padding: 1,
    backgroundColor: colors.white,
    borderRadius: 50,
  },
  premiumIcon: {
    position: "absolute",
    top: -5,
    left: 0,
  },
  img: {
    width: 44,
    height: 44,
    borderRadius: 50,
  },
  lang: {
    width: 34,
    height: 26,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#fff",
  },
  iconWrapper: {
    marginRight: 0,
    width: 25,
  },
});
