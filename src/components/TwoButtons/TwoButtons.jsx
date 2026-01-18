import React from "react";
import { mainStyles } from "../../styles/mainStyles";
import { TouchableOpacity, View } from "react-native";
import { colors } from "../colors";
import { TypographyText } from "../Typography";
import { LUSAIL_REGULAR } from "../../redux/types";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "../ThemeProvider";
import { isRTL } from "../../../utils";

const TwoButtons = ({
  icon1,
  icon2,
  icon3,
  label1,
  label2,
  label3,
  onPress1,
  onPress2,
  onPress3,
  selectedButton,
  isLight,
  isWhite,
}) => {
  const { isDark } = useTheme();

  const iconColor = isDark ? colors.white : colors.darkBlue;
  const iconPassiveColor = isDark ? colors.white : "#999CAD";

  return (
    <View style={mainStyles.centeredRow}>
      <View
        style={[
          mainStyles.twoButtons,
          {
            borderColor: isDark
              ? isLight
                ? "#444444"
                : colors.transparent
              : isWhite
              ? colors.white
              : colors.grey,
            marginVertical: 25,
            flexDirection: isRTL() ? "row-reverse" : "row",
          },
          isDark && {
            backgroundColor: isLight ? colors.transparent : "#444444",
          },
        ]}
      >
        <LinearGradient
          style={[
            mainStyles.twoButtons__item,
            selectedButton === 0 && { transform: [{ translateX: -1 }] },
          ]}
          colors={
            selectedButton === 0
              ? isDark
                ? isLight
                  ? [colors.darkBlue, colors.darkBlue]
                  : [colors.darkModeBackground, colors.darkModeBackground]
                : isWhite
                ? [colors.white, colors.white]
                : [colors.darkBlue, colors.darkBlue]
              : [colors.transparent, colors.transparent]
          }
        >
          <TouchableOpacity
            onPress={onPress1}
            style={mainStyles.twoButtons__button}
          >
            {icon1}
            <TypographyText
              textColor={
                selectedButton === 0
                  ? isWhite
                    ? iconColor
                    : isDark
                    ? colors.mainDarkMode
                    : "white"
                  : isLight
                  ? isWhite
                    ? iconPassiveColor
                    : iconPassiveColor
                  : colors.white
              }
              size={12}
              font={LUSAIL_REGULAR}
              title={label1}
              style={{ marginLeft: 5, fontWeight: "700" }}
            />
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          style={[
            mainStyles.twoButtons__item,
            selectedButton === 1 && { transform: [{ translateX: 1 }] },
          ]}
          colors={
            selectedButton === 1
              ? isDark
                ? isLight
                  ? [colors.secBlue, colors.secBlue]
                  : [colors.darkModeBackground, colors.darkModeBackground]
                : isWhite
                ? [colors.white, colors.white]
                : [colors.darkBlue, colors.darkBlue]
              : [colors.transparent, colors.transparent]
          }
        >
          <TouchableOpacity
            onPress={onPress2}
            style={mainStyles.twoButtons__button}
          >
            {icon2}
            <TypographyText
              textColor={
                selectedButton === 1
                  ? isWhite
                    ? iconColor
                    : isDark
                    ? colors.mainDarkMode
                    : "white"
                  : isLight
                  ? isWhite
                    ? iconPassiveColor
                    : iconPassiveColor
                  : colors.white
              }
              size={12}
              font={LUSAIL_REGULAR}
              title={label2}
              style={{ marginLeft: 5, fontWeight: "700" }}
            />
          </TouchableOpacity>
        </LinearGradient>
        {label3 && (
          <LinearGradient
            style={[
              mainStyles.twoButtons__item,
              selectedButton === 2 && { transform: [{ translateX: 1 }] },
            ]}
            colors={
              selectedButton === 2
                ? isDark
                  ? isLight
                    ? [colors.secBlue, colors.secBlue]
                    : [colors.darkModeBackground, colors.darkModeBackground]
                  : isWhite
                  ? [colors.white, colors.white]
                  : [colors.darkBlue, colors.darkBlue]
                : [colors.transparent, colors.transparent]
            }
          >
            <TouchableOpacity
              onPress={onPress3}
              style={mainStyles.twoButtons__button}
            >
              {icon3}
              <TypographyText
                textColor={
                  selectedButton === 2
                    ? isWhite
                      ? iconColor
                      : isDark
                      ? colors.mainDarkMode
                      : "white"
                    : isLight
                    ? isWhite
                      ? iconPassiveColor
                      : iconPassiveColor
                    : colors.white
                }
                size={12}
                font={LUSAIL_REGULAR}
                title={label3}
                style={{ marginLeft: 5, fontWeight: "700" }}
              />
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View>
    </View>
  );
};

export default TwoButtons;
