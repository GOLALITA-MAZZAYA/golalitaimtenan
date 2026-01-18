import {
  Dimensions,
  Linking,
  SafeAreaView,
  StyleSheet,
  View,
  Image
} from "react-native";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TimeIconDark } from "../../../assets/delivery_assets/index";
import { useTranslation } from "react-i18next";
import { getVoucherTotalValue } from "./helpers";
import {useTheme} from "../../../components/ThemeProvider";
import Header from "../../../components/Header";
import LoyaltyVoucherInfoCard from "./LoyaltyVoucherInfoCard";
import {TypographyText} from "../../../components/Typography";
import InfoBlock from "../../../components/InfoBlock";
import HTMLRenderer from "../../../components/HTMLRenderer";
import LoyaltyVoucherInfoTotal from "./LoyaltyVoucherInfoTotal";
import {colors} from "../../../components/colors";
import ImageViwerModal from "../../../components/ImageViwer";
import CommonButton from "../../../components/CommonButton/CommonButton";
import {showMessage} from "react-native-flash-message";
import {useState} from "react";
import {loyaltyPurchaseVoucher} from "../../../api/loyalty";
import RewardsPointsToggle from "../common/RewardPointsToggle";
import PointsTotal from "../common/PointsTotal";
import useUserLoyaltyPoints from "../../../hooks/useUserLoyaltyPoints";

const { width } = Dimensions.get("screen");

const cardWidth = width - 32;

const LoyaltyVoucherInfo = (props) => {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
    const [isPointsActivated, toggleRewardsPoints] = useState(false);
  const { voucher } = props.route.params;
  const totalValue = getVoucherTotalValue(voucher);
  const { points} = useUserLoyaltyPoints();
  const language = i18n.language;

  if (!voucher) {
    return null;
  }


  const handleCallPress = () => {
    Linking.openURL(`tel:${voucher.x_phone}`);
  };

  const handleRedeemVoucher = async () => {

    props.navigation.navigate('loyaltyPoints-voucher-redeem',{
        title: language === 'en' ? voucher.name : voucher.name_arabic,
        subTitle: '',
        id: voucher.id,
        price: voucher.x_minimum_point || 0,
        code: voucher.code
    })

  };

  const handleOrderPress =  async () => {
     try{
        setLoading(true);
        const result = await loyaltyPurchaseVoucher(voucher.code, totalValue);

        if(result?.error){
          showMessage({
            message: result.error
          })

          return
        }

        console.log(result,'result')



        props.navigation.navigate('loyaltyPoints-vouchers-skipcache',{
            url: result.skipcash_url,
            title: ''
        })

        console.log(result)

     }catch(err){
        console.log(err, 'order voucher error')
        showMessage({
            message: t('General.error')
        })

     }finally{
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
          label= {t("Vouchers.vouchers")}
          btns={['back']}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
          style={styles.scrollView}
        >
          <ImageViwerModal
            images={[{ uri: `data:image/png;base64,${voucher.logo}` }]}
          >
            {(showImage) => (
              <TouchableOpacity
                onPress={() => showImage(true)}
                style={styles.imageWrapper}
              >
                <Image
                  source={{ uri: `data:image/png;base64,${voucher.logo}` }}
                  style={styles.image}
                  resizeMode="stretch"
                />
              </TouchableOpacity>
            )}
          </ImageViwerModal>

          <LoyaltyVoucherInfoCard voucher={voucher} />

          {!!voucher.expiry_date && (
            <InfoBlock title={t("Vouchers.availableTo")}>
              <View style={styles.validityTime}>
                <TimeIconDark
                  color={isDark ? colors.white : colors.darkBlue}
                  height={12}
                  width={12}
                />

                <TypographyText
                  title={voucher.expiry_date}
                  textColor={isDark ? colors.white : colors.darkBlue}
                  size={12}
                  style={{ marginLeft: 10 }}
                />
              </View>
            </InfoBlock>
          )}

          {!!terms && (
            <InfoBlock title={t("Vouchers.terms")}>
              <HTMLRenderer value={terms} />
            </InfoBlock>
          )}

           <RewardsPointsToggle
            style={styles.rewardsPoints}
            isChecked={isPointsActivated}
            onToggleSwitch={toggleRewardsPoints}
          />

          {!isPointsActivated &&<LoyaltyVoucherInfoTotal
            style={styles.total}
            discount={voucher.discount_value}
            total={totalValue}
            amount={amount || 0}
            deliveryCharge={+amount > 200 ? 0 : voucher.delivery_charge || 0}
            cash={voucher.cash}
            pointsEarn={`${voucher.x_points_earn}`}
          />}

        {isPointsActivated && <PointsTotal priceInPoints={voucher.x_minimum_point} availablePoints={points}  style={styles.total} />}

        {isPointsActivated && 
          <CommonButton
              onPress={handleRedeemVoucher}
              label={t("LoyaltyVouchers.redeem")}
              style={styles.callBtn}
              loading={loading}
        />}


        {!isPointsActivated && 
          <CommonButton
              onPress={handleOrderPress}
              label={t("LoyaltyVouchers.order")}
              style={styles.callBtn}
              loading={loading}
        />}

          {voucher.x_phone && !isPointsActivated && (
            <CommonButton
              disabled={loading}
              onPress={handleCallPress}
              label={t("Vouchers.call")}
              style={styles.callBtn}
            />
          )}

        </ScrollView>
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
    marginTop: 25,
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
    marginTop: 20,
  },
  rewardsPoints: {
    marginTop: 20
  },
  total: {
    marginTop: 20
  }
});



export default LoyaltyVoucherInfo;
