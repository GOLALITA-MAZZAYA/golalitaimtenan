import React, { useEffect } from "react";
import TabsProvider, { useTabsContext } from "./TabsContext";
import { TypographyText } from "../Typography";
import { useTheme } from "../ThemeProvider";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { colors } from "../colors";
import { BALOO_REGULAR } from "../../redux/types";
import { View } from "react-native";

const Tabs = ({ children, onTabChange = () => {}, defaultActiveTab, style }) => {
  const { isDark } = useTheme();

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
          { borderColor: isDark ? colors.mainDarkMode : colors.darkBlue },
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
    borderRadius: 25,
    marginTop: 20,
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
});

export default Tabs;
