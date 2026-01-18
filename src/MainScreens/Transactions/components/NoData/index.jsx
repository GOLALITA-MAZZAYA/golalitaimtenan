import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";
import { BALOO_SEMIBOLD } from "../../../../redux/types";
import { useTheme } from "../../../../components/ThemeProvider";
import { colors } from "../../../../components/colors";

const NoData = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <View style={styles.wrapper}>
      <Text
        style={[
          styles.text,
          { color: isDark ? colors.white : colors.darkBlue },
        ]}
      >
        {t("General.noData")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 15,
    fontFamily: BALOO_SEMIBOLD,
  },
});

export default NoData;
