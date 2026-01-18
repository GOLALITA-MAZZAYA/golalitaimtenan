import { StyleSheet, View } from "react-native";
import { colors } from "../../../../../components/colors";
import { useTheme } from "../../../../../components/ThemeProvider";
import CommonButton from "../../../../PremiumPartner/common/CommonButton";
import { isRTL } from "../../../../../../utils";

const InfoButtons = ({ data }) => {
  const { isDark } = useTheme();

  const btnColor = isDark ? colors.mainDarkMode : colors.darkBlue;

  return (
    <View
      style={[
        styles.wrapper,
        { justifyContent: isRTL() ? "flex-end" : "flex-start" },
      ]}
    >
      {data.map((item, index) => {
        if (!item.visible) {
          return null;
        }

        return (
          <CommonButton
            key={item.key}
            disabled={item.disabled}
            text={item.text}
            icon={<item.icon fill={btnColor} />}
            onPress={item.onPress}
            textStyle={{
              color: btnColor,
              fontSize: 11,
              marginLeft: 4,
            }}
            wrapperStyle={{
              borderColor: btnColor,
              paddingHorizontal: 10,
              alignSelf: "flex-start",
              marginTop: 30,
              marginLeft: !isRTL() ? (!!index ? 20 : 0) : 20,
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default InfoButtons;
