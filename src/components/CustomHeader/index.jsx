import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import BackSvg from "../../assets/back.svg";
import { BALOO_SEMIBOLD } from "../../redux/types";
import { Text } from "react-native";
import { useTheme } from "../ThemeProvider";
import { colors } from "../colors";

const IconComponent = ({ onPress, icon }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconWrapper}>
      {typeof icon === "function" ? icon?.() : icon}
    </TouchableOpacity>
  );
};

const CustomHeader = ({
  onLeftBtnPress,
  onRightBtnPress,
  leftBtn = "back",
  rightBtn,
  title,
}) => {
  const { isDark } = useTheme();
  const iconColor = isDark ? "#fff" : "#312B3E";

  const ICONS = {
    back: <BackSvg color={iconColor} />,
  };

  const renderLeftComponent = () => {
    if (!leftBtn) {
      return null;
    }

    const Icon = typeof leftBtn === "string" ? ICONS[leftBtn] : leftBtn;

    return <IconComponent onPress={onLeftBtnPress} icon={Icon} />;
  };

  const renderRightComponent = () => {
    if (!rightBtn) {
      return null;
    }

    return (
      <IconComponent
        onPress={onRightBtnPress}
        icon={typeof rightBtn === "string" ? ICONS[rightBtn] : rightBtn}
      />
    );
  };

  return (
    <View style={styles.wrapper}>
      {renderLeftComponent()}
      <View style={styles.titleWrapper}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            { color: isDark ? colors.white : colors.darkBlue },
          ]}
        >
          {title}
        </Text>
      </View>

      {renderRightComponent()}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: BALOO_SEMIBOLD,
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  titleWrapper: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default CustomHeader;
