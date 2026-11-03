import React from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { colors } from "./colors";
import { useTheme } from "./ThemeProvider";

const MainLayout = ({
  headerChildren,
  children,
  headerHeight,
  contentStyle,
  style,
}) => {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: isDark ? colors.darkModeBackground : colors.white,
        },
        style,
      ]}
    >
      <View style={styles.container}>
        <View style={{ minHeight: headerHeight ?? 60 }}>
          {headerChildren}
        </View>
        <View
          style={[
            styles.content,
            {
              backgroundColor: isDark ? colors.darkModeBackground : colors.white,
            },
            contentStyle,
          ]}
        >
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default MainLayout;
