import {StyleSheet, View} from "react-native";
import SuccessBtn from "../../../common/SuccessBtn";
import {TypographyText} from "../../../../../components/Typography";
import {BALOO_2} from "../../../../../redux/types";
import {colors} from "../../../../../components/colors";
import {useTranslation} from "react-i18next";
import QrCode from "../../common/QrCode";
import OrderedItemsForm from "../../common/OrderedItemsForm";
import Button from "../../../../../components/Button";

const OrderSuccess = ({data, onSubmitPress, totalAmount}) => {
    const {t} = useTranslation();

    return (
       <View style={styles.wrapper}>

        <SuccessBtn style={styles.succesBtn}/>

        <TypographyText 
          font={BALOO_2}
          size={32}
          textColor={colors.loyaltyTextMainTitle}
          title={t('Restaurants.done')}
          style={styles.confirmText}
        />

        <TypographyText 
          font={BALOO_2}
          size={16}
          textColor={colors.loyaltyTextSecondary}
          title={t('Restaurants.orderSuccessDescription')}
          style={styles.confirmTextSecondary}
        />

        {data.qr_code_url && <QrCode uri={data.qr_code_url} style={styles.qrCode}/>}

        <OrderedItemsForm items={data.items} style={styles.itemsForm} total={totalAmount} expectedCookingTime={data.estimated_cooking_time}/>

        <Button
            onPress={onSubmitPress}
            text={t('Restaurants.confirm')}
            style={styles.confirmBtn}
        />

       </View>
    );
};

const styles = StyleSheet.create({
   wrapper: {

   },
   succesBtn: {
     marginTop: 15,
     alignSelf: 'center'
   },
   confirmText: {
    fontWeight: '700',
    marginTop: 20,
    alignSelf: 'center'
   },
   confirmTextSecondary:{
    marginTop: 5,
    alignSelf: 'center'
   },
   block: {
    marginTop: 15
   },
   itemsForm: {
    marginTop: 20
   },
   confirmBtn: {
    marginTop: 25
   },
   qrCode: {
    alignSelf: 'center',
    marginTop: 20
   }
})

export default OrderSuccess;