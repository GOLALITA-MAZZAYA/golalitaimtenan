import { ScrollView, StyleSheet} from "react-native";
import Header from "../../../../components/Header";
import MainLayout from "../../../../components/MainLayout";
import {TypographyText} from "../../../../components/Typography";
import {BALOO_2} from "../../../../redux/types";
import {useTranslation} from "react-i18next";
import {colors} from "../../../../components/colors";
import AppointmentCard from "../../../../components/AppointmentCard";
import SuccessBtn from "../../common/SuccessBtn";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import {CommonActions} from "@react-navigation/native";
import AppointmentCardValue from "../../../../components/AppointmentCard/AppointmentCardValue";
import {getOrderStatus} from "../../../../api/restaurants";
import {isRTL} from "../../../../../utils";
import useOrderDetails from "../hooks/useOrderDetails";
import OrderedItemsForm from "../common/OrderedItemsForm";
import Button from "../../../../components/Button";
import QrCode from "../common/QrCode";

const RestaurantOrderSuccess = ({route, navigation}) => {
    const reference = route.params?.reference;
    const {t} = useTranslation();
    const {data, loading} = useOrderDetails(reference);
    const isRtl = isRTL();

    const goBack = () => {
          navigation.dispatch(state => {
                    const firstRoute = state.routes[0];

                    return CommonActions.reset({
                    index: 0,
                        routes: [
                        {
                            name: firstRoute.name,
                            params: firstRoute.params, 
                        },
                    ],
                 });
            });
    }

    console.log(data,'order details');

    
    return (
      <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header btns={['back']} label={t('Clinics.bookingConfirmationTitle')} additionalBtnsProps={{
            back: {
              onPress: goBack
            }
          }}/>
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
        {!loading && !!data && (<ScrollView contentContainerStyle={styles.contentStyle} showsVerticalScrollIndicator={false}>

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

        <OrderedItemsForm items={data.items} style={styles.itemsForm} expectedCookingTime={data.estimated_cooking_time}/>

        <Button
            onPress={goBack}
            text={t('Restaurants.confirm')}
            style={styles.confirmBtn}
        />

        </ScrollView>)}
        {loading  && <FullScreenLoader/>}

      </MainLayout>
    )
};

const styles = StyleSheet.create({
   contentStyle: {
    paddingHorizontal: 10,
    paddingBottom: 100,
    flexGrow: 1
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
});

export default RestaurantOrderSuccess;
