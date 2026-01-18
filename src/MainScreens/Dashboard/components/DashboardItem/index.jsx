import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { colors } from "../../../../components/colors";
import { BALOO_REGULAR, BALOO_SEMIBOLD } from "../../../../redux/types";
import { useTheme } from "../../../../components/ThemeProvider";
import { TypographyText } from "../../../../components/Typography";
import { isRTL } from "../../../../../utils";

const DashboardItem = ({ name, logo, points }) => {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: isDark ? colors.darkBlue : colors.white },
      ]}
    >
      <Image
        source={{ uri: `data:image/png;base64,${logo}` }}
        style={styles.logo}
        resizeMode="cover"
      />

      <View style={[styles.descriptionWrapper]}>
        <TypographyText
          textColor={isDark ? colors.white : colors.darkBlue}
          size={16}
          font={BALOO_SEMIBOLD}
          title={name}
        />
        <TypographyText
          textColor={isDark ? colors.white : colors.darkBlue}
          size={16}
          font={BALOO_REGULAR}
          title={points}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
    flexDirection: "row",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4.59,
    elevation: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  descriptionWrapper: {
    marginLeft: 20,
    flex: 1,
  },
  logo: {
    width: 75,
    height: 75,
    borderRadius: 6,
  },
});

export default DashboardItem;
