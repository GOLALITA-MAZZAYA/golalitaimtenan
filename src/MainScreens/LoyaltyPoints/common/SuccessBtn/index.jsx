import {StyleSheet, View} from "react-native";
import OkSvg from '../../../../assets/loyaltyPoints/ok.svg';
import {useTheme} from "../../../../components/ThemeProvider";

const SuccessBtn = ({style}) => {
  const {isDark} = useTheme();

  const wrapperBorder = isDark ? '#0F190D': '#0A9D1B';
  const wrapperBackground = isDark ?  '#1B381D' : 'rgb(185,244,184)';
  const border = isDark ? '#0A9D1B': '#0A9D1B';
  const background = isDark ? '#1B381D' : 'rgb(185,244,184)';
  const iconColor = isDark ? "#0A9D1B" :'#0A9D1B';

  return (
    <View style={[styles.mainWrapper, style, {backgroundColor: wrapperBackground, borderColor: wrapperBorder}]}>
        <View style={[styles.wrapper,{backgroundColor: background, borderColor: border}]}>
            <OkSvg color={iconColor} height={15} width={15}/>
        </View>
    </View>
  )
};

const styles = StyleSheet.create({
    mainWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#0F190D',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1B381D'
    },
    wrapper: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default SuccessBtn