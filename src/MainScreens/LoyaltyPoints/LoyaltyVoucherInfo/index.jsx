import {
  Dimensions,
  Linking,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { getVoucherTotalValue } from "./helpers";
import { useTheme } from "../../../components/ThemeProvider";
import Header from "../../../components/Header";
import LoyaltyVoucherInfoTotal from "./LoyaltyVoucherInfoTotal";
import { colors } from "../../../components/colors";
import { showMessage } from "react-native-flash-message";
import { useState } from "react";
import { loyaltyPurchaseVoucher } from "../../../api/loyalty";
import Swiper from "./LoyaltyVoucherSwiper";
import DescriptionSvg from '../../../assets/loyaltyPoints/description.svg';
import FullScreenImageModal from "../../AllOffers/OfferInfo/components/FullScreenImageModal";
import InfoCard from "../common/InfoCard";
import { daysLeftUntil } from "../../../helpers";
import { isRTL } from "../../../../utils";
import InfoWithTitleBlock from "../../../components/InfoWithTitleBlock";
import Button from "../../../components/Button";

const { width } = Dimensions.get("screen");

const cardWidth = width - 32;

const LoyaltyVoucherInfo = (props) => {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { voucher } = props.route.params;
  const totalValue = getVoucherTotalValue(voucher);
  const [selectedImage, setSelectedImage] = useState(null);
  const language = i18n.language;

  if (!voucher) {
    return null;
  }

  const closeModal = () => {
    setSelectedImage(false);
  }


  const handleCallPress = () => {
    Linking.openURL(`tel:${voucher.x_phone}`);

  };

  const handleRedeemVoucher = async () => {

    props.navigation.navigate('loyaltyPoints-voucher-redeem', {
      title: '',
      subTitle: language === 'en' ? voucher.name : voucher.name_arabic,
      id: voucher.id,
      price: voucher.x_minimum_point || 0,
      code: voucher.code
    })

  };

  const handleOrderPress = async () => {
    try {
      setLoading(true);
      const result = await loyaltyPurchaseVoucher(voucher.code, totalValue);

      if (result?.error) {
        showMessage({
          message: result.error
        })

        return
      }

      console.log(result, 'result')



      props.navigation.navigate('loyaltyPoints-vouchers-skipcache', {
        url: result.skipcash_url,
        title: ''
      })

      console.log(result)

    } catch (err) {
      console.log(err, 'order voucher error')
      showMessage({
        message: t('General.error')
      })

    } finally {
      setLoading(false)
    }
  };

  const amount = voucher.voucher_amount;
  const terms =
    language === "ar"
      ? voucher?.terms_condition_ar?.replace(/\n/g, "")
      : voucher?.terms_condition;

  return (
    <View
      style={[
        {
          backgroundColor: isDark ? colors.darkBlue : colors.white,
        },
        styles.safeAreaWrapper,
      ]}
    >
      <SafeAreaView style={styles.safeAreaWrapper}>
        <Header
          label={t("Vouchers.vouchers")}
          btns={['back']}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
          style={styles.scrollView}
        >
          <Swiper
            data={voucher}
            onImagePress={(selectedImage) => setSelectedImage(selectedImage)}
          />

          <View style={[styles.infoCards, { flexDirection: isRTL() ? 'row-reverse' : 'row' }]}>
            {!!voucher.expiry_date && <InfoCard title={daysLeftUntil(voucher.expiry_date)} value={t('LoyaltyVouchers.daysLeft').toLocaleUpperCase()} />}
          </View>

          <InfoWithTitleBlock
            style={styles.expiryBlock}
            title={t("Vouchers.terms")}
            description={terms}
            html
            icon={<DescriptionSvg color={colors.loyaltyPrimary} />}
          />



          <LoyaltyVoucherInfoTotal
            style={styles.total}
            discount={voucher.discount_value}
            total={totalValue}
            amount={amount || 0}
            deliveryCharge={+amount > 200 ? 0 : voucher.delivery_charge || 0}
            cash={voucher.cash}
          />

          {voucher.x_phone && (
            <Button
              disabled={loading}
              onPress={handleCallPress}
              text={t("Vouchers.call")}
              style={styles.callBtn}
            />
          )}

        </ScrollView>

        <FullScreenImageModal
          visible={!!selectedImage}
          url={selectedImage}
          onClose={closeModal}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaWrapper: {
    flex: 1,
  },
  card: {
    marginTop: 16,
  },

  paymentBtn: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  validityTime: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  total: {
    marginTop: 20,
    marginBottom: 10
  },
  imageWrapper: {
    borderRadius: 8,
  },
  image: {
    width: cardWidth,
    height: cardWidth - 130,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.lightGrey,
    alignSelf: "center",
  },
  callBtn: {
    marginTop: 10,
    alignSelf: 'stretch'
  },
  rewardsPoints: {
    marginTop: 20
  },
  total: {
    marginTop: 20
  },
  expiryBlock: {
    marginTop: 20
  },
  infoCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  }
});



export default LoyaltyVoucherInfo;
