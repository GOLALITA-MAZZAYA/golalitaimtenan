import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import {TypographyText} from "../../../../components/Typography";
import {colors} from "../../../../components/colors";
import {BALOO_2} from "../../../../redux/types";
import useUserLoyaltyPoints from "../../../../hooks/useUserLoyaltyPoints";
import {Switch} from "react-native-gesture-handler";
import {isRTL} from "../../../../../utils";
import {useDispatch, useSelector} from "react-redux";
import {toggleMerchantPointDiscount} from "../../../../redux/loyalty/loyalty-actions";
import {loyaltySelector} from "../../../../redux/loyalty/loyalty-selectors";


const AppointmentChart = ({style,usedPoints, remainingPoints, total, subtotal, fee, discount, serviesCount, adultsCount, childrenCount, duration}) => {
  const { t } = useTranslation();
  const {points} = useUserLoyaltyPoints();
  const {isPointsEnabled} = useSelector(loyaltySelector);
  const dispatch = useDispatch();
  const isRtl = isRTL();

  const config  = [
    {
      title: t("Saloons.services"),
      value: serviesCount,
      visible: !!serviesCount,
    },
    {
      title: t("Saloons.adults"),
      value: adultsCount,
      visible: !!adultsCount,
    },
    {
      title: t("Saloons.children"),
      value: childrenCount,
      visible: !!childrenCount,
    },
    {
      title: t("Saloons.pointsUsed"),
      value: usedPoints,
      visible: usedPoints,
    },
    {
      title: t("Saloons.remainingPoints"),
      value: remainingPoints,
      visible: remainingPoints,
    },
    {
      title: t("Saloons.subtotal"),
      value: `${subtotal} ${t('General.qar')}`,
      visible: !!serviesCount && subtotal,
    },
    {
      title: t("Saloons.totalFee"),
      value: `${fee} ${t('General.qar')}`,
      visible: !serviesCount,
    },
    {
      title: t("Saloons.discount"),
      value: `- ${discount} ${t('General.qar')}`,
      visible: !!discount,
    },
    {
      title: t('Saloons.totalDuration'),
      value: `${duration} min`,
      visible: duration,
    },
  ];


  const renderValue = (item) => {
    if (!item.value) {
      return null;
    }

    return (
      <View style={styles.itemWrapper} key={item.title}>
        <TypographyText
          title={item.title}
          textColor={colors.loyaltyTextMainTitle}
          size={item.isTotal ? 16: 14}
          font={BALOO_2}
          style={{fontWeight: item.isTotal ? '600': '400'}}
        />
        <TypographyText
          title={item.value}
          textColor={colors.loyaltyTextMainTitle}
          size={item.isTotal ? 16: 14}
          font={BALOO_2}
          style={{fontWeight: item.isTotal ? '600': '400'}}
        />
      </View>
    );
  };
 

  const totalConfig = {
    title: t("Vouchers.orderTotal"),
    value: `${total} ${t('General.qar')}`,
    isTotal: true,
  };

  const filteredConfig = config.filter((item) => item.visible);

  const setIsPointsActivated = () => {
    dispatch(toggleMerchantPointDiscount());
  }

  return (
    <View style={[style,styles.mainWrapper,{backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder}]}>
       <View style={[styles.pointsBlock,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>
            <View>
              <TypographyText
                title={t('LoyaltyVouchers.rewardPoints')}
                textColor={colors.loyaltyTextSecondary}
                size={16}
                font={BALOO_2}
              />
               <TypographyText
                title={`${points} ${t('LoyaltyVouchers.pointsAvailable')}`}
                textColor={colors.loyaltyTextMainTitle}
                size={14}
                font={BALOO_2}
              />
            </View>
  
      
            <View style={styles.container}>
              
              <Switch
                trackColor={{false: colors.loyaltySwitchBackground, true: colors.loyaltySwitchBackgroundActive}}
                thumbColor={isPointsEnabled ? colors.loyaltyThumbActive: colors.loyaltyThumbColor}
                onValueChange={setIsPointsActivated}
                value={isPointsEnabled}
             />
             </View>
       </View>
      <View style={[styles.wrapper,{borderBottomColor: colors.loyaltyTextSecondary}]}>{filteredConfig.map(renderValue)}</View>
      {renderValue(totalConfig)}
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 18,
    
  },
  wrapper: {
    borderBottomWidth: 1,
    paddingBottom: 10
  },
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10
  },
  pointsBlock: {
    flex: 1,
    justifyContent: 'space-between'
  }
});

export default AppointmentChart;
