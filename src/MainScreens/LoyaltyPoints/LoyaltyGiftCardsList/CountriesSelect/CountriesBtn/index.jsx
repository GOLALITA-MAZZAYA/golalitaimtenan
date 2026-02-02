import {StyleSheet, TouchableOpacity} from "react-native"
import PlanetSvg from '../../../../../assets/loyaltyPoints/giftCards/planet.svg';
import {TypographyText} from "../../../../../components/Typography";
import {colors} from "../../../../../components/colors";
import {BALOO_2} from "../../../../../redux/types";
import {isRTL} from "../../../../../../utils";
import {useTranslation} from "react-i18next";

const CountriesBtn = ({openModal}) => {
    const isRtl = isRTL();
    const {t} = useTranslation();

    return (
        <TouchableOpacity style={[
              styles.wrapper,
              {flexDirection: isRtl ? 'row-reverse': 'row',
               backgroundColor: colors.loyaltyCardBackground,
               borderColor: colors.loyaltyTabsBorder,
               marginLeft: isRtl? 7:0,
               marginRight: isRtl ? 0:7
            }
            ]} onPress={openModal}>
             <PlanetSvg color={colors.loyaltyPrimary}/>

             <TypographyText 
                title={t('LoyaltyGiftCards.countries')}
                textColor={colors.loyaltyTextMainTitle}
                style={styles.title}
                font={BALOO_2}
             />
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      height: 46,
      flexGrow: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      padding: 14,
      borderRadius: 16
    },
    title: {
      fontSize: 12,
      marginHorizontal: 8
    }
});

export default CountriesBtn;