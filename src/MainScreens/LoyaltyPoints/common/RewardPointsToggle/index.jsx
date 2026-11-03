import { StyleSheet, View,Switch } from "react-native";
import {useTranslation} from "react-i18next";
import {TypographyText} from "../../../../components/Typography";
import {colors} from "../../../../components/colors";
import {BALOO_2,} from "../../../../redux/types";
import StarSvg from '../../../../assets/star.svg';
import useUserLoyaltyPoints from "../../../../hooks/useUserLoyaltyPoints";
import {isRTL} from "../../../../../utils";

const RewardsPointsToggle = ({ style, isChecked, onToggleSwitch, priceInPoints }) => {
  const { t } = useTranslation();
  const {points} = useUserLoyaltyPoints();
  const isRtl = isRTL();


  const handleToggleSwitch = () => {
      onToggleSwitch(isChecked => !isChecked)
  }


  return (
    <View style={[styles.wrapper, style, {backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder, flexDirection: isRtl ? "row-reverse": "row"}]}>

      <View style={[styles.leftBlock,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>
        <View style={[styles.iconWrapper,{backgroundColor: colors.loyaltyPrimaryIconBackground}]}>
          <StarSvg color={colors.loyaltyPrimary}/>
        </View>
      <View style={styles.textWrapper}>
        <TypographyText
          title={t('LoyaltyVouchers.rewardPoints')}
          textColor={colors.loyaltyTextSecondary}
          size={16}
          font={BALOO_2}
        />
         <TypographyText
          title={`${points} ${t('LoyaltyVouchers.pointsAvailable')}`}
          textColor={colors.loyaltyTextMainTitle}
          size={16}
          font={BALOO_2}
        />
      </View>
      </View>

      <View style={styles.container}>
        
        <Switch
          trackColor={{false: colors.loyaltySwitchBackground, true: colors.loyaltySwitchBackgroundActive}}
          thumbColor={isChecked ?colors.loyaltyThumbActive: colors.loyaltyThumbColor}
          onValueChange={handleToggleSwitch}
          value={isChecked}
       />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    height: 79,
    borderRadius: 38,
  },
  container: {
    width: 50,
  },
  leftBlock: {
    flexDirection: 'row',
    flex: 1
  },
  iconWrapper: {
    width: 37,
    height: 37,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textWrapper: {
    marginHorizontal: 11
  }
});

export default RewardsPointsToggle;
