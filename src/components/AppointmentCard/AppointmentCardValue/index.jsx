import {StyleSheet, View} from "react-native"
import {isRTL} from "../../../../utils";
import {TypographyText} from "../../Typography";
import {BALOO_2} from "../../../redux/types";
import {colors} from "../../colors";

const AppointmentCardValue = ({title, value, style}) => {
    
    return (
        <View style={[styles.dateBlock,{alignSelf: isRTL() ? 'flex-end': 'flex-start'}, style]}>
                  
                <TypographyText
                    font={BALOO_2}
                    size={14}
                    textColor={colors.loyaltyTextSecondary}
                    title={title}     
                />
                  
                <TypographyText 
                    font={BALOO_2}
                    size={18}
                    textColor={colors.mainText}
                    title={value}
                    style={styles.infoText}
                />
                  
         </View>
    )
};

const styles = StyleSheet.create({
   dateBlock: {
     paddingHorizontal: 6
   },
   infoText: {
     fontWeight: '500',
     marginTop: 3
   },
});

export default AppointmentCardValue;