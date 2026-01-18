import { Text } from "react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SizedBox } from "../../../_shared/componenets/SizedBox";
import {
  DecreaseQuantityIcon,
  IncreaseQuantityIcon,
} from "../../../../../../assets/delivery_assets";
import { colors } from "../../../../../../components/colors";
import {
  BALOO_BOLD,
  BALOO_REGULAR,
  BALOO_SEMIBOLD,
} from "../../../../../../redux/types";
import { Image } from "react-native";
import { TypographyText } from "../../../../../../components/Typography";

const RestaurantProductListItem = ({
  isDark,
  name,
  image_url,
  description_sale,
  price,
  onPress,
  onIncreasePress,
  onDecreasePress,
  quantity = 0,
  priceWithoutDiscount,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.wrapper,
        { backgroundColor: isDark ? colors.secBlue : colors.white },
      ]}
      onPress={onPress}
    >
      <View style={styles.headerBlock}>
        <Image
          source={{
            uri: image_url,
          }}
          style={styles.logo}
        />

        <View style={styles.descriptionWrapper}>
          <TypographyText
            title={name}
            textColor={isDark ? colors.white : colors.darkBlue}
            size={14}
            font={BALOO_SEMIBOLD}
            numberOfLines={1}
            style={{ textAlign: "left" }}
          />

          <TypographyText
            title={description_sale}
            textColor={colors.grey}
            size={14}
            font={BALOO_REGULAR}
            numberOfLines={2}
            style={{ textAlign: "left" }}
          />
        </View>
      </View>

      <View
        style={[
          styles.footer,
          { borderTopColor: isDark ? colors.darkBlue : colors.lightGrey },
        ]}
      >
        <View style={styles.priceWrapper}>
          {!!priceWithoutDiscount && (
            <TypographyText
              title={`${priceWithoutDiscount} QR`}
              textColor={colors.grey}
              size={14}
              font={BALOO_SEMIBOLD}
              style={styles.priceWithoutDiscount}
            />
          )}

          <TypographyText
            title={`${price} QR`}
            textColor={isDark ? colors.white : colors.darkBlue}
            size={14}
            font={BALOO_SEMIBOLD}
          />
        </View>

        <View style={styles.controllBtns}>
          <TouchableOpacity onPress={onDecreasePress}>
            <DecreaseQuantityIcon />
          </TouchableOpacity>
          <SizedBox size={12} />
          <Text
            style={[
              styles.countText,
              { color: isDark ? colors.white : colors.darkBlue },
            ]}
          >
            {quantity}
          </Text>
          <SizedBox size={12} />
          <TouchableOpacity onPress={onIncreasePress}>
            <IncreaseQuantityIcon
              color={isDark ? colors.white : colors.darkBlue}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 8,
    margin: 16,
    borderRadius: 8,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    position: "relative",
  },
  headerBlock: {
    flexDirection: "row",
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  descriptionWrapper: {
    paddingHorizontal: 8,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderTopWidth: 1,
  },
  controllBtns: {
    flexDirection: "row",
    alignItems: "center",
  },
  countText: {
    fontSize: 14,
    fontFamily: BALOO_BOLD,
  },
  priceWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceWithoutDiscount: {
    marginRight: 6,
    textDecorationLine: "line-through",
  },
});

export default RestaurantProductListItem;
