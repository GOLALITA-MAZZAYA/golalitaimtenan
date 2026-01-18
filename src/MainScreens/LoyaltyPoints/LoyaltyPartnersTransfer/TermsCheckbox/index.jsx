import {StyleSheet, TouchableOpacity, View} from "react-native";
import {TypographyText} from "../../../../components/Typography";
import {useNavigation} from "@react-navigation/native";
import Checkbox from "../../../../components/Form/Checkbox";
import {useTheme} from "../../../../components/ThemeProvider";
import {colors} from "../../../../components/colors";
import {useTranslation} from "react-i18next";

const TermsCheckbox = ({isActive, onChange}) => {
    const {isDark} = useTheme();
    const {t} = useTranslation();
    const navigation = useNavigation();

    const navigateToTermsScreen = () => {

    }

    
    return (
    <View style={styles.wrapper}>
      <Checkbox active={isActive} onChange={onChange} style={styles.checkbox} />

      <View style={styles.textWrapper}>

       <TypographyText
         title={` ${t('LoyaltyPartners.agreeWith')} `}
         textColor={isDark ? colors.white: colors.darkBlue}
         size={16}
         style={styles.text}
      />

      <TouchableOpacity onPress={navigateToTermsScreen}>
       <TypographyText
         title={t('LoyaltyPartners.terms')}
         textColor={'#007AFF'}
         size={16}
         style={styles.link}
      />
      </TouchableOpacity>

      </View>
    </View>

    )
};

const styles = StyleSheet.create({

    wrapper: {
      flexDirection: 'row',
      marginTop: 5,
      alignItems: 'center',
    },
    textWrapper: {
      flexDirection: 'row',
      marginLeft: 10
    },
    text: {

    },
    checkbox: {
      borderColor: 'transparent',
      marginBottom : 0,
      paddingBottom: 0
    }

});

export default TermsCheckbox;