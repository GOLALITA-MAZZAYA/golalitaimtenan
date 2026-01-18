import i18next from "i18next";
import {ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {colors} from "../../../../../components/colors";
import {useTheme} from "../../../../../components/ThemeProvider";
import {TypographyText} from "../../../../../components/Typography";
import {CONSTANTS} from "../..";

const getTabs = (isBusinessHotel) => {
 const tabs = [
    {
      key: CONSTANTS.INFO,
      label: i18next.t('Merchants.info'),
    },
    {
      key: CONSTANTS.LOCATION,
      label: i18next.t('Merchants.location'),
    },
  ];

  if(!isBusinessHotel){
    tabs.push({
      key: CONSTANTS.OFFERS,
      label: i18next.t('Merchants.offers'),
    })
  }

  if(isBusinessHotel){
    tabs.push({
      key: CONSTANTS.ROOM_RATES,
      label: i18next.t('Merchants.roomRates'),
    })
  }

  return tabs

};


const HeaderTabs = ({setActiveTab, activeTab, isBusinessHotel}) => {
    const {isDark} = useTheme();
    const tabs = getTabs(isBusinessHotel);

    return (
      <View style={{
          flex: 1,
          backgroundColor: isDark ? colors.navyBlue : '#fff',
          paddingHorizontal: 20,
          paddingBottom: 10
      }}>
      <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          bounces={false}
        >
          {tabs.map(item => {
            const color = isDark ? colors.mainDarkMode : colors.darkBlue;
            const activeBorder = isDark ? colors.mainDarkMode : colors.darkBlue;
            const passiveBorder = isDark ? colors.borderGrey : colors.lightGrey;

            return (
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    borderColor:
                      item.key === activeTab ? activeBorder : passiveBorder,
                  },
                ]}
                onPress={() => setActiveTab(item.key)}
              >
                <TypographyText
                  textColor={color}
                  size={15}
                  style={{ fontWeight: '700' }}
                  title={item.label}
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
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 20,
    borderRadius: 6,
  },
});

export default HeaderTabs;