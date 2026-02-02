import React from "react";
import TabsProvider, { useTabsContext } from "./TabsContext";
import { TypographyText } from "../Typography";
import { useTheme } from "../ThemeProvider";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { colors } from "../colors";
import { BALOO_REGULAR } from "../../redux/types";
import { View } from "react-native";
import {isRTL} from "../../../utils";

const Tabs = ({ children, onTabChange = () => {}, defaultActiveTab, style }) => {
  const { isDark } = useTheme();
  const isRtl = isRTL();

  const tabs = React.Children.map(children, (child) => {
    if (!child.props.children) {
      return child;
    }
  });

  const contents = React.Children.map(children, (child) => {
    if (child.props.children) {
      return child;
    }
  });

  return (
    <TabsProvider onTabChange={onTabChange} defaultActiveTab={defaultActiveTab}>
      <View
        style={[
          styles.wrapper,
          { borderColor: colors.loyaltyMainBorder,
            flexDirection: isRtl ? 'row-reverse': 'row',
            backgroundColor: colors.loyaltyCardBackground,
          },
          style
  
        ]}
      >
        {tabs}
      </View>
      {contents}
    </TabsProvider>
  );
};

Tabs.Title = ({ name, title }) => {
  const { isDark } = useTheme();
  const { activeTab, setActiveTab } = useTabsContext();

  const mainColor = isDark ? colors.mainDarkMode : colors.darkBlue;

  const isActive = activeTab === name;

  return (
    <TouchableOpacity
      onPress={() => setActiveTab(name)}
      style={[styles.item, isActive && { backgroundColor: mainColor }]}
    >
      <TypographyText
        title={title}
        textColor={isDark ? colors.white : colors.darkBlue}
        size={16}
        font={BALOO_REGULAR}
        style={[{ fontWeight: "700" }, isActive && styles.activeItemText]}
      />
    </TouchableOpacity>
  );
};

Tabs.Tab = ({ name, title, style }) => {
  const { isDark } = useTheme();
  const { activeTab, setActiveTab } = useTabsContext();
  const mainColor = isDark ? colors.mainDarkMode : colors.darkBlue;

  const isActive = activeTab === name;
  const activeStyle = isDark ? styles.activeItemText: styles.activeItemTextLight;



  return (
    <TouchableOpacity
      onPress={() => setActiveTab(name)}
      style={[styles.tabItem, isActive && { borderColor: mainColor }, style]}
    >
      <TypographyText
        title={title}
        textColor={isDark ? colors.white : colors.darkBlue}
        size={16}
        font={BALOO_REGULAR}
        style={[{ fontWeight: "700" }, isActive && activeStyle]}
      />
    </TouchableOpacity>
  );
};

Tabs.TabWithIcon = ({ name, title, style, icon }) => {
  const { isDark } = useTheme();
  const { activeTab, setActiveTab } = useTabsContext();

  const mainColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const inactiveColor = colors.loyaltyPrimary;

  const isActive = activeTab === name;
  const activeStyle = isDark ? styles.activeItemText: styles.activeItemTextLight;
  const isRtl = isRTL();

  return (
    <TouchableOpacity
      onPress={() => setActiveTab(name)}
      style={[
        styles.tabWithIcon,
        isActive && { borderColor: mainColor },
        style,
        { backgroundColor: isActive ? colors.loyaltyPrimary : colors.loyaltyTabsBackground,
          borderColor: isActive ?  'transparent': colors.loyaltyTabsBorder,
          flexDirection: isRtl ? "row-reverse" : "row",
          marginHorizontal: 5
        } 
      ]}
    >
      {icon &&
        React.cloneElement(icon, {
          color: isActive ?  colors.loyaltyActiveTabText : colors.loyaltyTextPrimary
      })}
      <TypographyText
        title={title}
        size={16}
        font={BALOO_REGULAR}
        style={[
          { fontWeight: "700" },
          {marginLeft: isRtl ? 0: 4, marginRight: isRtl? 4 : 0}
        ]}
        textColor={isActive ?  colors.loyaltyActiveTabText : colors.loyaltyTextPrimary}
      />
    </TouchableOpacity>
  );
};

Tabs.Content = ({ children, name }) => {
  const { activeTab } = useTabsContext();

  if (activeTab === name) {
    return children;
  }

  return null;
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    // borderWidth: 1,
    borderRadius: 20,
    marginTop: 20,
    paddingVertical: 5,
    paddingHorizontal: 2,
    borderWidth: 1,
  },
  item: {
    padding: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeItem: {
    backgroundColor: colors.darkBlue,
  },
  activeItemText: {
    color: colors.white,
  },
  activeItemTextLight: {
    color: colors.darkBlue
  },
  tabItem: {
    height: 40,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'transparent'
  },
  tabWithIcon: {
    height: 46,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    flex: 1,
  }
});

export default Tabs;
