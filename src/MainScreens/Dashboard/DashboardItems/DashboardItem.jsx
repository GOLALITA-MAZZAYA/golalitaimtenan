import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { mainStyles } from "../../../styles/mainStyles";
import { TypographyText } from "../../../components/Typography";
import { colors } from "../../../components/colors";
import { BALOO_REGULAR, BALOO_SEMIBOLD } from "../../../redux/types";
import CloseSvg from "../../../assets/small_close.svg";
import { sized } from "../../../Svg";
import { useTheme } from "../../../components/ThemeProvider";
import { useTranslation } from "react-i18next";
import { getFlexDirection, isRTL } from "../../../../utils";

const CloseIcon = sized(CloseSvg, 13);

const DashboardItem = ({
  item,
  isPressed,
  setPressedItem,
  index,
  setSelectedScreen,
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => setSelectedScreen(1, index)}
      style={[mainStyles.betweenRow, { marginBottom: 20 }, getFlexDirection()]}
    >
      <View style={[mainStyles.row, getFlexDirection()]}>
        {/*<View style={[mainStyles.categoryInner]}>*/}
        {/*  {item.icon}*/}
        <Image
          source={{ uri: item.image_url }}
          style={mainStyles.categoryInner__icon}
        />
        {/*</View>*/}
        <TypographyText
          textColor={isDark ? colors.white : colors.darkBlue}
          size={14}
          font={BALOO_REGULAR}
          title={isRTL() ? item.x_name_arabic : item.name}
          style={[isRTL() ? { marginRight: 10 } : { marginLeft: 10 }]}
        />
      </View>
      <TouchableOpacity onPress={() => setPressedItem(index)}>
        <TypographyText
          textColor={isDark ? colors.white : colors.darkBlue}
          size={14}
          font={BALOO_REGULAR}
          title={"QAR 0"}
        />
      </TouchableOpacity>
      {isPressed && (
        <View
          style={[
            mainStyles.tooltip,
            isDark && { backgroundColor: colors.secBlue },
          ]}
        >
          <TouchableOpacity onPress={() => setPressedItem(null)}>
            <CloseIcon style={mainStyles.tooltip__close} />
            <View
              style={[
                mainStyles.square,
                isDark && { backgroundColor: colors.secBlue },
              ]}
            />
            <TypographyText
              textColor={colors.red}
              size={14}
              font={BALOO_SEMIBOLD}
              title="QAR 3000"
              style={{ textDecorationLine: "line-through" }}
            />
            <TypographyText
              textColor={colors.green}
              size={14}
              font={BALOO_SEMIBOLD}
              title="QAR 2 567"
            />
            <TypographyText
              textColor={isDark ? colors.white : colors.darkBlue}
              size={10}
              font={BALOO_REGULAR}
              title={`${t("Dashboard.youSaved")} 433 (23%)`}
            />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default DashboardItem;
