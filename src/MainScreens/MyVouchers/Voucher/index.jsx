import {
  Dimensions,
  Linking,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { useTheme } from '../../../components/ThemeProvider';
import { colors } from '../../../components/colors';
import CommonHeader from '../../../components/CommonHeader/CommonHeader';
import { TypographyText } from '../../../components/Typography';
import { BALOO_REGULAR } from '../../../redux/types';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TimeIconDark } from '../../../assets/delivery_assets/index';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getVoucher } from '../../../redux/voucher/voucher-thunks';
import VoucherTotal from '../components/VoucherTotal';
import { getVoucherTotalValue } from './helpers';
import InfoBlock from '../../../components/InfoBlock';
import HTMLRenderer from '../../../components/HTMLRenderer';
import ImageViwerModal from '../../../components/ImageViwer';
import { Image } from 'react-native';
import CommonButton from '../../../components/CommonButton/CommonButton';
import VoucherInfoCard from '../components/VoucherInfoCard';

const { width } = Dimensions.get('screen');

const cardWidth = width - 32;

const Voucher = (props) => {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();
  const { voucher } = props.route.params;
  const totalValue = getVoucherTotalValue(voucher);
  const language = i18n.language;

  if (!voucher) {
    return null;
  }

  const handleCallPress = () => {
    Linking.openURL(`tel:${voucher.x_phone}`);
  };

  const amount = voucher.voucher_amount;
  const terms =
    language === 'ar'
      ? voucher?.terms_condition_ar?.replace(/\n/g, '')
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
        <CommonHeader
          isWhite={isDark}
          isNotifications={true}
          label={t('Vouchers.vouchers')}
          style={{ backgroundColor: isDark ? colors.darkBlue : undefined }}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
          style={styles.scrollView}
        >
          <ImageViwerModal
            images={[{ url: `data:image/png;base64,${voucher.logo}` }]}
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

          <VoucherInfoCard voucher={voucher} />

          {!!voucher.expiry_date && (
            <InfoBlock title={t('Vouchers.availableTo')}>
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
                  font={BALOO_REGULAR}
                  style={{ marginLeft: 10 }}
                />
              </View>
            </InfoBlock>
          )}

          {!!terms && (
            <InfoBlock title={t('Vouchers.terms')}>
              <HTMLRenderer value={terms} />
            </InfoBlock>
          )}

          <VoucherTotal
            style={styles.total}
            discount={voucher.discount_value}
            total={totalValue}
            amount={amount || 0}
            deliveryCharge={+amount > 200 ? 0 : voucher.delivery_charge || 0}
            cash={voucher.cash}
          />

          {voucher.x_phone && (
            <CommonButton
              onPress={handleCallPress}
              label={t('Vouchers.call')}
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
  paymentBtn: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  validityTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
    overflow: 'hidden',
    backgroundColor: colors.lightGrey,
    alignSelf: 'center',
  },
  callBtn: {
    marginTop: 20,
  },
});

const mapStateToProps = (state) => ({
  voucher: state.voucherReducer.voucher,
  voucherLoading: state.voucherReducer.voucherLoading,
  voucherError: state.voucherReducer.voucherError,
});

export default connect(mapStateToProps, {
  getVoucher,
})(Voucher);
