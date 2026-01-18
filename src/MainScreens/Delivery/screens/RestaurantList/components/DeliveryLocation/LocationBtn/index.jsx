import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../../../../../../../components/colors";
import { BALOO_MEDIUM, BALOO_REGULAR } from "../../../../../../../redux/types";
import { TypographyText } from "../../../../../../../components/Typography";

const LocationBtn = ({ isDark, title, subTitle, onPress, Icon }) => {
  return (
    <TouchableOpacity
      style={[
        styles.layout,
        { borderColor: isDark ? colors.grey : colors.darkBlue },
      ]}
      onPress={onPress}
    >
      <Icon
        style={styles.locationIcon}
        color={isDark ? colors.white : colors.darkBlue}
      />
      <View>
        <TypographyText
          title={title}
          textColor={isDark ? colors.white : colors.darkBlue}
          size={14}
          font={BALOO_MEDIUM}
          style={styles.title}
        />
        <TypographyText
          title={subTitle}
          textColor={isDark ? colors.grey : colors.darkBlue}
          size={11}
          font={BALOO_REGULAR}
          style={styles.subTitle}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  layout: {
    flexDirection: "row",
    height: 56,
    borderRadius: 8,
    borderColor: colors.darkBlue,
    borderWidth: 1,
    alignItems: "center",
  },
  locationIcon: {
    width: 20,
    height: 20,
    fill: colors.darkBlue,
    margin: 10,
  },
  subTitle: {
    lineHeight: 18,
    textAlign: "left",
  },
  title: {
    lineHeight: 22,
    textAlign: "left",
  },
});

export default LocationBtn;
