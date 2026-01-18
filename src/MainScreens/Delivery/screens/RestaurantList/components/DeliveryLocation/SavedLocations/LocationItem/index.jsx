import BouncyCheckbox from "react-native-bouncy-checkbox";
import { LocationIcon } from "../../../../../../../../assets/delivery_assets";
import { StyleSheet, View } from "react-native";
import { colors } from "../../../../../../../../components/colors";
import { TypographyText } from "../../../../../../../../components/Typography";
import {
  BALOO_MEDIUM,
  BALOO_REGULAR,
} from "../../../../../../../../redux/types";

const LocationItem = ({ title, subTitle, isChecked, onChange, isDark }) => {
  return (
    <View style={styles.row}>
      <LocationIcon
        style={styles.locationIcon}
        color={isDark ? colors.grey : colors.darkBlue}
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
      <View style={{ flex: 1 }} />
      <BouncyCheckbox
        size={16}
        innerIconStyle={[
          styles.innerIconStyle,

          {
            backgroundColor: isChecked
              ? colors.green
              : isDark
              ? "transparent"
              : colors.white,
            borderColor: isChecked ? colors.green : colors.grey,
          },
        ]}
        isChecked={isChecked}
        onPress={(isChecked) => onChange(!isChecked)}
        disableBuiltInState
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderRadius: 16,
    alignItems: "center",
  },
  locationIcon: {
    width: 20,
    height: 20,
    fill: colors.darkBlue,
    marginEnd: 12,
  },
  subTitle: {
    lineHeight: 18,
    textAlign: "left",
  },
  title: {
    lineHeight: 22,
    textAlign: "left",
  },
  innerIconStyle: {
    borderRadius: 4,
  },
});

export default LocationItem;
