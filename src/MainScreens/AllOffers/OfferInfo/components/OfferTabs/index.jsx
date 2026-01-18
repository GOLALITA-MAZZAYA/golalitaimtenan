import { StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { useMemo, useState } from "react";
import { colors } from "../../../../../components/colors";
import { useTheme } from "../../../../../components/ThemeProvider";
import i18next from "i18next";
import { TypographyText } from "../../../../../components/Typography";
import OfferInfoTab from "./components/OfferInfoTab";
import BranchesInfoTab from "./components/BranchesInfoTab";
import { useTranslation } from "react-i18next";

const CONSTANTS = {
  INFO: "INFO",
  BRANCHES: "BRANCHES",
};

const TABS = [
  {
    key: CONSTANTS.INFO,
    label: i18next.t("Merchants.info"),
  },
  {
    key: CONSTANTS.BRANCHES,
    label: i18next.t("Merchants.branches"),
  },
];

const getTabs = () => {
  return TABS;
};

const OfferTabs = ({ offer }) => {
  const [activeTab, setActiveTab] = useState(CONSTANTS.INFO);
  const { isDark } = useTheme();
  const { i18n } = useTranslation();
  const language = i18n.language;

  const isRTL = () => i18next.dir(i18next.language) === "rtl";

  const tabs = useMemo(() => getTabs(), [language]);

  console.log(offer, "offer");

  return (
    <>
      <View
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
          paddingTop: 15,
        }}
      >
        {tabs.map((item) => {
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
                style={{ fontWeight: "700" }}
                title={item.label}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {activeTab === CONSTANTS.INFO && (
        <OfferInfoTab offer={offer} bookNow={offer.offer_type === "b1g1"} />
      )}

      {activeTab === CONSTANTS.BRANCHES && (
        <BranchesInfoTab branches={offer.branches} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    borderBottomWidth: 2.5,
  },
});

export default OfferTabs;
