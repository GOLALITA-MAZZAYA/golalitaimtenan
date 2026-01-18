import React from "react";
import Svg, { Circle } from "react-native-svg";
import { colors } from "../../../components/colors";
import { mainStyles, SCREEN_WIDTH } from "../../../styles/mainStyles";
import { Image, Linking, View } from "react-native";
import sized from "../../../Svg/sized";
import ProductSvg from "../../../assets/products_orange.svg";
import RestaurantsSvg from "../../../assets/restaurants_board.svg";
import OthersSvg from "../../../assets/others_board.svg";
import { BALOO_SEMIBOLD } from "../../../redux/types";
import { TypographyText } from "../../../components/Typography";
import { useTheme } from "../../../components/ThemeProvider";
import { getColor, isRTL } from "../../../../utils";
import CommonButton from "../../../components/CommonButton/CommonButton";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

const DashboardCircle = ({ percents, currentIndex, item }) => {
  const { isDark } = useTheme();
  let ALL_PRECENTS = 822;
  const makeRandomColor = () => {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  return (
    <View>
      <View
        style={[
          mainStyles.centeredRow,
          { top: "38%", position: "absolute", left: SCREEN_WIDTH / 2 - 25 },
        ]}
      >
        <Image
          style={[mainStyles.categoryInner__icon, { borderRadius: 0 }]}
          source={{ uri: item.image2_url ?? item.image_url }}
        />
      </View>
      <Svg className="svg" width={SCREEN_WIDTH} height={SCREEN_WIDTH}>
        <Circle
          stroke={isDark ? colors.transparent : colors.lightGrey}
          cx={SCREEN_WIDTH / 2}
          cy={SCREEN_WIDTH / 2}
          r={130}
          strokeWidth={60}
        />
        {percents.map((percent, index) => {
          let all = 0;
          percents.forEach((p, i) => {
            if (i < index) {
              all += p.percent;
            }
          });
          let offset = (360 * all) / 100;
          return (
            <React.Fragment key={index}>
              <Circle
                key={index}
                stroke={
                  index === currentIndex
                    ? getColor(item.id)
                    : isDark
                    ? colors.secBlue
                    : colors.lightGrey
                }
                cx={SCREEN_WIDTH / 2}
                cy={SCREEN_WIDTH / 2}
                r={130}
                strokeWidth={index === currentIndex ? 80 : 60}
                strokeDasharray={`${130 * 2 * Math.PI} ${130 * 2 * Math.PI}`}
                transform={`rotate(${-90 + offset} ${SCREEN_WIDTH / 2} ${
                  SCREEN_WIDTH / 2
                })`}
                strokeDashoffset={
                  (ALL_PRECENTS / 100) * (100 - percent.percent)
                }
              />
              {/*{!(index === currentIndex || index - 1 === currentIndex) && <Circle*/}
              {/*  stroke={isDark ? colors.darkBlue : colors.white}*/}
              {/*  cx={SCREEN_WIDTH / 2}*/}
              {/*  cy={SCREEN_WIDTH / 2}*/}
              {/*  r={130}*/}
              {/*  strokeWidth={60}*/}
              {/*  transform={`rotate(${-90 + offset} ${SCREEN_WIDTH / 2} ${SCREEN_WIDTH / 2})`}*/}
              {/*  strokeDasharray={`${130 * 2 * Math.PI} ${130 * 2 * Math.PI}`}*/}
              {/*  strokeDashoffset={(ALL_PRECENTS / 100 * (100 - 0.2))}*/}
              {/*/>}*/}
            </React.Fragment>
          );
        })}
      </Svg>
      <View style={{ alignItems: "center" }}>
        <TypographyText
          textColor={isDark ? colors.white : colors.darkBlue}
          size={18}
          font={BALOO_SEMIBOLD}
          title={isRTL() ? item.name_ar ?? item.name : item.name}
        />
        <TypographyText
          textColor={isDark ? colors.white : colors.darkBlue}
          size={24}
          font={BALOO_SEMIBOLD}
          title={`QAR 0`}
        />
      </View>
    </View>
  );
};

export default DashboardCircle;
