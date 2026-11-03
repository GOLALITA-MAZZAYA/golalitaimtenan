import {FlatList, StyleSheet, TouchableOpacity, View} from "react-native";
import {colors} from "../../../../../components/colors";
import {TypographyText} from "../../../../../components/Typography";
import {BALOO_2} from "../../../../../redux/types";
import {useNavigation} from "@react-navigation/native";
import {useMemo} from "react";
import store from "../../../../../redux/store";
import {setOrderType} from "../../../../../redux/restaurant/restaurant-actions";
import TableReservationSvg from '../../../../../assets/loyaltyPoints/restaurants/table-reservation.svg'
import DeliveryTimeSvg from '../../../../../assets/loyaltyPoints/restaurants/delivery-time.svg'
import TakeawaySvg from '../../../../../assets/loyaltyPoints/restaurants/take-away.svg'
import {useTheme} from "../../../../../components/ThemeProvider";
import {isRTL} from "../../../../../../utils";
import {useTranslation} from "react-i18next";
import ListNoData from "../../../../../components/ListNoData";
import {getMerchantDiscount} from "../../../../../redux/loyalty/loyalty-thunks";

const iconSize = 45;

const OrderTab = ({restaurantId, restaurantData}) => {
    const navigation = useNavigation();
    const { isDark } = useTheme();
    const {t} = useTranslation();
    const isRtl = isRTL();

    const openOrderScreen = (type) => {
      store.dispatch(setOrderType(type));
      navigation.navigate('restaurant-book',{restaurantId, bookingFee: restaurantData.constraints.table_booking_fee});

      store.dispatch(getMerchantDiscount(restaurantData.merchant_id))
    };

    const iconColor = colors.primary;

    const config = useMemo(() => {
      return [
      {
        label: t('Restaurants.reservationTitle'),
        description: t('Restaurants.reservationDescription'),
        onPress: () => openOrderScreen('reservation'),
        icon: < TableReservationSvg height={iconSize} width={iconSize} fill={iconColor} path={iconColor} rect={iconColor} color={iconColor}/>,
        visible: restaurantData?.services_allowed?.allow_reservation
      },
      {
        label: t('Restaurants.deliveryTitle'),
        description: t('Restaurants.deliveryDescription'),
        onPress: () => openOrderScreen('delivery'),
        icon: < DeliveryTimeSvg height={iconSize} width={iconSize} fill={iconColor} path={iconColor} rect={iconColor} color={iconColor}/>,
        visible: restaurantData?.services_allowed?.allow_delivery
      },
      {
        label: t('Restaurants.takeawayTitle'),
        description: t('Restaurants.takeawayDescription'),
        onPress: () => openOrderScreen('takeaway'),
        icon: < TakeawaySvg height={iconSize} width={iconSize} fill={iconColor} path={iconColor} rect={iconColor} color={iconColor}/>,
        visible: restaurantData?.services_allowed?.allow_takeaway
      }].filter(item => item.visible)
    },[restaurantId, isDark, isRtl]);

   
    return (
       <View style ={styles.wrapper}>

        <FlatList 
          data={config}
          renderItem={({item}) => (
            <TouchableOpacity style={[styles.card,{backgroundColor: colors.cardBackground, borderColor: colors.mainBorder, flexDirection: isRtl ? 'row-reverse': 'row'}]} onPress={item.onPress}>
                <View style={[styles.logo,{backgroundColor: colors.smallCardBackground}]}>
                   {item.icon}
                </View>

                <View style={styles.descriptionBlock}>
                    <TypographyText
                        title={item.label}
                        textColor={colors.mainText}
                        size={18}
                        font={BALOO_2}
                    />

                   <TypographyText
                        title={item.description}
                        textColor={colors.textPrimary}
                        size={14}
                        font={BALOO_2}
                        style={styles.description}
                    />
                </View>
            </TouchableOpacity>
            
          )}
         ListEmptyComponent={<ListNoData style={styles.noData}/>}
        />

       </View>
    );
};

const styles = StyleSheet.create({
   wrapper: {
     flex: 1,
     marginTop: 20
   },
   card: {
     paddingVertical: 15,
     paddingHorizontal: 15,
     borderRadius: 12,
     flexDirection: 'row',
     marginBottom: 20
   },
   logo: {
     width: iconSize + 10,
     height: iconSize + 10,
     justifyContent: 'center',
     alignItems: 'center',
     borderRadius: 4
   },
   description: {
    marginTop: 4
   },
   descriptionBlock: {
     justifyContent: 'center',
     marginHorizontal: 15
   },
   noData: {
    marginTop: 20
   }
});

export default OrderTab;