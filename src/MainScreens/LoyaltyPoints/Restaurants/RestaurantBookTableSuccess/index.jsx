import { ScrollView, StyleSheet} from "react-native";
import Header from "../../../../components/Header";
import MainLayout from "../../../../components/MainLayout";
import {TypographyText} from "../../../../components/Typography";
import {BALOO_2} from "../../../../redux/types";
import {useTranslation} from "react-i18next";
import {colors} from "../../../../components/colors";
import AppointmentCard from "../../../../components/AppointmentCard";
import SuccessBtn from "../../common/SuccessBtn";
import useRestaurantBookingInfo from "../../../PremiumPartner/hooks/useRestaurantBookingInfo";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import {CommonActions} from "@react-navigation/native";
import AppointmentCardValue from "../../../../components/AppointmentCard/AppointmentCardValue";

const RestaurantBookTableSuccess = ({route, navigation}) => {
    const reference = route.params?.reference;
    const {t} = useTranslation();
    const {data, loading} = useRestaurantBookingInfo(reference);

    console.log(data,'data faf')

    return (
      <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header btns={['back']} label={t('Clinics.bookingConfirmationTitle')} additionalBtnsProps={{
            back: {
              onPress: () => {
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
            }
          }}/>
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
        {!loading && (<ScrollView contentContainerStyle={styles.contentStyle} showsVerticalScrollIndicator={false}>

        <SuccessBtn style={styles.succesBtn}/>

        <TypographyText 
          font={BALOO_2}
          size={32}
          textColor={colors.loyaltyTextMainTitle}
          title={t('Restaurants.bookingDoneTitle')}
          style={styles.confirmText}
        />

        <TypographyText 
          font={BALOO_2}
          size={16}
          textColor={colors.loyaltyTextSecondary}
          title={t('Restaurants.qrCodeDescription')}
          style={styles.confirmTextSecondary}
        />

        <AppointmentCard qrCode={data.qr_code_url} status={data.status} bookingReference={data.reference}>
          <AppointmentCardValue title={t('Restaurants.restaurant')} value={data.restaurant} style={styles.block}/>

          <AppointmentCardValue title={t('Restaurants.date')} value={data.datetime} style={styles.block}/>
        </AppointmentCard>

        </ScrollView>)}
        {loading  && <FullScreenLoader absolutePosition={true} style={styles.loader}/>}

      </MainLayout>
    )
};

const styles = StyleSheet.create({
   contentStyle: {
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingBottom: 100,
    flexGrow: 1
   },
   succesBtn: {
     marginTop: 15
   },
   confirmText: {
    fontWeight: '700',
    marginTop: 20
   },
   confirmTextSecondary:{
    marginTop: 5
   },
   block: {
    marginTop: 15
   }
});

export default RestaurantBookTableSuccess;
