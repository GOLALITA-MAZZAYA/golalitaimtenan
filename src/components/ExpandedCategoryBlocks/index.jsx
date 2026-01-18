import { useState } from "react";
import {
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { TypographyText } from "../Typography";
import { colors } from "../colors";
import { BALOO_SEMIBOLD } from "../../redux/types";
import FastImage from "react-native-fast-image";
import { StyleSheet } from "react-native";
import { sized } from "../../Svg";
import ArrowDownSvg from "../../assets/arrow_down_thin.svg";
import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";
import { isRTL } from "../../../utils";

const { width } = Dimensions.get("screen");
const itemWidth = (width - 66) / 3;
const ArrowDownIcon = sized(ArrowDownSvg, 15, 15, "#027DC1");

function ExpandedCategoryBlocks(props) {
  const {
    title,
    onPress,
    data,
    style,
    isDark,
    renderAdditionalItem,
    renderIcon,
    pagination,
  } = props;
  const [isShownAllItems, setIsShownAllItems] = useState(false);
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  const isShowMoreBtn = data?.length > 6;

  const newData = isShowMoreBtn && !isShownAllItems ? data.slice(0, 6) : data;

  const handleCollapseBtnPress = () => {
    setIsShownAllItems((prevVal) => !prevVal);
  };

  const handleOnShowMorePress = () => {
    if (!isShownAllItems) {
      setIsShownAllItems(true);
    }

    pagination?.onShowMorePress();
  };

  const handleOnShowLessPress = () => {
    setIsShownAllItems(false);
    pagination?.onShowLessPress();
  };

  return (
    <View style={style}>
      <View style={styles.titleWrapper}>
        <TypographyText
          textColor={isDark ? colors.white : colors.darkBlue}
          size={20}
          font={BALOO_SEMIBOLD}
          title={title}
        />
        <View
          style={[
            styles.itemsWrapper,
            { justifyContent: isRTL() ? "flex-end" : "flex-start" },
          ]}
        >
          {newData?.map((item) => (
            <TouchableOpacity
              onPress={() => onPress(item.id, item.parent_id?.[0], item)}
              style={styles.item}
              key={item.id}
            >
              {item.image_icon && (
                <FastImage
                  source={{
                    uri: item.image_icon,
                  }}
                  style={styles.logo}
                />
              )}
              {renderIcon && renderIcon(item)}

              <LinearGradient
                style={styles.nameWrapper}
                colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0)"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
              >
                <TypographyText
                  textColor={colors.white}
                  size={12}
                  font={BALOO_SEMIBOLD}
                  title={language === "ar" ? item.x_name_arabic : item.name}
                  style={styles.name}
                  numberOfLines={2}
                />
              </LinearGradient>
              {renderAdditionalItem && renderAdditionalItem(item)}
            </TouchableOpacity>
          ))}
          {isShowMoreBtn && !pagination && (
            <TouchableOpacity
              onPress={handleCollapseBtnPress}
              style={styles.collapseBtn}
            >
              <TypographyText
                textColor="#027DC1"
                size={14}
                font={BALOO_SEMIBOLD}
                title={t(
                  !isShownAllItems ? "General.viewAll" : "General.viewLess"
                )}
                style={{ marginRight: 4 }}
              />

              <View
                style={{
                  transform: [{ rotate: isShownAllItems ? "180deg" : "0deg" }],
                }}
              >
                <ArrowDownIcon />
              </View>
            </TouchableOpacity>
          )}
          {pagination?.loading && (
            <View style={styles.loaderWrapper}>
              <ActivityIndicator style={{ alignSelf: "center" }} />
            </View>
          )}
        </View>
        {(pagination?.isShowLessVisible || pagination?.isShowMoreVisible) && (
          <View style={styles.paginationBtns}>
            {pagination?.isShowLessVisible && (
              <TouchableOpacity
                onPress={handleOnShowLessPress}
                style={styles.paginationBtn}
              >
                <TypographyText
                  textColor="#027DC1"
                  size={14}
                  font={BALOO_SEMIBOLD}
                  title={t("General.showLess")}
                  style={{ marginRight: 4 }}
                />
                <View style={{ transform: [{ rotate: "180deg" }] }}>
                  <ArrowDownIcon />
                </View>
              </TouchableOpacity>
            )}
            {pagination?.isShowMoreVisible && (
              <TouchableOpacity
                onPress={handleOnShowMorePress}
                style={styles.paginationBtn}
              >
                <TypographyText
                  textColor="#027DC1"
                  size={14}
                  font={BALOO_SEMIBOLD}
                  title={t("General.showMore")}
                  style={{ marginRight: 4 }}
                />
                <ArrowDownIcon />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleWrapper: {
    marginBottom: 16,
  },
  itemsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    width: itemWidth,
    marginRight: 8,
    position: "relative",
    marginTop: 16,
  },
  logo: {
    width: itemWidth,
    height: itemWidth,
    borderRadius: 8,
  },
  nameWrapper: {
    position: "absolute",
    height: 58,
    width: "100%",
    justifyContent: "flex-end",
    padding: 10,
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  name: {},
  collapseBtn: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loaderWrapper: {
    width: "100%",
    justifyContent: "center",
    marginTop: 16,
  },
  paginationBtns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  paginationBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ExpandedCategoryBlocks;
