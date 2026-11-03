import { ScrollView, StyleSheet} from "react-native";
import Header from "../../../../components/Header";
import MainLayout from "../../../../components/MainLayout";
import {useTranslation} from "react-i18next";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import useOrderDetails from "../hooks/useOrderDetails";
import OrderedItemsForm from "../common/OrderedItemsForm";
import Button from "../../../../components/Button";
import {canCancelOrder, canReOrder} from "../helpers";
import {confirmAction} from "../../../../helpers";
import {cancelOrderThunk} from "../../../../redux/restaurant/restaurant-thunks";
import {useDispatch, useSelector} from "react-redux";
import {restaurantLoadingSelector} from "../../../../redux/restaurant/restaurant-selectors";
import {setOrderType} from "../../../../redux/restaurant/restaurant-actions";
import QrCode from "../common/QrCode";

const RestaurantOrderInfo = ({route, navigation}) => {
    const reference = route.params?.reference;
    const type = route.params?.type;
    const status = route.params?.status;

    const {t} = useTranslation();
    const restaurantLoading = useSelector(restaurantLoadingSelector);
    const {data, loading} = useOrderDetails(reference);
    const dispatch = useDispatch();

    const handleAddressPress = () => {
      dispatch(setOrderType('type'));
      navigation.navigate('booking-restaurant-order-edit',{orderId: data.order_id});
    };

      const handleCancelAppointment = async () => {

    
            const res = await dispatch(cancelOrderThunk(reference));
    
    
            if(res.success){
               navigation?.goBack()
            }
        };
    
    
    const handleCancelPress = () => {
    
        confirmAction({
          message: t('Restaurants.cancelOrder'),
          title: t('Restaurants.confirm'),
          cancelText: t('Restaurants.cancel'),
          okText: t('Restaurants.ok'),
          onConfirm: handleCancelAppointment,
        });
    }
    
    return (
      <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header btns={['back']} label={t('Restaurants.orderDetailsTitle')} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
        {!loading && !restaurantLoading && !!data && (<ScrollView contentContainerStyle={styles.contentStyle} showsVerticalScrollIndicator={false}>

          {data.qr_code_url && <QrCode uri={data.qr_code_url} style={styles.qrCode}/>}

        <OrderedItemsForm 
           items={data.items}
           style={styles.itemsForm}
           expectedCookingTime={data.estimated_cooking_time} 
           total={data.total_amount}
           discount={data.discount}
        />

        {canReOrder(type, status) && <Button
            onPress={handleAddressPress}
            text={t('Restaurants.resubmitOrderBtn')}
            style={styles.confirmBtn}
        />}

        {canCancelOrder(type, status) && <Button
            onPress={handleCancelPress}
            text={t('Restaurants.cancelOrderBtn')}
            style={styles.confirmBtn}
        />}

        </ScrollView>)}
        {(loading  || restaurantLoading) && <FullScreenLoader/>}

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
    alignSelf: 'center'
   }
});

export default RestaurantOrderInfo;
