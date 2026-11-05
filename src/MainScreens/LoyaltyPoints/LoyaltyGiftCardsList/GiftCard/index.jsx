import { View, StyleSheet, TouchableOpacity } from "react-native";
import Image from "../../../../components/AppImage";
import { TypographyText } from "../../../../components/Typography";
import { BALOO_2 } from "../../../../redux/types";
import { colors } from "../../../../components/colors";
import { useTranslation } from "react-i18next";

const BORDER_RADIUS = 34;
const IMAGE_HEIGHT = 174;

const GiftCard = ({ name, onPress, imageUrl, index, tagline, brandCode }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={[styles.card, { marginTop: index ? 20 : 0 }]} onPress={onPress}>

      <View>
        <Image style={styles.cardImage} source={{ uri: imageUrl }} contentFit="cover" />
        {!!brandCode && (
          <View style={styles.codeBadge}>
            <TypographyText
              title={`${t("LoyaltyGiftCards.brandCode")}: ${brandCode}`}
              textColor={colors.white}
              size={12}
              font={BALOO_2}
              numberOfLines={1}
            />
          </View>
        )}
      </View>

      <View style={styles.descriptionBlock}>
        {!!name && <TypographyText
          title={name}
          textColor={colors.loyaltyGiftCardText}
          size={18}
          font={BALOO_2}
          numberOfLines={1}
          style={styles.title}
        />}
        {!!tagline && <TypographyText
          title={tagline}
          textColor={colors.loyaltyGiftCardText}
          size={12}
          font={BALOO_2}
          numberOfLines={1}
          style={styles.subTitle}
        />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
  },
  cardImage: {
    height: IMAGE_HEIGHT,
    width: "100%",
  },
  descriptionBlock: {
    paddingHorizontal: 5,
    paddingVertical: 16
  },
  title: {
    fontWeight: '800'
  },
  codeBadge: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  subTitle: {
    marginTop: 4
  }
});

export default GiftCard;
