import {StyleSheet, View} from "react-native";
import {TypographyText} from "../../../../components/Typography";
import {BALOO_2} from "../../../../redux/types";
import {colors} from "../../../../components/colors";
import {isRTL} from "../../../../../utils";
import GiftSvg from '../../../../assets/gift.svg';
import {useTranslation} from "react-i18next";

const GiftInfo = ({style}) => {
    const isRtl = isRTL();
    const {t} = useTranslation();

    return (
        <View style={[styles.wrapper,style,{flexDirection: isRtl ? 'row-reverse': 'row', backgroundColor: colors.loyaltyCardBackground}]}>

            <View style={[styles.iconWrapper,{backgroundColor: colors.loyaltyPrimaryIconBackground}]}>
              <GiftSvg fill={colors.loyaltyPrimary} height={20} width={20}/>
            </View>

            <View style={styles.textBlock}>
                <TypographyText 
                  size={16}
                  font={BALOO_2}
                  style={styles.title}
                  textColor={colors.loyaltyTextMainTitle}
                  title={t('Charities.giftTitle')}
                />
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      padding: 20,
      borderRadius: 20,
      alignItems: 'center'
    },
    title: {
      fontWeight: '700'
    },

    textBlock: {
        marginHorizontal: 10
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius: 12,
    }
});

export default GiftInfo;