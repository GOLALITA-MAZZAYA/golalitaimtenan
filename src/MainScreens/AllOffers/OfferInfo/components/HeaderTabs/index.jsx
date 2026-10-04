import i18next from "i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../../../../../components/colors";
import { TypographyText } from "../../../../../components/Typography";
import { isRTL } from "../../../../../../utils";
import React, { useEffect } from "react";
import { OFFER_TAB_CONSTANTS } from "../../config";
import InfoSvg from "../../../../../assets/info.svg";
import DiscountSvg from "../../../../../assets/discountLabel.svg";
import { BALOO_2 } from "../../../../../redux/types";
import { useTheme } from "../../../../../components/ThemeProvider";

const getTabs = (hasOtherOffers) => {
  if (!hasOtherOffers) {
    return [];
  }

  return [
    {
      key: OFFER_TAB_CONSTANTS.INFO,
      label: i18next.t("OfferInfo.info", "Info"),
      icon: <InfoSvg />,
    },
    {
      key: OFFER_TAB_CONSTANTS.OFFERS,
      label: i18next.t("OfferInfo.otherOffers", "Other Offers"),
      icon: <DiscountSvg />,
    },
  ];
};

const HeaderTabs = ({ setActiveTab, activeTab, hasOtherOffers }) => {
  const tabs = getTabs(hasOtherOffers);
  const isRtl = isRTL();
  const { isDark } = useTheme();

  useEffect(() => {
    if (!activeTab || !tabs.some((t) => t.key === activeTab)) {
      if (tabs[0]) {
        setActiveTab(tabs[0].key);
      }
    }
  }, [tabs]);

  if (tabs.length <= 1) {
    return null;
  }

  const screenBg = isDark ? colors.darkBlue : colors.white;
  const activeBg = isDark ? colors.mainDarkMode : colors.darkBlue;
  const activeText = isDark ? colors.mainDarkModeText : colors.white;
  const inactiveText = isDark ? colors.mainDarkMode : colors.darkBlue;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: screenBg,
        },
      ]}
    >
      <View
        style={[
          styles.capsule,
          {
            backgroundColor: screenBg,
            borderColor: isDark ? colors.mainDarkMode : colors.darkBlue,
          },
        ]}
      >
        {tabs.map((item) => {
          const isActive = item.key === activeTab;
          const currentTextColor = isActive ? activeText : inactiveText;

          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.8}
              style={[
                styles.tab,
                {
                  flexDirection: isRtl ? "row-reverse" : "row",
                  backgroundColor: isActive ? activeBg : "transparent",
                },
              ]}
              onPress={() => setActiveTab(item.key)}
            >
              {item.icon &&
                React.cloneElement(item.icon, {
                  color: currentTextColor,
                  width: 18,
                  height: 18,
                })}
              <TypographyText
                textColor={currentTextColor}
                size={15}
                style={{
                  fontWeight: "700",
                  marginLeft: isRtl ? 0 : 6,
                  marginRight: isRtl ? 6 : 0,
                }}
                title={item.label}
                font={BALOO_2}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 14,
  },
  capsule: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  tab: {
    height: 42,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default HeaderTabs;
