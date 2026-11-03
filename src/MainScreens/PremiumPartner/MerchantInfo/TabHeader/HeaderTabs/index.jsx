import i18next from "i18next";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../../../../../components/colors";
import { TypographyText } from "../../../../../components/Typography";
import { CONSTANTS } from "../..";
import InfoSvg from '../../../../../assets/info.svg';
import ChartLineSvg from '../../../../../assets/chartLine.svg';
import DiscountSvg from '../../../../../assets/discountLabel.svg';
import { isRTL } from "../../../../../../utils";
import React, { useEffect } from "react";
import { SCREEN_WIDTH } from "../../../../../styles/mainStyles";
import { BALOO_2 } from "../../../../../redux/types";

import { useTheme } from "../../../../../components/ThemeProvider";

const getTabs = (isBusinessHotel, hasOffers) => {
  const tabs = [];

  if (isBusinessHotel) {
    tabs.push(
      {
        key: CONSTANTS.ROOM_RATES,
        label: i18next.t('Merchants.roomRates'),
        icon: <ChartLineSvg />
      },
      {
        key: CONSTANTS.INFO,
        label: i18next.t('Merchants.info'),
        icon: <InfoSvg />
      }
    );
  } else if (hasOffers) {
    tabs.push(
      {
        key: CONSTANTS.INFO,
        label: i18next.t('Merchants.info', 'Info'),
        icon: <InfoSvg />
      },
      {
        key: CONSTANTS.OFFERS,
        label: i18next.t('Merchants.offers', 'Offers'),
        icon: <DiscountSvg />
      }
    );
  }

  return tabs;
};

const HeaderTabs = ({ setActiveTab, activeTab, isBusinessHotel, hasOffers }) => {
  const tabs = getTabs(isBusinessHotel, hasOffers);
  const isRtl = isRTL();
  const { isDark } = useTheme();

  useEffect(() => {
    if (!activeTab || !tabs.some((t) => t.key === activeTab)) {
      if (tabs[0]) {
        setActiveTab(tabs[0].key);
      }
    }
  }, [tabs]);

  const activeBg = isDark ? colors.mainDarkMode : colors.darkBlue;
  const activeText = isDark ? '#000000' : '#FFFFFF';
  const inactiveText = isDark ? '#8E8E93' : '#6B7280';

  if (tabs.length === 0) {
    return null;
  }

  return (
    <View style={{
      paddingHorizontal: 20,
      paddingBottom: 10,
      paddingTop: 16,
      backgroundColor: isDark ? colors.darkModeBackground : colors.white,
    }}>
      <View
        style={[
          styles.capsule,
          {
            backgroundColor: isDark ? '#1C1C1E' : '#F5F5F7',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
          },
        ]}
      >
        {tabs.map(item => {
          const isActive = item.key === activeTab;
          const currentTextColor = isActive ? activeText : inactiveText;

          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.8}
              style={[
                styles.tab,
                {
                  flexDirection: isRtl ? 'row-reverse' : 'row',
                  backgroundColor: isActive ? activeBg : 'transparent',
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
                style={{ fontWeight: '700', marginLeft: isRtl ? 0 : 6, marginRight: isRtl ? 6 : 0 }}
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
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
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