import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../../components/colors";
import { isRTL } from "../../../../utils";
import { TypographyText } from "../../../components/Typography";
import { BALOO_2 } from "../../../redux/types";
import { useTranslation } from "react-i18next";


const HeaderTabs = ({ activeTab, setActiveTab }) => {
  const isRtl = isRTL();
  const { t } = useTranslation();

  const tabs = [
    {
      label: t('MyBookings.restaurantsTab'),
      value: 'restaurants'
    },
    {
        label: t('MyBookings.clinicsTab'),
        value: 'clinics'
    },
    {
        label: t('MyBookings.ordersTab'),
        value: 'orders'
    },
    {
      label: t('MyBookings.saloonsTab'),
      value: 'saloons'
    },
  ];

  return (
    <ScrollView horizontal={true} style={{ flexGrow: 0, marginBottom: 20 }} contentContainerStyle={styles.scrollView}>
      {tabs.map(item => {
        const isActive = item.value === activeTab;

        return <TouchableOpacity
          key={item.value}
          style={[
            styles.tab,
            {
              gap: 10,
              flexDirection: isRtl ? 'row-reverse' : 'row',
              backgroundColor: isActive ? colors.loyaltyPrimary : colors.loyaltyTabsBackground,
              borderColor: isActive ? 'transparent' : colors.loyaltyTabsBorder,
              marginLeft: isRtl ? 8 : 0, marginRight: isRtl ? 0 : 8
            },
          ]}
          onPress={() => setActiveTab(item.value)}
        >
          <TypographyText
            textColor={isActive ? colors.loyaltyActiveTabText : colors.loyaltyTextPrimary}
            size={16}
            style={{ fontWeight: '500', marginLeft: isRtl ? 0 : 4, marginRight: isRtl ? 4 : 0 }}
            title={item.label}
            font={BALOO_2}
          />
        </TouchableOpacity>
      })}

    </ScrollView>
  )
};

const styles = StyleSheet.create({
  tab: {
    height: 46,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
  },
  scrollView: {
    height: 48,
    marginBottom: 10,
    marginTop: 5,
    paddingVertical: 4,
    flexGrow: 0,
  }
});

export default HeaderTabs;