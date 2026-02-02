import {StyleSheet, TouchableOpacity, View} from "react-native"
import {colors} from "../../../../components/colors";
import {TypographyText} from "../../../../components/Typography";

const ButtonWithImage = ({icon, text, style, primary, onPress}) => {
    return (
        <TouchableOpacity style={[
             styles.wrapper,
             primary ? {backgroundColor: colors.loyaltyPrimary}: { backgroundColor: colors.loyaltyCardBackground, borderWidth: 1, borderColor: colors.loyaltyPrimary},
             style
             ]}
            onPress={onPress}
            >
           {icon && <View style={styles.icon}>
             {icon}
           </View>}

           <TypographyText
              title={text}
              textColor={primary ? colors.loyaltyBtnTextPrimary: colors.loyaltyBtnTextRegular}
              size={16}
              style={[styles.text,{ paddingLeft: !!icon ? 8: 0}]}
            />

        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 36,
      flex: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
    },
    icon: {
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center'
    },
    text: {
      fontWeight: '500',
    }
});

export default ButtonWithImage;