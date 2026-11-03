import {Linking, ScrollView, StyleSheet} from "react-native";
import Image from "../../../components/AppImage";
import Header from "../../../components/Header"
import MainLayout from "../../../components/MainLayout"
import {useTranslation} from "react-i18next";
import {colors} from "../../../components/colors";
import {TypographyText} from "../../../components/Typography";
import InstructionSvg from '../../../assets/loyaltyPoints/instruction.svg';
import InfoWithTitleBlock from "../../../components/InfoWithTitleBlock";
import Button from "../../../components/Button";
import useMerchantDetails from "../../../hooks/useMerchantDetails";
import {isRTL} from "../../../../utils";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import trackActivity from "../../../api/activityTracker";


const LoyaltyPartnerInfo = ({route}) => {
    const {t} = useTranslation();
    const {id} = route.params;
    const {data, loading} = useMerchantDetails(id);
    const isAr = isRTL();

    const handleBookNowPress = () => {
       if(data?.website){
         trackActivity('page_visit', {
           merchant_id: id,
           page_name: 'merchant_website',
           metadata: { link_type: 'website', link_value: data.website, source: 'loyalty_partner_info' },
         });
         Linking.openURL(data.website);
       }
    };


    const partnerName = isAr ? data?.x_arabic_name: data?.merchant_name;
    const partnerLogo = data?.map_banner;
    const howToRedeem = isAr ? data?.x_use_term_ar : data?.x_use_term_en

    return (
        <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={partnerName} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
        {!!loading && <FullScreenLoader style={styles.loader}/>}
        {!loading && <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>

        <Image source={{uri: partnerLogo}} style={styles.logo} contentFit="cover"/>

        <TypographyText
            textColor={colors.loyaltyTextMainTitle}
             size={16}
             title={t('LoyaltyPartners.instrunction6',{partnerName,interpolation: { escapeValue: false }})}
             style={styles.redeemTitle}
        />

        <InfoWithTitleBlock
              style={styles.howToRedeem}
              title={t('LoyaltyPartners.howToRedeem')}
              description={howToRedeem}
              icon={<InstructionSvg color={colors.loyaltyPrimary}/>}
        />
 
        <Button
            text={t('LoyaltyPartners.bookNow')}
            style={styles.bookNowBtn}
            onPress={handleBookNowPress}
        />
        </ScrollView>}

      </MainLayout>
    )
};

const styles = StyleSheet.create({
    contentStyle: {
        flex: 1,
        paddingHorizontal: 20
    },
    logo: {
        width: '100%',
        height: 242,
        marginTop: 20,
        borderRadius: 40

    },
    redeemTitle: {
      marginTop: 26,
      fontWeight: '600'
    },
    howToRedeem: {
      marginTop: 20
    },
    bookNowBtn: {
       marginTop: 45,
       alignSelf: 'stretch'
    },
    contentContainerStyle: {
        paddingBottom: 120
    },
    loader: {
      marginBottom: 60
    }

});

export default LoyaltyPartnerInfo;