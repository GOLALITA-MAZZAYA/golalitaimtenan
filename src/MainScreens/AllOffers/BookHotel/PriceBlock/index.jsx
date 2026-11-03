import {StyleSheet, View} from "react-native"
import {colors} from "../../../../components/colors";
import {TypographyText} from "../../../../components/Typography";
import {BALOO_2} from "../../../../redux/types";
import {isRTL} from "../../../../../utils";
import {useTranslation} from "react-i18next";

const PriceBlock = ({price, total, style}) => {
    const isRtl = isRTL();
    const {t} = useTranslation();

    return (
        <View style={[
            styles.wrapper,
            style,
            {backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder}
        ]}>

            <View style={[styles.block,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>

                <TypographyText 
                  font={BALOO_2}
                  title={t("BookHotel.pricePerNight")}
                  size={16}
                  textColor={colors.loyaltyTextSecondary}
                />

                <TypographyText 
                  font={BALOO_2}
                  title={`${price} ${t("General.qar")}`}
                  size={16}
                  textColor={colors.loyaltyTextMainTitle}
                />

            </View>

            <View style={[styles.separator,{backgroundColor: colors.loyaltyTextSecondary}]} />

            <View style={[styles.block,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>
              <TypographyText 
                  font={BALOO_2}
                  title={t("BookHotel.total")}
                  size={16}
                  textColor={colors.loyaltyTextMainTitle}
                  style={styles.totalText}
                />

                <TypographyText 
                  font={BALOO_2}
                  title={`${total} ${t("General.qar")}`}
                  size={16}
                  textColor={colors.loyaltyTextMainTitle}
                  style={styles.totalText}
                />

            </View>

        </View>

    )
};

const styles = StyleSheet.create({
     wrapper: {
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        borderWidth: 1,
        borderRadius: 40
     },
     separator: {
       height: 1,
       marginVertical: 10,
       width: '100%'
     },
     block: {
       alignItems: 'center',
       justifyContent: 'space-between'
     },
     totalText: {
        fontWeight: '700'
     }
});

export default PriceBlock;