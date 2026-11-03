import { ScrollView, StyleSheet} from "react-native";
import Header from "../../../../components/Header";
import MainLayout from "../../../../components/MainLayout";
import {useTranslation} from "react-i18next";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import {CommonActions} from "@react-navigation/native";
import ClinicBookSuccess from "./BookSuccess";
import useClinicAppointmentStatus from "../hooks/useClinicPaymentStatus";
import PaymentError from "../../common/PaymentError";
import useAppointmentDetails from "../hooks/useAppointmentDetails";
import {executePoints, executeRewardPoints} from "../../../../api/loyalty";
import {useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import {loyaltySelector} from "../../../../redux/loyalty/loyalty-selectors";

const ClinicPaymentStatus = ({route, navigation}) => {
    const {orderId} = useSelector(loyaltySelector);
    const paymentStatus = route.params?.status;
    const usedPoints = route.params?.usedPoints;
    const totalAmount = route.params?.totalAmount;
    const isPointsExecuted = useRef(false);

    const {t} = useTranslation();
    const {data, loading} = useClinicAppointmentStatus(orderId);

    const reference = data?.data?.booking_reference;
    const isPaymentSuccessfull = !loading && !!data && data?.data?.payment_complete && data?.data.has_skipcash_payment && paymentStatus !== 'Failed';

    const {data:apointmentDetails, loading: appointmentDetailsLoading} = useAppointmentDetails(reference, isPaymentSuccessfull);

    const isDetailsVisible = !!apointmentDetails &&  isPaymentSuccessfull;


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
    };

    const modifyPoints = async () => {
      try{
        if (usedPoints && usedPoints !== 'undefined' && Number(usedPoints) > 0) {
          const res = await executePoints(apointmentDetails.merchant_id, usedPoints);

          console.log(res,'executePoints res')
        }else {
          const res = await executeRewardPoints(apointmentDetails.merchant_id, totalAmount);
          console.log(res,'executeRewardPoints res')
        }

        isPointsExecuted.current = true;
   

      }catch(err){
        console.log(err,'execute points error')
      }
    };
    

    useEffect(() => {
      if(!!isPaymentSuccessfull && !!apointmentDetails?.merchant_id && !isPointsExecuted.current){
         modifyPoints()
      }
    },[isPaymentSuccessfull, !!apointmentDetails])

    const dataLoading = loading || appointmentDetailsLoading;

    const title = dataLoading ? '': isPaymentSuccessfull ? t('Restaurants.paymentSuccessful'): t('Restaurants.paymentFailed');
    
    return (
      <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header btns={['back']} label={title} additionalBtnsProps={{
            back: {
                onPress: goBack
            }
          }}/>
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
        {!loading  && !appointmentDetailsLoading && (<ScrollView contentContainerStyle={styles.contentStyle} showsVerticalScrollIndicator={false}>

        {isDetailsVisible && <ClinicBookSuccess onSubmitPress={goBack} data={apointmentDetails}/>}

        {!isPaymentSuccessfull && <PaymentError onSubmitPress={goBack}/>}

        </ScrollView>)}
        {dataLoading && <FullScreenLoader/>}

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
});

export default ClinicPaymentStatus;
