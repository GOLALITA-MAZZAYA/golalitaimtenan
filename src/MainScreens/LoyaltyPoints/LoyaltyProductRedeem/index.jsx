import {StyleSheet} from "react-native";
import MainLayout from "../../../components/MainLayout";
import Header from "../../../components/Header";
import RedeemLayout from "../common/RedeemLayout";
import {showMessage} from "react-native-flash-message";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {redeemLoyaltyProduct, sendProductEmail, trackProduct} from "../../../api/loyalty";
import {navigate} from "../../../Navigation/RootNavigation";

const LoayltyProductRedeem = ({route}) => {
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation();
    const {id, title, price, subTitle} = route.params

    const handleRedeemPress = async () => {
        try{
          setLoading(true);

        const res = await redeemLoyaltyProduct(id);

        if(res.error){
          showMessage({
            message: res.error,
            type: 'danger'
          })

          return
        }

        console.log(res,'res');

        const trackRes = await trackProduct(id, 'loyalty-offer');

        console.log(trackRes,'trackRes')

        const sendEmailRes = await sendProductEmail(id, 'loyalty-offer');

        console.log(sendEmailRes,'sendEmailRes')

        navigate('loyaltyPoints-products-redeem-success',{
            name: title,
            description: subTitle
        })


        }catch(err){
          console.log(err,'redeem error')

          showMessage({
            message: 'Something went wrong'
          })

        }finally{
          setLoading(false)
        }
    }

    return (
      <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={t('LoyaltyMain.redeem')} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
        <RedeemLayout title={title} subTitle={subTitle} price={price} loading={loading} onRedeemPress={handleRedeemPress} />
      </MainLayout>
    )
};

const styles = StyleSheet.create({
   contentStyle: {
    flex: 1,
    paddingHorizontal: 20
   }
});

export default LoayltyProductRedeem

