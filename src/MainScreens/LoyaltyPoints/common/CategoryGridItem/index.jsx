import { StyleSheet, TouchableOpacity } from "react-native";
import Image from "../../../../components/AppImage";
import { TypographyText } from "../../../../components/Typography";
import { colors } from "../../../../components/colors";
import { BALOO_2 } from "../../../../redux/types";
import { isRTL } from "../../../../../utils";
import CategorySvg from "../../../../assets/loyaltyPoints/giftCards/category.svg";

const ICON_SIZE = 38;

const CategoryGridItem = ({ item, isActive, toggleItem }) => {
  const isRtl = isRTL();

  return (
    <TouchableOpacity
      onPress={toggleItem}
      style={[
        styles.wrapper,
        { backgroundColor: isActive ? colors.loyaltyPrimary : colors.loyaltyCardBackground },
      ]}
    >
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          tintColor={isActive ? colors.loyaltyBtnTextPrimary : colors.loyaltyPrimary}
          contentFit="contain"
        />
      ) : (
        <CategorySvg
          color={isActive ? colors.loyaltyBtnTextPrimary : colors.loyaltyPrimary}
          width={ICON_SIZE}
          height={ICON_SIZE}
          style={styles.image}
        />
      )}

      <TypographyText
        title={isRtl ? item.label_arabic : item.label}
        font={BALOO_2}
        size={13}
        textColor={isActive ? colors.loyaltyBtnTextPrimary : colors.loyaltyTextMainTitle}
        style={styles.label}
        numberOfLines={2}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: 84,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginHorizontal: 6,
    marginBottom: 12,
  },
  image: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginBottom: 8,
  },
  label: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default CategoryGridItem;
