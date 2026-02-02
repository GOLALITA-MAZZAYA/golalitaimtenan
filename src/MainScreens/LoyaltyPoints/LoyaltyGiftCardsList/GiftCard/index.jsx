import { View, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { TypographyText } from "../../../../components/Typography";
import { BALOO_2 } from "../../../../redux/types";
import { colors } from "../../../../components/colors";

const BORDER_RADIUS = 34;
const CARD_HEIGHT = 174;

const GiftCard = ({ name, onPress, imageUrl, index, tagline }) => {
  return (
    <TouchableOpacity style={[styles.card, {marginTop: index ? 20: 0}]} onPress={onPress}>

      <ImageBackground style={styles.cardImage} source={{ uri: imageUrl }} resizeMode="cover" />

      <View style={styles.descriptionBlock}>
        {!!name && <TypographyText
          title={name}
          textColor={colors.loyaltyGiftCardText}
          size={18}
          font={BALOO_2}
          numberOfLines={1}
          style={styles.title}
        />}
        {!!tagline &&<TypographyText
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
    height: CARD_HEIGHT,
    overflow: 'hidden',
  },
  cardImage: {
    position: 'relative',
    height: CARD_HEIGHT,
    width: "100%",
    borderRadius: 34,
    flex: 1
  },
  descriptionBlock: {
    bottom: 20,
    left: 20
  },
  title: {
    fontWeight: '800'
  },
  subTitle: {
    marginTop: 4
  }
});

export default GiftCard;
