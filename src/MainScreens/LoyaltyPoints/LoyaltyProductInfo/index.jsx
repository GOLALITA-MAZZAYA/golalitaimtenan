import {ScrollView, StyleSheet, View} from "react-native";
import Header from "../../../components/Header";
import MainLayout from "../../../components/MainLayout";
import {useEffect, useState} from "react";
import {getLoyaltyProductDetails} from "../../../api/loyalty";
import OfferInfoSwiper from "../../AllOffers/OfferInfo/components/OfferInfoSwiper";
import MerchantInfoBlock from "../../AllOffers/OfferInfo/components/MerchatInfoBlock";
import {transformDate} from "../../AllOffers/OfferInfo/helpers";
import InfoBlocks from "../../AllOffers/OfferInfo/components/InfoBlocks";
import FullScreenImageModal from "../../AllOffers/OfferInfo/components/FullScreenImageModal";
import {SCREEN_HEIGHT} from "../../../styles/mainStyles";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import NoData from "../../Transactions/components/NoData";
import CommonButton from "../../../components/CommonButton/CommonButton";
import {useTranslation} from "react-i18next";
import {getInfoBlocksConfig} from "./config";
import {useTheme} from "../../../components/ThemeProvider";
import {colors} from "../../../components/colors";
import {TypographyText} from "../../../components/Typography";

const LoyaltyProductInfo = ({route, navigation}) => {
    const {i18n, t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState([]);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const {isDark} = useTheme();

    const product_id = route.params.product_id;
    const title = route.params.title;
    const isArabic = i18n.language === 'ar';


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

    console.log(data,'product')

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


    const infoBlocksConfig = getInfoBlocksConfig(data);

    console.log(data,'product data')

    const btnTextColor =  colors.white;

    return (
      <>
      <MainLayout
        outsideScroll={true}
        headerChildren={<Header label={title} btns={["back"]} />}
        headerHeight={50}
        contentStyle={{ height: SCREEN_HEIGHT - 120, paddingHorizontal: 20 }}
      >
        {!loading && !error && (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainerStyle}
            showsVerticalScrollIndicator={false}
          >
            <OfferInfoSwiper
              images={[`data:image/png;base64,${data.image_1920}`]}
              onImagePress={handleImagePress}
            />
            <MerchantInfoBlock
              merchantName={
                isArabic ? data.merchant_name_arabic : data.merchant_name
              }
              merchantUrl={data.merchant_logo}
            />

            <InfoBlocks data={infoBlocksConfig} />

            <FullScreenImageModal
              visible={!!selectedImageUrl}
              url={selectedImageUrl}
              onClose={closeModal}
            />

         
              <CommonButton 
                onPress={handleRedeemPress}
                label={`${t('LoyaltyOffers.redeem')} ${data.minimum_loyalty_points} ${t('LoyaltyOffers.points')}`}
                textColor={isDark ? colors.mainDarkModeText : colors.white}
                style={styles.merchantBtn}
                renderItem={() => (

                  <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                     <TypographyText
                                      title={t('LoyaltyOffers.redeem')}
                                      textColor={btnTextColor}
                                      size={18}
                                      style={styles.boldText}
                                    />
                      <TypographyText
                                        title={data.minimum_loyalty_points}
                                        textColor={btnTextColor}
                                        size={18}
                                        style={[styles.boldText,{ marginLeft: 8}]}
                                      />
                      <TypographyText
                                        title={t('LoyaltyOffers.points')}
                                        textColor={btnTextColor}
                                        size={12}
                                        style={[styles.boldText,{ marginLeft: 4, lineHeight: 20}]}
                                      />
                  </View>

                )}
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
    merchantBtn: {
      marginTop: 20,
    },
    boldText: {
      fontWeight: '600'
    }

});

export default LoyaltyProductInfo;