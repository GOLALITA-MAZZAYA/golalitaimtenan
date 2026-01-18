import { View, StyleSheet, Text } from "react-native";
import {
  BALOO_MEDIUM,
  BALOO_REGULAR,
  BALOO_SEMIBOLD,
} from "../../../../../../redux/types";
import { colors } from "../../../../../../components/colors";
import { LocationIcon } from "../../../../../../assets/delivery_assets";
import { useTranslation } from "react-i18next";

const DeliveryAddress = ({ name, description, isDark }) => {
  const { t } = useTranslation();
  const subTitleColor = isDark ? "#8286B1" : colors.darkBlue;

  return (
    <View style={styles.wrapper}>
      <Text
        style={[
          styles.title,
          { color: isDark ? colors.white : colors.darkBlue },
        ]}
      >
        {t("OrderHistoryView.addressTitle")}
      </Text>
      <View style={styles.locationWrapper}>
        <LocationIcon color={subTitleColor} height={24} width={24} />
        <View style={styles.locationDescriptionWrapper}>
          <Text style={[styles.subTitle, { color: subTitleColor }]}>
            {name}
          </Text>
          <Text style={[styles.subTitle, { color: subTitleColor }]}>
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 30,
    width: 200,
  },
  title: {
    fontSize: 16,
    fontFamily: BALOO_SEMIBOLD,
  },
  locationWrapper: {
    flexDirection: "row",
    marginTop: 10,
  },
  subTitle: {
    fontSize: 14,
    fontFamily: BALOO_MEDIUM,
  },
  locationDescriptionWrapper: {
    marginLeft: 10,
  },
});

export default DeliveryAddress;
