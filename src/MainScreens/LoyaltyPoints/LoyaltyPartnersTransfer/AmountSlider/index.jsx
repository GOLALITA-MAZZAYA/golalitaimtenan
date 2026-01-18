import {useTheme} from "../../../../components/ThemeProvider";
import {colors} from "../../../../components/colors";
import {useState} from "react";
import {StyleSheet, View} from "react-native";
import {TypographyText} from "../../../../components/Typography";
import Slider from "@react-native-community/slider";

const minimumValue = 10000;
const maximumValue = 100000;
const step = 50;

const AmountSlider = ({onChange}) => {
    const [value, setValue] = useState(`${minimumValue}`);
    const {isDark} = useTheme();


    const valueColor = isDark ? colors.white: colors.darkBlue;
    const maximumTrackTintColor = isDark ? colors.mainDarkMode : colors.darkBlue;
    const thumbTintColor = isDark ? colors.white : colors.darkBlue;

    return (
      <View style={styles.wrapper} >

      <View style={styles.valuesBlock}>
          <TypographyText
            textColor={valueColor}
            title={minimumValue}
            style={styles.title}
           />

          <TypographyText
            textColor={valueColor}
            title={value}
            style={styles.amountValueText}
           />


          <TypographyText
            textColor={valueColor}
            title={maximumValue}
            style={styles.title}
           />        

        </View>

        <Slider
              minimumValue={minimumValue}
              maximumValue={maximumValue}
              step={step}
              onValueChange={setValue}
              onSlidingComplete={onChange}
              maximumTrackTintColor={maximumTrackTintColor}
              thumbTintColor={thumbTintColor}
        />

     </View>

    )
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 30
  },
  valuesBlock: {
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  amountValueText: {
    textAlign: 'center'
  }
})

export default AmountSlider;