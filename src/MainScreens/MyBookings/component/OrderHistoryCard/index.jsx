import {StyleSheet, TouchableOpacity, View} from "react-native";
import Image from "../../../../components/AppImage";
import {colors} from "../../../../components/colors";
import {isRTL} from "../../../../../utils";
import {TypographyText} from "../../../../components/Typography";
import {BALOO_2} from "../../../../redux/types";
import {getStatusColor, getStatusTranslation} from "../../../../components/AppointmentCard/helpers";
import {formatDate} from "../../../LoyaltyPoints/Clinics/helpers";
import {useTranslation} from "react-i18next";

const OrderHistoryCard = ({date, reference, name, status, onPress, itemsCount, totalAmount, logo, type, style}) => {
    const isRtl = isRTL();
    const {t} = useTranslation();

    return (
        <TouchableOpacity onPress={() => onPress(reference, type)}  style={[styles.wrapper,{backgroundColor: colors.cardBackground, borderColor: colors.mainBorder, flexDirection: isRtl ? 'row-reverse': 'row'}, style]}>
         
         <Image source={{uri: logo}} style={[styles.logo,{borderColor: colors.mainBorder}]}/>
            
          <View style={[styles.descriptionBlock,{alignItems: isRtl? 'flex-end': 'flex-start'}]}>

            <TypographyText 
              font={BALOO_2}
              title={name}
              textColor={colors.mainText}
              size={16}
            />

            <TypographyText 
              font={BALOO_2}
              title={`${t('Restaurants.itemsUppercase')}: ${itemsCount}`}
              textColor={colors.textPrimary}
              size={12}
              style={styles.specialtyText}
            />

            <TypographyText 
              font={BALOO_2}
              title={`${t('Restaurants.price')}: ${totalAmount} ${t('Restaurants.qar')}`}
              textColor={colors.textPrimary}
              size={12}
              style={styles.specialtyText}
            />

            <TypographyText 
              font={BALOO_2}
              title={`${t('Restaurants.type')}: ${type}`}
              textColor={colors.textPrimary}
              size={12}
              style={styles.specialtyText}
            />


          </View>

          {!!status && <View style={[styles.statusBlock,{alignItems: isRtl ? 'flex-start': 'flex-end'}]}>

            <TypographyText 
              font={BALOO_2}
              title={getStatusTranslation(status)}
              textColor={getStatusColor(status)}
              size={12}
              weight="500"
            />

            <TypographyText 
              font={BALOO_2}
              title={formatDate(date)}
              textColor={colors.textSecondary}
              size={12}
              style={styles.dateText}
            />

          </View>}
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
   wrapper: {
     width: '100%',
     borderWidth: 1,
     borderRadius: 34,
     padding: 16
   },
   logo: {
     width: 59,
     height: 59,
     borderRadius: 14,
     borderWidth: 1
   },
   descriptionBlock: {
    marginHorizontal: 8,
    flex: 1,
    alignItems: 'flex-start'
   },
   specialtyText: {
    marginTop: 5
   },
   tag: {
    marginTop: 5
   },
   dateText: {
    marginTop: 8
   }
});

export default OrderHistoryCard