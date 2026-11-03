import {StyleSheet,TouchableOpacity,View} from "react-native"
import {colors} from "../../../../../components/colors";
import {TypographyText} from "../../../../../components/Typography";
import {BALOO_2} from "../../../../../redux/types";
import ArrowRightSvg from '../../../../../assets/arrow_right.svg';
import {isRTL} from "../../../../../../utils";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentForm} from "../../../../../redux/restaurant/restaurant-selectors";
import {useTranslation} from "react-i18next";
import {loyaltySelector} from "../../../../../redux/loyalty/loyalty-selectors";
import {getAmountInfo, getTotalProductsQuantity} from "../../../helpers";
import {Switch} from "react-native-gesture-handler";
import useUserLoyaltyPoints from "../../../../../hooks/useUserLoyaltyPoints";
import {toggleMerchantPointDiscount} from "../../../../../redux/loyalty/loyalty-actions";


const ChartBlock = ({onPress, title, submitBtnText="Continue", type = 'order', style}) => {
    const form = useSelector(selectCurrentForm);
    const itemsInsideForm = form?.items;
    const {t} = useTranslation();
    const loyaltyState = useSelector(loyaltySelector);
    const discountPercentage = loyaltyState?.merchantDiscount?.rule?.discount_percentage;
    const totalProductsQuantity = getTotalProductsQuantity(itemsInsideForm);
    const {points} = useUserLoyaltyPoints();
    const dispatch = useDispatch();

    const {amount, discount, total_amount, usedPoints, remainingPoints} = getAmountInfo(itemsInsideForm,{order_type: type, discountPercentage, bookingFee: form.bookingFee});

    const setIsPointsActivated = () => {
      dispatch(toggleMerchantPointDiscount());
    }

    const isRtl = isRTL();

    console.log(total_amount,'total amount')

    
    return (
       <View style={[styles.wrapper,{backgroundColor: colors.cardBackground}, style]}>

          <View>
            {title && <View style={[styles.titleBlock,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>
                <TypographyText 
                  font={BALOO_2}
                  title={title}
                  textColor={colors.mainText}
                />

               <TouchableOpacity disabled={ type === 'order' ? !totalProductsQuantity : false } style={{flexDirection: isRtl ? 'row-reverse': 'row', alignItems: 'center'}} onPress={onPress}>

                <TypographyText 
                  font={BALOO_2}
                  title={submitBtnText}
                  textColor={colors.primary}
                />

               <ArrowRightSvg height={15} width={15} color={colors.primary} style={{transform: [{ rotate: isRtl ?  "180deg": '0deg' }]}}/>

               </TouchableOpacity>

            </View>}

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
                            thumbColor={loyaltyState.isPointsEnabled ? colors.loyaltyThumbActive: colors.loyaltyThumbColor}
                            onValueChange={setIsPointsActivated}
                            value={loyaltyState.isPointsEnabled}
                         />
                         </View>
                   </View>
              {!!usedPoints && <View style={styles.priceBlock}>

                <TypographyText 
                  font={BALOO_2}
                  title={t('Restaurants.pointsUsed')}
                  textColor={colors.textSecondary}
                  size={15}
                />

                <TypographyText 
                  font={BALOO_2}
                  title={usedPoints.toString()}
                  textColor={colors.textSecondary}
                  size={15}
                />
             </View>}
              {!!remainingPoints && <View style={styles.priceBlock}>
                <TypographyText 
                  font={BALOO_2}
                  title={t('Restaurants.remainingPoints')}
                  textColor={colors.textSecondary}
                  size={15}
                />
                <TypographyText 
                  font={BALOO_2}
                  title={remainingPoints.toString()}
                  textColor={colors.textSecondary}
                  size={15}
                />
             </View>}

            {!!totalProductsQuantity && <View style={styles.priceBlock}>
                <TypographyText 
                  font={BALOO_2}
                  title={`${totalProductsQuantity} ${t('Restaurants.items')}`}
                  textColor={colors.textSecondary}
                  size={15}
                />
                <TypographyText 
                  font={BALOO_2}
                  title={`${amount.toString()} ${t('Restaurants.qar')}`}
                  textColor={colors.textSecondary}
                  size={15}
                />
            </View>}
              {((type !== 'reservation' && !!discountPercentage) || (!!discountPercentage && type === 'reservation' && !!itemsInsideForm.length)) && <View style={styles.priceBlock}>
                {!!discountPercentage &&  <TypographyText 
                  font={BALOO_2}
                  title={`${t('Restaurants.discount')} (${discountPercentage.toString()}%)`}
                  textColor={colors.textSecondary}
                  size={15}
                />}

                {!!itemsInsideForm.length && <TypographyText 
                  font={BALOO_2}
                  title={`- ${discount.toString() || "0"} ${t('Restaurants.qar')}`}
                  textColor={colors.textSecondary}
                  size={15}
                />}

            </View>}
             {type === 'reservation' && !itemsInsideForm.length &&
              <View style={styles.priceBlock}>
                <TypographyText 
                  font={BALOO_2}
                  title={t('Restaurants.fee')}
                  textColor={colors.textSecondary}
                  size={15}
                />

                <TypographyText 
                  font={BALOO_2}
                  title={`${form.bookingFee?.toString()} ${t('Restaurants.qar')}`}
                  textColor={colors.textSecondary}
                  size={15}
                />

            </View>}
             <View style={styles.priceBlock}>
                <TypographyText 
                  font={BALOO_2}
                  title={t('Restaurants.total')}
                  textColor={colors.mainText}
                  size={18}
                  style={styles.totalText}
                />
                <TypographyText 
                  font={BALOO_2}
                  title={`${total_amount.toString()} ${t('Restaurants.qar')}`}
                  textColor={colors.mainText}
                  size={18}
                  style={styles.totalText}
                />

            </View>
          </View>
        
       </View>
    )    
};

const styles = StyleSheet.create({
    wrapper: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 30,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12
    },
    titleBlock: {
      marginBottom: 15,
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    priceBlock: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 6
    },
    totalText: {
      fontWeight: '600'
    },
    pointsBlock: {
      justifyContent: 'space-between'
    },
    container: {
      marginHorizontal: 10
    }
});

export default ChartBlock