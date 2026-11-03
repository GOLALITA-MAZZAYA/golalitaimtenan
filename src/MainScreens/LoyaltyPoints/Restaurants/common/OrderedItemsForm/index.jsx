import {StyleSheet, View} from "react-native";
import Image from "../../../../../components/AppImage";
import {TypographyText} from "../../../../../components/Typography";
import {isRTL} from "../../../../../../utils";
import {BALOO_2} from "../../../../../redux/types";
import {colors} from "../../../../../components/colors";
import {useTranslation} from "react-i18next";
import { getTotalProductsQuantity} from "../../../helpers";

const OrderedItemsForm = ({items, style, expectedCookingTime, total, discount}) => {
    const isRtl = isRTL();
    const {t} = useTranslation();    

    const totalItems = getTotalProductsQuantity(items);

    return (
     <View style={[styles.wrapper,style]}>

        {items?.map((item,index) => (
            <View style={[styles.card,{flexDirection: isRtl ? 'row-reverse': 'row', backgroundColor: colors.cardBackground, marginTop: index ? 15: 0}]}>
                <Image source={{uri: item.image_url}} style={styles.logo}/>

                <View style={[styles.cardDescription]}>
                    <TypographyText 
                      title={isRtl ? item.name_ar: item.name}
                      font={BALOO_2}
                      textColor={colors.loyaltyTextMainTitle}
                      size={16}
                      style={styles.name}
                      numberOfLines={2}
                    />
                    

                    <View style={[styles.priceBlock,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>
                    <TypographyText 
                      title={`${t('Restaurants.qantity')}: ${item.quantity}`}
                      font={BALOO_2}
                      textColor={colors.textSecondary}
                      style={styles.priceText}
                    />

                    <TypographyText 
                      title={`${t('Restaurants.price')}: ${item.subtotal} ${t('Restaurants.qar')}`}
                      font={BALOO_2}
                      textColor={colors.textSecondary}
                      style={styles.priceText}
                    />
                    </View>

                </View>

             </View>
        ))}

        <View style={styles.total}>
            <TypographyText 
                title={t('Restaurants.totalSummary')}
                font={BALOO_2}
                textColor={colors.loyaltyTextMainTitle}
                size={20}
                style={styles.name}
                numberOfLines={2}
            />
            
            <View style={[styles.totalPrice,{backgroundColor: colors.cardBackground}]}>


                {expectedCookingTime && <View style={[styles.totalPriceBlock,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>
                    <TypographyText 
                      title={t('Restaurants.cookingTime')}
                      font={BALOO_2}
                      textColor={colors.loyaltyTextMainTitle}
                      style={styles.priceText}
                      size={16}
                    />

                    <TypographyText 
                      title={`${expectedCookingTime} min`}
                      font={BALOO_2}
                      textColor={colors.loyaltyTextMainTitle}
                      style={styles.priceText}
                      size={16}
                    />

                </View>}

                <View style={[styles.totalPriceBlock,{flexDirection: isRtl ? 'row-reverse': 'row', marginTop: !!expectedCookingTime ? 10: 0}]}>
                    <TypographyText 
                      title={t('Restaurants.itemsUppercase')}
                      font={BALOO_2}
                      textColor={colors.loyaltyTextMainTitle}
                      style={styles.priceText}
                      size={16}
                    />

                    <TypographyText 
                      title={totalItems}
                      font={BALOO_2}
                      textColor={colors.loyaltyTextMainTitle}
                      style={styles.priceText}
                      size={16}
                    />

                </View>

                  {typeof discount === 'number' && <View style={[styles.totalPriceBlock,{flexDirection: isRtl ? 'row-reverse': 'row', marginTop: !!expectedCookingTime ? 10: 0}]}>
                    <TypographyText 
                      title={t('Restaurants.discount')}
                      font={BALOO_2}
                      textColor={colors.loyaltyTextMainTitle}
                      style={styles.priceText}
                      size={16}
                    />

                    <TypographyText 
                      title={`- ${discount} ${t('General.qar')}`}
                      font={BALOO_2}
                      textColor={colors.loyaltyTextMainTitle}
                      style={styles.priceText}
                      size={16}
                    />

                </View>}

                  <View style={[styles.totalPriceBlock,{flexDirection: isRtl ? 'row-reverse': 'row', marginTop: 10}]}>
                    <TypographyText 
                      title={t('Restaurants.totalPrice')}
                      font={BALOO_2}
                      textColor={colors.loyaltyTextMainTitle}
                      style={styles.priceText}
                      size={16}
                    />

                    <TypographyText 
                      title={`${total} ${t('Restaurants.qar')}`}
                      font={BALOO_2}
                      textColor={colors.loyaltyTextMainTitle}
                      style={styles.priceText}
                      size={16}
                    />

                </View>

            </View>

        </View>

     </View>
    )
};

const styles = StyleSheet.create({
   wrapper: {
    flex: 1
   },
   logo: {
    width: 60,
    height: 60,
    borderRadius: 4
   },
   card: {
     borderRadius: 8,
     padding: 10
   },
   cardDescription: {
     flex: 1,
     marginHorizontal: 10,
     justifyContent: 'space-between'
   },
   contentContainerStyle: {
    flex: 1
   },
   priceBlock: {
    gap: 15
   },
   name: {
    fontWeight: '500'
   },
   priceText: {
     fontWeight: '500'
   },
   totalPrice: {
    marginTop: 10,
    borderRadius: 8,
    padding: 10
   },
   total: {
    marginTop: 20,
   },
   totalPriceBlock: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
   }
});

export default OrderedItemsForm;