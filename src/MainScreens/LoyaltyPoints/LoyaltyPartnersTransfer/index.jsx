import {Alert, ScrollView, StyleSheet, View} from "react-native";
import Image from "../../../components/AppImage";
import Header from "../../../components/Header";
import MainLayout from "../../../components/MainLayout";
import {useTranslation} from "react-i18next";
import {useTheme} from "../../../components/ThemeProvider";
import {colors} from "../../../components/colors";
import {isRTL} from "../../../../utils";
import {TypographyText} from "../../../components/Typography";
import AmountSlider from "./AmountSlider";
import {useRef, useState} from "react";
import {Formik} from "formik";
import {getValidationSchema} from "./validationSchema";
import Tabs from "../../../components/Tabs";
import PhoneSvg from '../../../assets/loyaltyPoints/partners/phone.svg';
import EmailSvg from '../../../assets/loyaltyPoints/partners/email.svg';
import FormikCustomInput from "../../../components/Formik/FormikCustomInput";
import FormikCustomPhoneInput from "../../../components/Formik/FormikCustomPhoneInput";
import Button from "../../../components/Button";


const LoyaltyPartnersTransfer = ({route, navigation}) => {
    const {t} = useTranslation();
    const {isDark} = useTheme();
    const {partner} = route.params;
    const [amount, setAmount] = useState(0);
    const formikRef = useRef(null);
    const [activeTab, setActiveTab] = useState('transfer-phone')

    console.log(partner,'partner')


    const handleValueChange = (value) => {
      console.log(value,'value');
      setAmount(value);
      formikRef.current.setFieldValue(
          "amount",
          value.toString()
      );
    }

    const onSubmit = () => {
       Alert.alert(t('General.unavailableFeature'))
 
       return 


       navigation.navigate('loyaltyPoints-partners-transfer-confirmation')
    }; 


    return (
     <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={isRTL() ? partner.x_arabic_name: partner.merchant_name} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
        <ScrollView contentContainerStyle={styles.contentContainerStyle} showsVerticalScrollIndicator={false}>

       <View style={[styles.logoBlock,{backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder}]}>

          <Image source={{uri: partner.merchant_logo}} style={styles.logo} contentFit="cover"/>

            <TypographyText
                textColor={colors.loyaltyTextSecondary}
                size={14}
                title={t('LoyaltyPartners.description')}
                style={styles.title}
            />

       </View>
       
        <AmountSlider onChange={handleValueChange} />

        <Formik
            initialValues={{
                amount: 0,
                membershipNumber: '',
                name: '',
                lastName: '',
                partnerEmail: '',
                phone: ''
            }}
            validationSchema={getValidationSchema(activeTab)}
            onSubmit={onSubmit}
            innerRef={formikRef}
        >
             {({ submitForm}) => {

              
        return (
         <Tabs defaultActiveTab="transfer-phone" style={styles.tabsWrapper} onTabChange={setActiveTab}>
 
        <Tabs.TabWithIcon name="transfer-phone" title={t('LoyaltyPartners.phone')} icon={<PhoneSvg/>}/>
        <Tabs.TabWithIcon
          name="transfer-email"
          title={t('LoyaltyPartners.email')}
          style={{ marginLeft: 10 }}
          icon={<EmailSvg />}
        />


      <Tabs.Content name="transfer-phone">

        <FormikCustomPhoneInput 
            label={t('LoyaltyPartners.membershipNumber')} 
            wrapperStyle={{ marginBottom: 20, marginTop: 40 }}
            name="phone" 
        />

        <View style={{flexDirection: 'row', flex: 1, gap: 15}}>
         <FormikCustomInput 
            label={t('LoyaltyPartners.firstNameLabel')}
            name="name"
            wrapperStyle={{flex: 1}}
         />
           <FormikCustomInput 
            label={t('LoyaltyPartners.lastNameLabel')}
            name="lastName"
            wrapperStyle={{flex: 1}}
         />
         </View>

          <Button text={t('LoyaltyPartners.transfer')} style={styles.transferBtn} onPress={submitForm}/>
      </Tabs.Content>

      <Tabs.Content name="transfer-email">
         <FormikCustomInput
            label={t('LoyaltyPartners.membershipEmail')} 
            placeholder="info@test.com"
            wrapperStyle={{ marginBottom: 20, marginTop: 40 }}
            name="partnerEmail"
         />

        <View style={{flexDirection: 'row', flex: 1, gap: 15}}>
         <FormikCustomInput 
            label={t('LoyaltyPartners.firstNameLabel')}
            name="name"
            wrapperStyle={{flex: 1}}
         />
           <FormikCustomInput 
            label={t('LoyaltyPartners.lastNameLabel')}
            name="lastName"
            wrapperStyle={{flex: 1}}
         />
         </View>

         <Button text={t('LoyaltyPartners.transfer')} style={styles.transferBtn} onPress={submitForm}/>
      </Tabs.Content>
      </Tabs>
        )}}
           
        </Formik>
      </ScrollView>
      </MainLayout>
    )
};

const styles = StyleSheet.create({
  contentStyle: {
    flex:  1,
    paddingHorizontal: 20
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 140
  },
  logoBlock: {
     flexDirection: 'row',
     marginTop: 20,
     width: '100%',
     height: 136,
     borderWidth: 1,
     borderRadius: 38,
     padding: 24
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 14,
    marginRight: 10
  },
  title: {
     flex: 1,
     paddingRight: 5
  },
  container: {
    marginTop: 20
  },
  input: {
    color: 'white'
  },
  transferBtn: {
    marginTop: 20
  },
  tabsWrapper: {
    marginTop: 40
  },
  transferBtn: {
    marginTop: 25
  }
});

export default LoyaltyPartnersTransfer;