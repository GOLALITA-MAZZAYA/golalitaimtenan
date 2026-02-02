import {StyleSheet, TouchableOpacity, View} from "react-native"
import {isRTL} from "../../../../../utils";
import {colors} from "../../../../components/colors";
import {TypographyText} from "../../../../components/Typography";
import {BALOO_2} from "../../../../redux/types";
import ArrowRightSvg from '../../../../assets/loyaltyPoints/rightArrow.svg'

const InfoWithTitleBlock = ({icon, title, description}) => {
    const isRtl = isRTL();

    return (
        <View style={styles.wrapper}>
            <View style={[styles.header,{flexDirection: isRtl? 'row-reverse': 'row', backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder}]}>
                {icon}

                <TypographyText 
                   title={title}
                   font={BALOO_2}
                   size={16}
                   color={colors.primary}
                   style={[styles.title,{marginLeft: isRtl ? 0 : 4, marginRight: isRtl ? 4 : 0}]}
                />
            </View>

            <View style={styles.description}>
                 <TypographyText 
                   title={description}
                   font={BALOO_2}
                   size={14}
                   color={colors.loyaltyTextSecondary}
                   style={styles.description}
                />

                <TouchableOpacity style={styles.arrowBlock}>
                     <ArrowRightSvg />
                </TouchableOpacity>
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      padding: 20,
      borderRadius: 40
    },
    header: {
     alignItems: 'center'
    },
    arrowBlock: {

    },
    title: {
      fontWeight: '500'
    },
    description: {

    }
});

export default InfoWithTitleBlock;