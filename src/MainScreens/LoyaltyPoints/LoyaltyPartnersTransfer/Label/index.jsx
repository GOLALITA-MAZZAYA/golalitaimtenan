import {StyleSheet, View} from "react-native";
import {useTheme} from "../../../../components/ThemeProvider";
import {colors} from "../../../../components/colors";
import {TypographyText} from "../../../../components/Typography";

const Label = ({children, text, style}) => {
     const {isDark} = useTheme();
     const textColor = isDark ? colors.white: colors.darkBlue;
    
    return (
      <View style={[styles.wrapper, style]}>
        <TypographyText
            textColor={textColor}
            title={text}
            style={styles.label}
        />   
        {children}
      </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
    },
    label: {
        fontWeight: '600',
    }
});

export default Label;