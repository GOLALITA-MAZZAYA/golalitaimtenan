import { StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../colors";
import HTMLRenderer from "../HTMLRenderer";
import { TypographyText } from "../Typography";
import { View } from "react-native";
import { useTheme } from "../ThemeProvider";

const TitleWithInfo = ({ title, value, valueType = "string", onPress }) => {
  const { isDark } = useTheme();

  const valueColor = isDark ? colors.white : colors.mainDarkModeText;
  const backgroundColor = isDark ? colors.navyBlue : "#fff";
  const btnColor = isDark ? colors.mainDarkMode : colors.darkBlue;

  let renderValue = null;

  if (valueType === "string" && value) {
    renderValue = (
      <TypographyText
        textColor={valueColor}
        size={18}
        title={value}
        style={styles.infoItemValue}
      />
    );
  }

  if (valueType === "html" && value) {
    renderValue = <HTMLRenderer value={value} />;
  }

  return (
    <TouchableOpacity
      style={styles.infoItem}
      disabled={!onPress}
      onPress={onPress}
    >
      <View style={styles.infoItemTitleWrapper}>
        <View style={[styles.infoItemTitle, { backgroundColor }]}>
          <TypographyText
            textColor={btnColor}
            size={15}
            style={{ fontWeight: "700" }}
            title={title}
          />
        </View>
      </View>

      {renderValue}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  infoItem: {
    marginTop: 40,
  },
  infoItemTitleWrapper: {
    width: "100%",
  },
  infoItemTitle: {
    borderRadius: 10,
  },
  infoItemValue: {
    marginTop: 3,
  },
});

export default TitleWithInfo;
