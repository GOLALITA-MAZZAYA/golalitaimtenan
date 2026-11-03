import {StyleSheet, TouchableOpacity, View} from "react-native";
import Image from "../../../../../../components/AppImage";
import {colors} from "../../../../../../components/colors";
import {BALOO_2} from "../../../../../../redux/types";
import {TypographyText} from "../../../../../../components/Typography";
import {useTranslation} from "react-i18next";

const FoodListItem = ({uri, name, description, price, amount = 0, onAddPress, onRemovePress}) => {
    const {t} = useTranslation();

    return (
       <View style={[styles.wrapper,{backgroundColor: colors.cardBackground, borderColor: colors.loyaltyMainBorder}]}>

        <View style={styles.block}>
            <Image source={{uri}} style={styles.logo} />

            <View style={styles.descriptionBlock}>
                <TypographyText
                    title={name}
                    textColor={colors.loyaltyTextMainTitle}
                    size={18}
                    font={BALOO_2}
                    style={styles.title}
                    numberOfLines={1}
                />

                <TypographyText
                    title={description}
                    textColor={colors.primary}
                    size={14}
                    font={BALOO_2}
                    style={styles.description}
                    numberOfLines={2}
                />

            </View>
        </View>

        <View style={styles.priceBlock}>
            <TypographyText
                title={`${price} ${t('Restaurants.qar')}`}
                textColor={colors.loyaltyTextMainTitle}
                size={16}
                font={BALOO_2}
                style={styles.title}
            />

            <View style={styles.amountBlock}>
                <TouchableOpacity style={[styles.actionBtn,{borderColor: colors.loyaltyTextMainTitle}]} onPress={onRemovePress}>

                   <TypographyText
                     title={'-'}
                     textColor={colors.loyaltyTextMainTitle}
                     size={16}
                     font={BALOO_2}
                   />

                </TouchableOpacity>
                   <TypographyText
                     title={amount}
                     textColor={colors.loyaltyTextMainTitle}
                     size={16}
                     font={BALOO_2}
                   />
                 <TouchableOpacity style={[styles.actionBtn,{borderColor: colors.loyaltyTextMainTitle}]} onPress={onAddPress}>
                   <TypographyText
                     title={'+'}
                     textColor={colors.loyaltyTextMainTitle}
                     size={16}
                     font={BALOO_2}
                   />
                </TouchableOpacity>
            </View>

        </View>

       </View>
    );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 20
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 6
  },
  block: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  amountBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  descriptionBlock: {
    paddingHorizontal: 10,
    flex: 1,
  },
  description: {
    flex: 1,
    marginTop: 4
  },
  priceBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginTop: 16
  },
  actionBtn: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },

});

export default FoodListItem;