import i18next from "i18next";
import {ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {colors} from "../../../../../../components/colors";
import {TypographyText} from "../../../../../../components/Typography";
import {CONSTANTS} from "../..";
import InfoSvg from '../../../../../../assets/clinics/info.svg';
import DoctorSvg from '../../../../../../assets/clinics/doctor.svg';
import {isRTL} from "../../../../../../../utils";
import React from "react";
import {SCREEN_WIDTH} from "../../../../../../styles/mainStyles";
import {BALOO_2} from "../../../../../../redux/types";


const getTabs = () => {
 const tabs = [
    {
      key: CONSTANTS.DOCTORS,
      label: i18next.t('Clinics.doctorsTab'),
      icon: <DoctorSvg />
    },
    {
      key: CONSTANTS.INFO,
      label: i18next.t('Clinics.infoTab'),
      icon: <InfoSvg />
    },
  ];

  return tabs

};


const HeaderTabs = ({setActiveTab, activeTab,}) => {
    const tabs = getTabs();
    const isRtl = isRTL();

    return (
      <View style={[styles.wrapper,{
          backgroundColor: colors.loyaltyBackground
      }]}>
      <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={tabs.length > 2}
          bounces={false}
          style={{paddingVertical: 4, borderRadius: 16, backgroundColor: colors.loyaltyCardBackground}}
        >
          {tabs.map(item => {

            const isActive = item.key === activeTab;

            return (
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    width: tabs.length === 2 ? (SCREEN_WIDTH / 2) - 28 : 'auto', 
                    flexDirection: isRtl ? 'row-reverse': 'row',
                    backgroundColor: isActive ? colors.loyaltyPrimary : colors.loyaltyTabsBackground,
                    borderColor: isActive ?  'transparent': colors.loyaltyTabsBorder,
                    marginLeft: isRtl ? 5: 4, marginRight: isRtl? 0 : 5
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
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 25,
  }, 
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