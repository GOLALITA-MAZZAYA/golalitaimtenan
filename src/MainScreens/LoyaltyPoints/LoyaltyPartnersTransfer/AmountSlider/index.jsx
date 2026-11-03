import {useTheme} from "../../../../components/ThemeProvider";
import {colors} from "../../../../components/colors";
import {useState} from "react";
import {StyleSheet, View} from "react-native";
import {TypographyText} from "../../../../components/Typography";
import Slider from "@react-native-community/slider";
import RightArrowSvg from '../../../../assets/loyaltyPoints/rightArrow.svg';
import {isRTL} from "../../../../../utils";
import {BALOO_2} from "../../../../redux/types";
import {useTranslation} from "react-i18next";

const minimumValue = 100;
const maximumValue = 10000;
const step = 50;

const AmountSlider = ({onChange}) => {
    const [value, setValue] = useState(`${minimumValue}`);
    const isRtl = isRTL();
    const {t} = useTranslation();


    const maximumTrackTintColor = colors.loyaltyPrimary;
    const thumbTintColor = colors.loyaltySecondary;

    return (
      <View style={styles.wrapper} >

      <View style={[styles.pointsInfo,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>

        <View style={styles.infoBlock}>
          <TypographyText
            textColor={colors.loyaltyTextMainTitle}
            title={`${value}`}
            style={styles.pointsInfoText}
            size={26}
            font={BALOO_2}
           />
           <TypographyText
            textColor={colors.loyaltyTextSecondary}
            title={t('LoyaltyPartners.points')}
            style={styles.amountValueText}
            font={BALOO_2}
           />

        </View>

        <View style={[styles.arrowWrapper,{backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder}]}>
          <RightArrowSvg color={colors.loyaltyPrimary}/>
        </View>

        <View style={styles.infoBlock}>
          <TypographyText
            textColor={colors.loyaltyPrimary}
            title={`${value}`}
            style={styles.pointsInfoText}
            size={26}
            font={BALOO_2}
           />
           <TypographyText
            textColor={colors.loyaltyPrimary}
            title={t('LoyaltyPartners.partnerPoints')}
            style={styles.amountValueText}
            font={BALOO_2}
           />

        </View>

      </View>
        
         <TypographyText
            textColor={colors.loyaltyPrimary}
            title={t('LoyaltyPartners.pointsLabel')}
            style={styles.sliderTitle}
            size={16}
            font={BALOO_2}
          />

        <Slider
              minimumValue={minimumValue}
              maximumValue={maximumValue}
              step={step}
              onValueChange={setValue}
              onSlidingComplete={onChange}
              maximumTrackTintColor={maximumTrackTintColor}
              minimumTrackTintColor={colors.loyaltySecondary}
              thumbTintColor={thumbTintColor}
        />

         <View style={styles.valuesBlock}>

          <TypographyText
            textColor={colors.loyaltyPrimary}
            title={`${minimumValue}`}
            style={styles.startValue}
            font={BALOO_2}
            size={20}
           />

          <TypographyText
            textColor={colors.loyaltyTextSecondary}
            title={`${maximumValue}`}
            style={styles.endValue}
            font={BALOO_2}
            size={20}
           />        

        </View>

     </View>

    )
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 35
  },
  valuesBlock: {
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  amountValueText: {
    textAlign: 'center'
  },
  arrowWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 28
  },
  pointsInfo: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  pointsInfoText: {
    fontWeight: '700'
  },
  infoBlock: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  sliderTitle:{
    marginHorizontal: 5,
    marginTop: 33
  },
  startValue: {
    fontWeight: '700'
  },
  endValue: {
    
  }
})

export default AmountSlider;