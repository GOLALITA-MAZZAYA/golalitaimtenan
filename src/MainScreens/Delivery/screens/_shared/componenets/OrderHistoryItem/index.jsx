import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import { BALOO_REGULAR, BALOO_SEMIBOLD } from "../../../../../../redux/types";
import { colors } from "../../../../../../components/colors";
import { ORDER_STATUSES_CONFIG } from "../../../OrderHistoryList/config";
import ReorderBtn from "./ReorderBtn";
import CheckBtn from "./CheckBtn";

const OrderHistoryItem = (props) => {
  const {
    logoUrl,
    name,
    description,
    date,
    deliveryType,
    price,
    quantity,
    style,
    t,
    onItemPress,
    isDark,
    orderStatus,
    onActionBtnPress,
  } = props;

  const textColor = isDark ? colors.white : colors.darkBlue;

  return (
    <TouchableOpacity
      style={[
        styles.wrapper,
        { backgroundColor: isDark ? colors.darkBlue : colors.white },
        style,
      ]}
      onPress={onItemPress}
      a
    >
      <View style={styles.block}>
        <Image
          style={styles.logo}
          source={{
            uri: logoUrl,
          }}
        />

        <View style={styles.rightBlock}>
          <Text style={[styles.name, { color: textColor }]}>{name}</Text>
          <View style={styles.itemsWrapper}>
            <View style={styles.items}>
              <Text style={styles.itemsText}>{`${quantity} ${t(
                "OrderHistoryList.items"
              )}`}</Text>
            </View>

            <Text numberOfLines={1} style={styles.description}>
              {description}
            </Text>
          </View>
          <View>
            <Text style={[styles.date, { color: textColor }]} numberOfLines={1}>
              {`${date}  ${deliveryType}`}
            </Text>
          </View>
          <View style={styles.statusWrapper}>
            <Text style={[styles.date, { color: textColor }]} numberOfLines={1}>
              {`${t("OrderHistoryList.status")} : `}
            </Text>

            <Text
              style={[
                styles.date,
                { color: ORDER_STATUSES_CONFIG[orderStatus].color },
              ]}
              numberOfLines={1}
            >
              {t(`${ORDER_STATUSES_CONFIG[orderStatus].translation}`)}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <View>
          <Text
            style={[styles.footerText, { color: textColor }]}
          >{`${price} QR`}</Text>
        </View>
        {ORDER_STATUSES_CONFIG[orderStatus].can_reorder && (
          <ReorderBtn onPress={onActionBtnPress} />
        )}
        {!ORDER_STATUSES_CONFIG[orderStatus].can_reorder && (
          <CheckBtn onPress={onActionBtnPress} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 280,
    height: 135,
    borderRadius: 16,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: "white",
    padding: 16,
    marginRight: 16,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  block: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 76,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  itemsWrapper: {
    flexDirection: "row",
  },
  rightBlock: {
    paddingHorizontal: 10,
    justifyContent: "center",
    flex: 1,
  },
  name: {
    fontFamily: BALOO_SEMIBOLD,
    fontSize: 14,
  },
  description: {
    fontFamily: BALOO_REGULAR,
    fontSize: 12,
    color: colors.grey,
    marginLeft: 6,
    flex: 1,
  },
  items: {
    backgroundColor: "#2DC8D8",
    padding: 3,
    borderRadius: 4,
  },
  itemsText: {
    color: colors.white,
    fontSize: 12,
  },
  date: {
    fontSize: 12,
    fontFamily: BALOO_SEMIBOLD,
  },
  footerText: {
    fontSize: 12,
    color: colors.darkBlue,
    fontFamily: BALOO_SEMIBOLD,
  },
  buyWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  buyText: {
    color: "#1CC0A0",
    fontSize: 12,
    fontFamily: BALOO_SEMIBOLD,
    marginLeft: 4,
  },
  statusWrapper: {
    flexDirection: "row",
  },
});

export default OrderHistoryItem;
