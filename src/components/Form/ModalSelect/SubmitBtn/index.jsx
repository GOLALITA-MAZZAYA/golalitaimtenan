import {StyleSheet, TouchableOpacity} from "react-native"
import {TypographyText} from "../../../Typography";
import {BALOO_2} from "../../../../redux/types";
import {colors} from "../../../colors";

const SubmitBtn = ({onSubmit, title}) => {
    return (
        <TouchableOpacity onPress={onSubmit} style={[styles.wrapper,{backgroundColor: colors.loyaltyPrimary}]}>
            <TypographyText 
               title={title}
               font={BALOO_2}
               textColor={colors.loyaltyBtnTextPrimary}
               style={styles.text}
            />
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      height: 50,
      widht: '100%',
      marginHorizontal: 20,
      borderRadius: 12,
      marginBottom: 30,
      marginTop: 30,
      justifyContent: 'center',
      alignItems: 'center'
    },
    text: {
     fontSize: 16,
     fontWeight: '500',
    }
});

export default SubmitBtn;