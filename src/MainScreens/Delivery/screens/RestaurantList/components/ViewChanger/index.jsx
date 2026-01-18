import React from "react";
import { StyleSheet, View } from "react-native";
import Toggle from "react-native-toggle-element";
import { colors } from "../../../../../../components/colors";
import { ListIcon, BlockIcon } from "../../../../../../assets/delivery_assets";
import { VIEW_CONSTANTS } from "./config";
import { TypographyText } from "../../../../../../components/Typography";
import { BALOO_SEMIBOLD } from "../../../../../../redux/types";
import { useTranslation } from "react-i18next";

const ViewChanger = ({ onChange, value = VIEW_CONSTANTS.LIST, isDark }) => {
  const { t } = useTranslation();
  const listColor =
    value === VIEW_CONSTANTS.LIST
      ? colors.white
      : isDark
      ? colors.white
      : colors.grey;
  const blockColor =
    value === VIEW_CONSTANTS.BLOCK
      ? colors.white
      : isDark
      ? colors.white
      : colors.grey;

  const leftComponent = (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <ListIcon color={listColor} />
      <TypographyText
        title={t("RestaurantList.list")}
        textColor={listColor}
        size={14}
        font={BALOO_SEMIBOLD}
        style={{ marginLeft: 6 }}
      />
    </View>
  );

  const rightComponent = (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <BlockIcon color={blockColor} />
      <TypographyText
        title={t("RestaurantList.block")}
        textColor={blockColor}
        size={14}
        font={BALOO_SEMIBOLD}
        style={{ marginLeft: 6 }}
      />
    </View>
  );

  return (
    <Toggle
      value={value === VIEW_CONSTANTS.LIST ? false : true}
      onPress={(val) =>
        onChange(val ? VIEW_CONSTANTS.BLOCK : VIEW_CONSTANTS.LIST)
      }
      trackBar={{
        ...styles.trackBar,
        inActiveBackgroundColor: isDark ? colors.darkBlue : colors.white,
        activeBackgroundColor: isDark ? colors.darkBlue : colors.white,
      }}
      thumbButton={{
        ...styles.thumbBtn,

        activeBackgroundColor: isDark ? "#0B177E" : colors.darkBlue,
        inActiveBackgroundColor: isDark ? "#0B177E" : colors.darkBlue,
      }}
      leftComponent={leftComponent}
      rightComponent={rightComponent}
    />
  );
};

const styles = StyleSheet.create({
  trackBar: {
    borderActiveColor: colors.darkBlue,
    borderInActiveColor: colors.darkBlue,
    borderWidth: 2,
    radius: 20,
    height: 40,
  },
  thumbBtn: {
    height: 40,
    width: 80,
    padding: 5,
    radius: 20,
  },
});

export default ViewChanger;
