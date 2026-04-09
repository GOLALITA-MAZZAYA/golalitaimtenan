import {ActivityIndicator, StyleSheet, TouchableOpacity} from "react-native";
import {TypographyText} from "../../components/Typography";
import {BALOO_2} from "../../redux/types";
import {colors} from "../../components/colors";

const Button = ({text, style, onPress, primary=true, loading}) => {

    return (
       <TouchableOpacity disabled={loading} style={[styles.wrapper, {backgroundColor: primary? colors.loyaltyPrimary: 'transaparent'}, style]} onPress={onPress}>
            <TypographyText  
                font={BALOO_2}
                size={16}
                textColor={primary ? colors.loyaltyActiveTabText: colors.loyaltySecondary}
                title={text}
                style={styles.text}
            />

            {loading && <ActivityIndicator size={"small"} color={colors.loyaltyActiveTabText} style={styles.loader}/>}
       </TouchableOpacity>
    ); 
};

const styles = StyleSheet.create({
    wrapper: {
      height: 50,
      justifyContent:'center',
      alignItems: 'center',
      borderRadius: 16,
      flexDirection: 'row'
    },
    text: {
      fontWeight: '500'
    },
    loader: {
        marginHorizontal: 8
    }
});

export default Button;