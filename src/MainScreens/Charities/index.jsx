import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Header from "../../components/Header";
import { TypographyText } from "../../components/Typography";
import { BALOO_2 } from "../../redux/types";
import { colors } from "../../components/colors";
import CustomSelectTabs from "../../components/Form/CustomSelectTabs";
import { useCallback, useEffect, useRef, useState } from "react";
import GiftInfo from "./components/GiftInfo";
import Total from "./components/Total";
import Button from "../../components/Button";
import { isRTL } from "../../../utils";
import GiftAddSvg from '../../assets/giftAdd.svg';
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import { HEADER_HEIGHT } from "../../constants";
import { charityAmountInitiate, charityVerify } from "../../api/charities";
import { getAllMerchants, getMerchantById } from "../../api/merchants";
import Carousel from "react-native-reanimated-carousel";
import { SCREEN_WIDTH } from "../../styles/mainStyles";
import { useTranslation } from "react-i18next";
import { showMessage } from "react-native-flash-message";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { userSelector } from "../../redux/auth/auth-selectors";
import { getHtmlStyleSheet } from "./config";
import HTMLView from "react-native-htmlview";
import i18n from "../../languages";

const amountOptions = [{ label: '10', value: 10 }, { label: '50', value: 50 }, { label: '100', value: 100 }]

const Charities = ({ navigation, route }) => {
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [merchant, setMerchant] = useState(null);
  const paymentResponseRef = useRef(null);
  const { t } = useTranslation();

  const user = useSelector(userSelector);

  const isRtl = isRTL();
  const category_id = route?.params?.categoryId;
  const merchantId = route?.params?.merchantId;


  const getMerchantInformation = async () => {
    try {
      setLoading(true);

      if (merchantId) {
        const data = await getMerchantById(merchantId);

        setMerchant({ ...data, merchant_id: merchantId });

      }

      if (!merchantId) {
        const merchants = await getAllMerchants({ category_id });

        console.log(merchants, 'all merchants')

        if (!merchants?.length) {
          throw ('No merchants received in the list')
        }

        const data = await getMerchantById(merchants[0].merchant_id);

        console.log(data, 'merchant data')

        setMerchant({ ...data, merchant_id: merchants[0].merchant_id });
      }

    } catch (err) {
      showMessage({
        message: t('General.error'),
        type: "danger"
      });
      console.log(err, 'get merchant error')
    } finally {
      setLoading(false)
    }
  };


  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await charityAmountInitiate({ amount, name: user.name, mobile: user.phone, email: user.email, charity_id: merchant.merchant_id, });

      paymentResponseRef.current = res;

      if (!res.payment_url) {
        throw 'payment error'
      }

      navigation.navigate('Website', { url: res.payment_url })

    } catch (err) {
      console.log(err, 'error')
    } finally {
      setLoading(false)
    }
  }

  const verifyRequestStatus = async () => {
    if (paymentResponseRef.current) {

      try {

        const res = await charityVerify(paymentResponseRef.current.transaction_id);
        console.log(res, 'charityVerify res')

        if (res.payment_status === 'Paid') {
          showMessage({
            message: t('General.success'),
            type: 'success'
          });

        } else {

          showMessage({
            message: t('General.error'),
            type: "danger"
          });
        }

      } catch (err) {
        console.log(err, 'error ')
      } finally {
        paymentResponseRef.current = null;
      }
    }
  };

  const handleGiftPress = () => {
    navigation.navigate('loyaltyPoints')
  }

  useEffect(() => {
    getMerchantInformation()
  }, []);

  useFocusEffect(
    useCallback(() => {
      verifyRequestStatus()
    }, [])
  );

  if (!merchant && loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FullScreenLoader absolutePosition style={styles.loader} />
      </SafeAreaView>
    )
  }

  if (!merchant) {
    return null
  }


  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.imageBlock}>
        <Carousel
          loop
          width={SCREEN_WIDTH}
          height={200}
          autoPlay={true}
          autoPlayInterval={3000}
          data={merchant?.banners?.map(item => item.banner_image)}
          scrollAnimationDuration={800}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.layoutImage} resizeMode="cover" />
          )}
        />

        <Header btns={['back']} style={styles.header} additionalBtnsProps={{
          back: {
            onPress: () => navigation.navigate('Main')
          }
        }} />
        <View style={[styles.roundedBorders, { backgroundColor: colors.charityBackground }]} />
      </View>
      <ScrollView bounces={false} style={{ backgroundColor: colors.charityBackground }} contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.content}>

          <TypographyText
            font={BALOO_2}
            size={18}
            title={t('Charities.title')}
            textColor={colors.loyaltyTextMainTitle}
            style={styles.boldText}
          />

          <HTMLView
            value={isRtl ? merchant.x_terms_conditionarabic_new : merchant.x_terms_condition_new}
            stylesheet={getHtmlStyleSheet(i18n.language)}
            addLineBreaks={true}
            paragraphBreak={false}
            textComponentProps={{
              style: {
                color: colors.loyaltyTextSecondary
              },
            }}
          />

          <View style={styles.amountSelectWrapper}>
            <TypographyText
              font={BALOO_2}
              size={18}
              title={t('Charities.amountSelectLabel')}
              textColor={colors.loyaltyTextMainTitle}
              style={styles.boldText}
            />

            <CustomSelectTabs
              onSelect={setAmount} value={amount}
              options={amountOptions}
              style={styles.amountSelect}
            />
          </View>

          <GiftInfo style={styles.giftInfo} />

          <Total value={amount} style={styles.total} />

          <View style={[styles.footer, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>

            <Button text={t('Charities.donate')} style={styles.submitBtn} onPress={handleSubmit} />

            {/* <TouchableOpacity style={[styles.supportBtn,{backgroundColor: '#000', borderColor: colors.loyaltyMainBorder}]} onPress={handleGiftPress}>
                    <GiftAddSvg stroke={'#fff'} height={25} width={25}/>
                </TouchableOpacity> */}
          </View>


        </View>
      </ScrollView>

      {loading && <FullScreenLoader absolutePosition style={styles.loader} />}

    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  imageBlock: {
    position: 'relative'
  },
  layoutImage: {
    width: '100%',
    height: 200,
    zIndex: 1
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2
  },
  content: {
    flex: 1,
    marginTop: 10
  },
  boldText: {
    fontWeight: '700'
  },
  description: {
    marginTop: 15
  },
  amountSelectWrapper: {
    marginTop: 20
  },
  amountSelect: {
    marginTop: 15
  },
  giftInfo: {
    marginTop: 20
  },
  total: {
    marginTop: 20
  },
  submitBtn: {
    paddingHorizontal: 20
  },
  footer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  supportBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1
  },
  list: {
    overflow: 'hidden',
    position: 'absolute',
    top: 80,
    left: 0,
  },
  contentContainerStyle: {
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  roundedBorders: {
    width: '100%',
    height: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    position: 'absolute',
    left: 0,
    bottom: 0,
    zIndex: 5
  },
  loader: {
    width: "100%",
    height: Dimensions.get("window").height,
    top: -HEADER_HEIGHT,
    zIndex: 20
  },
});

export default Charities;