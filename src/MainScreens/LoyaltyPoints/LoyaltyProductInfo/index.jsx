import { ScrollView, StyleSheet } from "react-native";
import Header from "../../../components/Header";
import MainLayout from "../../../components/MainLayout";
import {useEffect, useState} from "react";
import {getLoyaltyProductDetails} from "../../../api/loyalty";
import FullScreenImageModal from "../../AllOffers/OfferInfo/components/FullScreenImageModal";
import {SCREEN_HEIGHT} from "../../../styles/mainStyles";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import NoData from "../../Transactions/components/NoData";
import {useTranslation} from "react-i18next";
import {colors} from "../../../components/colors";
import {isRTL} from "../../../../utils";
import DescriptionSvg from '../../../assets/loyaltyPoints/description.svg';
import ExpireDateBlock from "../common/ExpireDateBlock";
import Swiper from "./Swiper";
import InfoWithTitleBlock from "../../../components/InfoWithTitleBlock";
import Button from "../../../components/Button";

const LoyaltyProductInfo = ({route, navigation}) => {
    const {i18n, t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState([]);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);

    const product_id = route.params.product_id;
    const isArabic = i18n.language === 'ar';
    const isRtl = isRTL();


    const getProductInfo = async () => {
        try{
            setLoading(true);

            const product = await getLoyaltyProductDetails(product_id);

            setData(product)

        }catch(err){

        }finally{
            setLoading(false)
        }
    };


    useEffect(() => {
       getProductInfo()
    },[])

   const closeModal = () => {
    setSelectedImageUrl(null);
   };

   const handleImagePress = (url) => {
    setSelectedImageUrl(url);
   };


   const handleRedeemPress = () => {

      navigation.navigate('loyaltyPoints-products-redeem',{
        title: isArabic ? data.merchant_name_arabic : data.merchant_name,
        subTitle: isArabic ? data.arabic_name: data.name,
        id: data.product_id,
        price: data.minimum_loyalty_points
      });
   }

    return (
      <>
      <MainLayout
        outsideScroll={true}
        headerChildren={<Header label={t('LoyaltyOffers.title')} btns={["back"]} />}
        headerHeight={50}
        contentStyle={{ height: SCREEN_HEIGHT - 120, paddingHorizontal: 20 }}
      >
        {!loading && !error && (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainerStyle}
            showsVerticalScrollIndicator={false}
          >

            <Swiper data={data} onImagePress={handleImagePress}/>

           <InfoWithTitleBlock
              style={styles.expiryBlock}
              title={t('LoyaltyOffers.description')}
              description={isRtl ? data.description_arabic : data.description_sale}
              icon={<DescriptionSvg color={colors.loyaltyPrimary}/>}
           />

           <ExpireDateBlock value={data.loyalty_expiry_date} style={styles.expiryBlock}/>

            <FullScreenImageModal
              visible={!!selectedImageUrl}
              url={selectedImageUrl}
              onClose={closeModal}
            />


            <Button
               onPress={handleRedeemPress}
               text={`${t('LoyaltyOffers.redeem')} ${data.minimum_loyalty_points} ${t('LoyaltyOffers.pointsLong')}`}
               style={styles.submitBtn}
            />
       
          </ScrollView>
        )}
        {error && <NoData />}
      </MainLayout>

      {loading && <FullScreenLoader absolutePosition style={styles.loader} />}
    </>
    )
};

const styles = StyleSheet.create({
    contentStyle: {

    },
    scrollView: {
      flex: 1,
    },
    contentContainerStyle: {
      flexGrow: 1,
      paddingBottom: 60,
    },
    loader: {
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    submitBtn: {
      marginTop: 20,
    },
    boldText: {
      fontWeight: '600'
    },
    expiryBlock: {
      marginTop: 20
    }

});

export default LoyaltyProductInfo;