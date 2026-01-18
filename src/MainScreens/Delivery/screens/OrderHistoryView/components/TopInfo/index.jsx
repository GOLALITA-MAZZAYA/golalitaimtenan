import { StyleSheet, View, Image, Text } from "react-native";
import BtnWithIcon from "../../../RestaurantView/components/RestaurantInfo/BtnWithIcon";
import { CallIcon } from "../../../../../../assets/delivery_assets";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../../../components/colors";
import { BALOO_SEMIBOLD } from "../../../../../../redux/types";

const TopInfo = (props) => {
  const { logoUrl, name, deliveryType, date, id, style, time, isDark, phone } =
    props;
  const { t } = useTranslation();

  const handleCallPress = () => {
    Linking.openURL(`tel:${phone}`);
  };

  const titleColor = isDark ? colors.white : colors.darkBlue;

  return (
    <View style={[styles.wrapper, style]}>
      <Image style={styles.logo} source={{ uri: logoUrl }} />
      <View style={styles.rightInfoBlock}>
        <Text style={[styles.name, { color: titleColor }]}>{name}</Text>

        <Text
          style={styles.date}
        >{`${deliveryType}  .  ${time}  .  ${date}`}</Text>

        <Text style={[styles.id, { color: titleColor }]}>{`${t(
          "OrderHistoryView.orderId"
        )}  .  ${id}`}</Text>

        {phone && (
          <BtnWithIcon
            icon={
              <CallIcon
                style={{ width: 10, height: 10 }}
                color={isDark ? colors.white : colors.grey}
              />
            }
            text={t("OrderHistoryView.call")}
            color={isDark ? colors.white : colors.grey}
            onPress={handleCallPress}
            style={styles.callBtn}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    marginTop: 20,
  },
  logo: {
    height: 64,
    width: 64,
    borderRadius: 32,
  },
  row: {
    flexDirection: "row",
  },
  rightInfoBlock: {
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontFamily: BALOO_SEMIBOLD,
    color: colors.darkBlue,
  },
  date: {
    fontFamily: BALOO_SEMIBOLD,
    color: "#1CC0A0",
    marginTop: 4,
  },
  id: {
    fontFamily: BALOO_SEMIBOLD,
    color: "#43385B",
    marginTop: 4,
  },
  callBtn: {
    alignSelf: "flex-start",
    marginTop: 6,
  },
});

export default TopInfo;
