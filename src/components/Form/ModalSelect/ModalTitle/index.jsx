import {StyleSheet, TouchableOpacity, View} from "react-native";
import {TypographyText} from "../../../Typography";
import {BALOO_2} from "../../../../redux/types";
import CloseSvg from '../../../../assets/close-new.svg';
import {isRTL} from "../../../../../utils";
import {colors} from "../../../colors";

const ModalTitle = ({title , onPress}) => {
    const isRtl = isRTL();

    return (

        <View style={[styles.wrapper, {flexDirection: isRtl ? 'row-reverse': 'row'}]}>

            <TypographyText 
              font={BALOO_2}
              title={title}
              textColor={colors.loyaltyTextMainTitle}
              size={18}
              style={styles.title}
            />


            <TouchableOpacity onPress={onPress} style={[styles.closeBtn, {backgroundColor: colors.loyaltyCardBackground}]}>
               <CloseSvg color={colors.loyaltyTextMainTitle}/>
            </TouchableOpacity>

        </View>

    );
};

const styles = StyleSheet.create({

    wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 40
    },
    closeBtn: {
       width: 34,
       height: 34,
       borderRadius: 17,
       justifyContent: 'center',
       alignItems: 'center'
    },
    title: {
        fontWeight: '700'
    }
});

export default ModalTitle;

