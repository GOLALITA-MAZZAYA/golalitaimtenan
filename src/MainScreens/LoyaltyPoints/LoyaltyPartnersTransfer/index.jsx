import {Image, ScrollView, StyleSheet, View} from "react-native";
import Header from "../../../components/Header";
import MainLayout from "../../../components/MainLayout";
import {useTranslation} from "react-i18next";
import {useTheme} from "../../../components/ThemeProvider";
import {colors} from "../../../components/colors";
import {isRTL} from "../../../../utils";
import {TypographyText} from "../../../components/Typography";
import AmountSlider from "./AmountSlider";
import AmountSelect from "./AmountSelect";
import {useRef, useState} from "react";
import FormikTextInput from "../../../components/Formik/FormikTextInput";
import {Formik} from "formik";
import {getValidationSchema} from "./validationSchema";
import Label from "./Label";
import CommonButton from "../../../components/CommonButton/CommonButton";
import Checkbox from "../../../components/Form/Checkbox";
import TermsCheckbox from "./TermsCheckbox";

const testText = 'Nojoom is Ooredoo’s rewards programme that thanks you for your loyalty. Earn points, unlock tiers, and redeem rewards for exclusive experiences, personalised offers, and real value.'

const testOptions = [
    {
        label: '100',
        value: '100'
    },
    {
        label: '200',
        value: '200'
    },
]

const LoyaltyPartnersTransfer = ({route}) => {
    const {t} = useTranslation();
    const {isDark} = useTheme();
    const {partner} = route.params;
    const [amount, setAmount] = useState(0);
    const [isTermsSelected, toggleTerms] = useState(false);
    const formikRef = useRef(null);

    console.log(partner,'partner')

    const titleColor = isDark ? colors.white : colors.darkBlue;

    const handleValueChange = (value) => {
      console.log(value,'value');
      setAmount(value);
      formikRef.current.setFieldValue(
          "amount",
          value.toString()
      );
    }

    const handleSubmit = () => {

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

       <View style={styles.logoBlock}>

          <Image source={{uri: partner.merchant_logo}} style={styles.logo} resizeMode="cover"/>

            <TypographyText
                textColor={titleColor}
                size={16}
                title={testText}
                style={styles.title}
            />

       </View>
       
       <AmountSlider onChange={handleValueChange} />
       {/* <AmountSelect onChange={handleValueChange} value={amount} options={testOptions}/> */}

        <Formik
            initialValues={{
                amount: 0,
                membershipNumber: '',
                name: '',
                lastName: ''
            }}
            validationSchema={getValidationSchema()}
            onSubmit={handleSubmit}
            innerRef={formikRef}
        >
             {({ values, errors, submitCount }) => (
    <View style={styles.container}>

      <Label text={t('LoyaltyPartners.pointsLabel')}>
      <FormikTextInput
        editable={false}
        value={values.amount}
        returnKeyType="next"
        wrapperStyle={{ marginBottom: 20 }}
        name="amount"
        error={submitCount > 0 ? errors.amount : undefined}
        style={styles.input}
      />
      </Label>

      <Label text={t('LoyaltyPartners.partnerNumLabel')}>
      <FormikTextInput
        value={values.membershipNumber}
        returnKeyType="next"
        wrapperStyle={{ marginBottom: 20 }}
        placeholder={t('LoyaltyPartners.partnerNumPlaceholder')}
        name="membershipNumber"
        error={submitCount > 0 ? errors.membershipNumber : undefined}
        style={styles.input}
      />
      </Label>

       <Label text={t('LoyaltyPartners.firstNameLabel')}>
      <FormikTextInput
        value={values.name}
        returnKeyType="next"
        wrapperStyle={{ marginBottom: 20 }}
        placeholder={t('LoyaltyPartners.firstNamePlaceholder')}
        name="name"
        error={submitCount > 0 ? errors.name : undefined}
      />
      </Label>

       <Label text={t('LoyaltyPartners.lastNameLabel')}>
      <FormikTextInput
        value={values.lastName}
        returnKeyType="next"
        wrapperStyle={{ marginBottom: 20 }}
        placeholder={t('LoyaltyPartners.lastNamePlaceholder')}
        name="lastName"
        error={submitCount > 0 ? errors.lastName : undefined}
      />
      </Label>

      <TermsCheckbox isActive={isTermsSelected} onChange={toggleTerms}/>


        <CommonButton
            label={'Transfer'}
            style={styles.transferBtn}
            onPress={() => {}}
        />
    </View>
  )}
           
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
     width: '100%'
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 8,
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
  }
});

export default LoyaltyPartnersTransfer;