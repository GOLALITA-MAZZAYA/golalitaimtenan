import { ScrollView, StyleSheet} from "react-native";
import Header from "../../../../components/Header";
import MainLayout from "../../../../components/MainLayout";
import {useTranslation} from "react-i18next";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import {CommonActions} from "@react-navigation/native";
import SaloonBookSuccess from "./SaloonBookSuccess";
import PaymentError from "../../common/PaymentError";
import useSallonPaymentStatus from "../hooks/useSaloonPaymentStatus";
import useSaloonAppointmentDetails from "../hooks/useSaloonAppointmentDetails";
import {useEffect, useRef} from "react";
import {executePoints, executeRewardPoints} from "../../../../api/loyalty";
import {loyaltySelector} from "../../../../redux/loyalty/loyalty-selectors";
import {useSelector} from "react-redux";

const SaloonsPaymentStatus = ({route, navigation}) => {
    const {orderId} = useSelector(loyaltySelector);

    const usedPoints = route.params?.usedPoints;
    const totalAmount = route.params?.totalAmount;

    const {t} = useTranslation();
    const {data, loading} = useSallonPaymentStatus(orderId);


    const isPointsExecuted = useRef(false);
;
    const isPaymentSuccessfull = !loading && !!data && data?.data?.payment_complete && data?.data.has_skipcash_payment && paymentStatus !== 'Failed';
    const {data:saloonDetails, loading: saloonDetailsLoading} = useSaloonAppointmentDetails(orderId, isPaymentSuccessfull);

    const isDetailsVisible = !!saloonDetails?.appointment_id &&  isPaymentSuccessfull;

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
              const res = await executePoints(saloonDetails.merchant_id, usedPoints);
    
              console.log(res,'executePoints res')
            }else {
              const res = await executeRewardPoints(saloonDetails.merchant_id, totalAmount);
              console.log(res,'executeRewardPoints res')
            }
    
            isPointsExecuted.current = true;
       
    
          }catch(err){
            console.log(err,'execute points error')
          }
    };
        
        useEffect(() => {
          if(!!isPaymentSuccessfull && !!saloonDetails?.merchant_id && !isPointsExecuted.current){
             modifyPoints()
          }
        },[isPaymentSuccessfull, !!saloonDetails])

    const title = isPaymentSuccessfull ? t('Restaurants.paymentSuccessful'): t('Restaurants.paymentFailed');
    
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
        {!loading  && (<ScrollView contentContainerStyle={styles.contentStyle} showsVerticalScrollIndicator={false}>

        {isDetailsVisible && <SaloonBookSuccess onSubmitPress={goBack} data={saloonDetails} />}

        {!isPaymentSuccessfull && <PaymentError onSubmitPress={goBack}/>}

        </ScrollView>)}
        {(loading  || saloonDetailsLoading) && <FullScreenLoader/>}

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

export default SaloonsPaymentStatus;
