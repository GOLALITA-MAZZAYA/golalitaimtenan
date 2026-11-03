import {StyleSheet, View} from "react-native";
import {colors} from "../../../../components/colors";
import HotelSvg from '../../../../assets/hotel.svg';
import {TypographyText} from "../../../../components/Typography";
import {BALOO_2} from "../../../../redux/types";
import {isRTL} from "../../../../../utils";
import {useTranslation} from "react-i18next";

const NameBlock = ({name, style}) => {
    const {t} = useTranslation();

    return (
        <View style={[styles.wrapper,style,{backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder, flexDirection: isRTL()? 'row-reverse': 'row'}]}>

            <View style={[styles.iconBlock, {backgroundColor: colors.loyaltyPrimaryIconBackground}]}> 
              <HotelSvg color={colors.loyaltyPrimary}/>
            </View>

            <TypographyText 
               font={BALOO_2}
               title={name}
               size={16}
               textColor={colors.loyaltyTextMainTitle}
               style={styles.name}
               numberOfLines={2}
            />

             <TypographyText 
               font={BALOO_2}
               title={t("BookHotel.included")}
               size={12}
               textColor={colors.loyaltyPrimary}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
       paddingVertical: 21,
       paddingHorizontal: 26,
       borderWidth: 1,
       alignItems: 'center',
       borderRadius: 20
    },
    iconBlock: {
        width: 37,
        height: 37,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center'
    },
    name: {
      flex: 1,
      marginHorizontal: 11
    }
});

export default NameBlock;