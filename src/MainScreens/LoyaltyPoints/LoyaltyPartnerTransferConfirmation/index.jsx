import {Image, StyleSheet, View} from "react-native";
import Header from "../../../components/Header";
import MainLayout from "../../../components/MainLayout";
import SuccessBtn from "../common/SuccessBtn";
import {TypographyText} from "../../../components/Typography";
import {BALOO_2} from "../../../redux/types";
import {colors} from "../../../components/colors";
import {isRTL} from "../../../../utils";
import {ScrollView} from "react-native-gesture-handler";
import {useTranslation} from "react-i18next";

const LoyaltyPartnerTransferConfirmation = () => {
    const isRtl = isRTL();
    const {t} = useTranslation();

    return (
      <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header btns={['back']} label={t('LoyaltyPartners.confirmation')}/>
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
        <ScrollView contentContainerStyle={styles.contentStyle} bounces={false}>

        <SuccessBtn style={styles.succesBtn}/>

        <TypographyText 
          font={BALOO_2}
          size={32}
          textColor={colors.loyaltyTextMainTitle}
          title={t('LoyaltyPartners.transferConfirmed')}
          style={styles.confirmText}
        />

        <TypographyText 
          font={BALOO_2}
          size={16}
          textColor={colors.loyaltyTextSecondary}
          title={t('LoyaltyPartners.qrCodeInfo')}
          style={styles.confirmTextSecondary}
        />

        <View style={[styles.qrcodeBlock,{backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder}]}>
            <View style={styles.qrcode}>
              <Image source={require('../../../assets/loyaltyPoints/QRCode.png')} style={styles.qrCodeImage}/>
            </View>

            <View style={[styles.bookInfo, {borderBottomWidth: 1, borderBottomColor: colors.loyaltyTextSecondary}]}>
                <View>
                    <TypographyText 
                      font={BALOO_2}
                      size={14}
                      textColor={colors.loyaltyTextSecondary}
                      title={t('LoyaltyPartners.transferId')}
                      
                    />

                    <TypographyText 
                      font={BALOO_2}
                      size={20}
                      textColor={colors.loyaltyPrimary}
                      title="QX-8829-LP"
                      style={styles.infoText}
                      
                    />
                </View>

                <View style={{alignItems: 'flex-end'}}>
                    <TypographyText 
                      font={BALOO_2}
                      size={14}
                      textColor={colors.loyaltyTextSecondary}
                      title={t('LoyaltyPartners.status')}
                      
                    />
                    <TypographyText 
                      font={BALOO_2}
                      size={20}
                      textColor={colors.success}
                      title={t('LoyaltyPartners.confirmed')} 
                      style={styles.infoText}         
                    />
                </View>
            </View>

               <View style={styles.bookInfo}>
                <View>
                    <TypographyText 
                      font={BALOO_2}
                      size={14}
                      textColor={colors.loyaltyTextSecondary}
                      title={t('LoyaltyPartners.transfered')}
                      
                    />

                    <TypographyText 
                      font={BALOO_2}
                      size={20}
                      textColor={colors.loyaltyPrimary}
                      title={`1000 ${t('LoyaltyPartners.points')}`}
                      style={styles.infoText}
                      
                    />
                </View>

                <View style={{alignItems: 'flex-end'}}>
                    <TypographyText 
                      font={BALOO_2}
                      size={14}
                      textColor={colors.loyaltyTextSecondary}
                      title={t('LoyaltyPartners.receiver')}
                      
                    />
                    <TypographyText 
                      font={BALOO_2}
                      size={20}
                      textColor={colors.success}
                      title="Alex"  
                      style={styles.infoText}        
                    />
                </View>
            </View>
        </View>

        </ScrollView>
      </MainLayout>
    )
};

const styles = StyleSheet.create({
   contentStyle: {
    paddingHorizontal: 10,
    alignItems: 'center',
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
   qrcodeBlock: {
    alignItems: 'center',
    borderRadius: 40,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginTop: 20,
    borderWidth: 1
   },
   qrcode: {
    width: 180,
    height: 180,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
   },
   qrCodeImage: {
    width: 150,
    height: 150
   },
   bookInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 14,
    paddingBottom: 8
   },
   infoText: {
    fontWeight: '500'
   },
   goBackBtn: {
    paddingHorizontal: 100,
    marginTop: 20
   }
});

export default LoyaltyPartnerTransferConfirmation;
