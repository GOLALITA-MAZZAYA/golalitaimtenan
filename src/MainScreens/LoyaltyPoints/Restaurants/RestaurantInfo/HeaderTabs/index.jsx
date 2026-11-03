import i18next from "i18next";
import {ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {colors} from "../../../../../components/colors";
import {TypographyText} from "../../../../../components/Typography";
import InfoSvg from '../../../../../assets/info.svg';
import GallerySvg from '../../../../../assets/gallery.svg';
import {isRTL} from "../../../../../../utils";
import React from "react";
import {SCREEN_WIDTH} from "../../../../../styles/mainStyles";
import {BALOO_2} from "../../../../../redux/types";
import {CONSTANTS} from "..";

const getTabs = () => {
 const tabs = [
    {
      key: CONSTANTS.INFO,
      label: i18next.t('Merchants.info'),
      icon: <InfoSvg />
    },
    {
      key: CONSTANTS.ORDER_TAB,
      label: i18next.t('Merchants.orderTab'),
      icon: <GallerySvg />
    },
    {
      key: CONSTANTS.GALLERY,
      label: i18next.t('Merchants.gallery'),
      icon: <GallerySvg />
    },
    // {
    //   key: CONSTANTS.RESTAURANT_MENU,
    //   label: i18next.t('Merchants.restaurantMenu'),
    //   icon: <GallerySvg />
    // },
  ];

  return tabs

};


const HeaderTabs = ({setActiveTab, activeTab}) => {
    const tabs = getTabs();
    const isRtl = isRTL();

    return (
      <View style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingBottom: 10,
          paddingTop: 25,
          backgroundColor: colors.loyaltyBackground
      }}>
      <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={tabs.length > 2}
          bounces={false}
          style={{padding: 4, borderRadius: 16, backgroundColor: colors.loyaltyCardBackground}}
        >
          {tabs.map(item => {

            const isActive = item.key === activeTab;

            return (
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    width: tabs.length === 2 ? (SCREEN_WIDTH / 2) - 28 : 'auto', 
                    gap: 10,
                    flexDirection: isRtl ? 'row-reverse': 'row',
                    backgroundColor: isActive ? colors.loyaltyPrimary : colors.loyaltyTabsBackground,
                    borderColor: isActive ?  'transparent': colors.loyaltyTabsBorder,
                    marginLeft: isRtl ? 8: 0, marginRight: isRtl? 0 : 8
                  },
                ]}
                onPress={() => setActiveTab(item.key)}
              >
                {item.icon &&
                   React.cloneElement(item.icon, {
                     color: isActive ?  colors.loyaltyActiveTabText : colors.loyaltyTextPrimary
                })}
                <TypographyText
                  textColor={isActive ?  colors.loyaltyActiveTabText : colors.loyaltyTextPrimary}
                  size={16}
                  style={{ fontWeight: '500' , marginLeft: isRtl ? 0: 4, marginRight: isRtl? 4 : 0}}
                  title={item.label}
                  font={BALOO_2}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        </View>
    )
};


const styles = StyleSheet.create({
  tab: {
    height: 46,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    flex: 1,
  },
});

export default HeaderTabs;