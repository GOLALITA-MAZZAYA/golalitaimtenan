import { StyleSheet } from "react-native";
import { View } from "react-native";
import { colors } from "../../../../../components/colors";
import { getFlexDirection, isRTL } from "../../../../../../utils";
import FormikButtonCheckbox from "../../../../../components/Formik/FormikButtonCheckbox";

const MerchantTypes = ({ style }) => {
  const config = [
    {
      label: "Gopoints",
      name: "gpoint",
    },
    {
      label: "Premium",
      name: "is_premium_merchant",
    },
  ];

  return (
    <View style={[styles.wrapper, getFlexDirection(), style]}>
      {config.map((item, index) => (
        <FormikButtonCheckbox
          name={item.name}
          label={item.label}
          key={index}
          wrapperStyle={{
            marginLeft: isRTL() ? 10 : 0,
            marginRight: isRTL() ? 0 : 10,
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  activeWrapperLight: {
    backgroundColor: colors.darkBlue,
  },
  passiveWrapperLight: {},
  activeWrapperDark: {
    backgroundColor: colors.mainDarkMode,
  },
  passiveWrapperDark: {},

  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.darkBlue,
  },
  text: {
    fontWeight: "600",
  },
});

export default MerchantTypes;
