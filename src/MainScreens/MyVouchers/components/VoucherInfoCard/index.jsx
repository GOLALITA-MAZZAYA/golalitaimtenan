import { StyleSheet, View, Image } from 'react-native';
import { TypographyText } from '../../../../components/Typography';
import { useTheme } from '../../../../components/ThemeProvider';
import { colors } from '../../../../components/colors';
import { useTranslation } from 'react-i18next';
import {isRTL} from '../../../../../utils';

const VoucherInfoCard = (props) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const voucher = props.voucher;

  const name = isRTL() ? voucher.name_arabic : voucher.name;

  console.log(voucher,'voucher')

  return (
    <View style={[styles.wrapper,{flexDirection: isRTL() ? 'row-reverse': 'row'}]}>
      {voucher?.x_merchant_logo && (
        <View style={styles.logoWrapper}>
          <Image
            source={{ uri: `data:image/png;base64,${voucher.x_merchant_logo}` }}
            style={styles.image}
          />
        </View>
      )}
      <View style={styles.textWrapper}>
        <TypographyText
          title={name}
          textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
          size={14}
          style={styles.name}
        />
        <TypographyText
          title={`${t('Vouchers.expiry')}: ${voucher.expiry_date}`}
          textColor="#F0F0F0"
          size={12}
          style={styles.name}
        />
        <TypographyText
          title={`${t('Vouchers.price')}: ${voucher.voucher_amount}`}
          textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
          size={14}
          style={styles.name}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoWrapper: {
    width: 80,
    height: 80,
    marginRight: 15,
    backgroundColor: 'grey',
    borderRadius: 40,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'contain',
  },
  wrapper: {
    flexDirection: 'row',
    marginTop: 30,
  },
  textWrapper: {
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  name: {},
});

export default VoucherInfoCard;
