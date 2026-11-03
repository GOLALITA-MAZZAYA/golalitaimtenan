import {StyleSheet, TouchableOpacity} from "react-native"
import {
  format,
} from 'date-fns'
import {TypographyText} from "../../Typography"
import {BALOO_2} from "../../../redux/types"
import {colors} from "../../colors"
import arSA from 'date-fns/locale/ar-SA'; 
import {isRTL} from "../../../../utils"


const Modes = ({setMode, currentMonth}) => {

    const isRtl = isRTL();

    const CONFIG = [
    {
        key: '1',
        modeType: 'month',
        formatValue: (currentMonth) => format(currentMonth, 'MMMM', {
            locale: isRtl ?  arSA : undefined
        })
    },
    {
        key: '2',
        modeType: 'year',
        formatValue: (currentMonth) => format(currentMonth, 'yyyy', {
            locale: isRtl ?  arSA : undefined
        })
    },
]

    return (
       CONFIG.map(item => (
         <TouchableOpacity onPress={() => setMode(item.modeType)} style={[styles.modeWrapper,{backgroundColor: colors.loyaltyPrimary}]}>
            <TypographyText 
               title={item.formatValue(currentMonth)}
               font={BALOO_2}
               style={styles.modeText}
               textColor={colors.loyaltyBtnTextPrimary}
               size={12}

            />

        </TouchableOpacity>
       )) 
    )
};

const styles = StyleSheet.create({
     modeWrapper: {
        height: 37,
        width: 139,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12
     },
     modeText: {
       fontWeight: '500'
     }
});

export default Modes;