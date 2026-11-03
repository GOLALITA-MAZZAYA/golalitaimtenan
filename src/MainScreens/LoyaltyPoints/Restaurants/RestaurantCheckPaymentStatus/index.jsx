import { ScrollView, StyleSheet} from "react-native";
import Header from "../../../../components/Header";
import MainLayout from "../../../../components/MainLayout";
import {useTranslation} from "react-i18next";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import useOrderPaymentStatus from "../hooks/useOrderPaymentStatus";
import BookSuccess from "./BookSuccess";
import {CommonActions} from "@react-navigation/native";
import OrderSuccess from "./OrderSuccess";
import useOrderDetails from "../hooks/useOrderDetails";
import useBookTableDetails from "../hooks/useBookTableDetails";
import PaymentError from "../../common/PaymentError";
import {useEffect, useRef} from "react";
import {executePoints, executeRewardPoints} from "../../../../api/loyalty";
import {useSelector} from "react-redux";
import {loyaltySelector} from "../../../../redux/loyalty/loyalty-selectors";

const RestaurantCheckPaymentStatus = ({route, navigation}) => {
    const {orderReference, orderId} = useSelector(loyaltySelector);
    const isPointsExecuted = useRef(false);

    const paymentStatus = route.params?.status;
    const orderType = route.params?.type;
    const usedPoints = route.params?.usedPoints;
    const totalAmount = route.params?.totalAmount;

    const {t} = useTranslation();
    const {data, loading} = useOrderPaymentStatus(orderId, orderReference, orderType);

    const reference = data?.data?.reference;
    const orderDetailsHookEnabled = orderType === 'order' && !!data?.data?.reference;
    const bookingDetailsHookEnabled = orderType === 'booking' && !!data?.data?.reference;

    const {data:orderData, loading: orderLoading} = useOrderDetails(reference,{enabled: orderDetailsHookEnabled});
    const {data:reservationData, loading: reservationLoading} = useBookTableDetails(reference,{enabled: bookingDetailsHookEnabled});

    const isPaymentSuccessfull = !loading && !!data && data?.data?.payment_complete && data?.data.has_skipcash_payment && paymentStatus !== 'Failed';

    const isOrderDetailsVisible = !!orderData && orderType === 'order' &&  isPaymentSuccessfull;
    const isBookingDetailsVisible = !!reservationData && orderType === 'booking' &&  isPaymentSuccessfull;


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
          const merchantId = orderType === 'order' ? orderData.marchant_id: reservationData.merchant_id;

          
          if (usedPoints && usedPoints !== 'undefined' && Number(usedPoints) > 0) {
            console.log(usedPoints, typeof usedPoints, usedPoints?.length);
            const res = await executePoints(merchantId, usedPoints);
        
            console.log(res,'executePoints res')
          }else {

            const res = await executeRewardPoints(merchantId, Number(totalAmount));

            console.log(res,'executeRewardPoints res')
          }
        
          isPointsExecuted.current = true;
           
        
        }catch(err){
          console.log(err,'execute points error')
        }
    };
            
        
  useEffect(() => {
    const merchantId = orderType === 'order' ? orderData?.marchant_id: reservationData?.merchant_id;
    
      if(!!isPaymentSuccessfull && !isPointsExecuted.current && merchantId){
          modifyPoints()
      }
   },[isPaymentSuccessfull, !!orderData, !!reservationData]);

   const loadingData = loading || orderLoading || reservationLoading;

    const title = loadingData ? '': isPaymentSuccessfull ? t('Restaurants.paymentSuccessful'): t('Restaurants.paymentFailed');
    
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
        {!loading  && !orderLoading && !reservationLoading &&(<ScrollView contentContainerStyle={styles.contentStyle} showsVerticalScrollIndicator={false}>

        {isBookingDetailsVisible && <BookSuccess onSubmitPress={goBack} data={reservationData} paymentStatus={data?.data?.record_state}/>}

        {isOrderDetailsVisible && <OrderSuccess onSubmitPress={goBack} data={orderData} totalAmount={orderData.total_amount}/>}

        {!isPaymentSuccessfull && <PaymentError onSubmitPress={goBack}/>}

        </ScrollView>)}
        {(loading  || orderLoading || reservationLoading) && <FullScreenLoader/>}

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

export default RestaurantCheckPaymentStatus;
