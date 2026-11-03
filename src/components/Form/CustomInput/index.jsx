import {StyleSheet, TextInput, View} from "react-native"
import {TypographyText} from "../../Typography"
import {BALOO_2} from "../../../redux/types";
import {colors} from "../../colors";
import {isRTL} from "../../../../utils";

const CustomInput = ({label, placeholder, onChangeText, value, disabled, style, inputStyle, rtlDisabled, ...rest}) => {

    return (
        <View style={[styles.wrapper, style]}>
            {label && <TypographyText 
              title={label}
              style={styles.label}
              font={BALOO_2}
              textColor={colors.loyaltyTextSecondary}
            />}

            <View style={[styles.inputBlock, { backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder } ]}>
                <TextInput 
                    style={[styles.input, {textAlign: isRTL() && !rtlDisabled ? 'right': 'left', color: colors.loyaltyTextMainTitle},inputStyle]}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    value={value}
                    placeholderTextColor={disabled ? colors.loyaltyTextSecondary: colors.loyaltyTextMainTitle}
                    {...rest}
                />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
   wrapper: {
     flex: 1
   },
   label: {
     marginHorizontal: 9
   },
   inputBlock: {
      borderWidth: 1,
      height: 57,
      borderRadius: 20,
      paddingHorizontal: 16,
      flex: 1
   },
   input: {
     flex: 1,
   }
});

export default CustomInput