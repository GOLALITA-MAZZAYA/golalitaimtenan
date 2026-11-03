import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Image from "../AppImage";
import { getStatusColor, getStatusTranslation } from "./helpers";
import { isRTL } from "../../../utils";
import { TypographyText } from "../Typography";
import { BALOO_2 } from "../../redux/types";
import { colors } from "../colors";

const AppointmentCard = ({ qrCode, status, bookingReference, children, feeAmount, paymentStatus}) => {
  const { t } = useTranslation();
  const isRtl = isRTL();

  return (

    <View style={[styles.qrcodeBlock, { backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder }]}>
      <View style={styles.qrcode}>
        <Image source={{ uri: qrCode }} style={[styles.qrCodeImage, { width: 160, height: 160 }]} contentFit="contain" />
      </View>

       <View style={[styles.bookInfo, { borderBottomWidth: 1, borderBottomColor: colors.loyaltyTextSecondary, flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
        <View style={{ flex: 1, paddingRight: isRtl ? 0 : 10, paddingLeft: isRtl ? 10 : 0 }}>
          <TypographyText
            font={BALOO_2}
            size={14}
            textColor={colors.loyaltyTextSecondary}
            title={t('Clinics.transferId')}

          />

          <TypographyText
            font={BALOO_2}
            size={18}
            textColor={colors.loyaltyPrimary}
            title={bookingReference}
            style={styles.infoText}
            numberOfLines={1}

          />
        </View>

        <View style={{ alignItems: isRtl ? 'flex-start' : 'flex-end' }}>
          <TypographyText
            font={BALOO_2}
            size={14}
            textColor={colors.loyaltyTextSecondary}
            title={t('Clinics.status')}

          />

          <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center' }}>
            <View style={[styles.circle, { backgroundColor: getStatusColor(status) }]} />
            <TypographyText
              font={BALOO_2}
              size={18}
              textColor={getStatusColor(status)}
              title={getStatusTranslation(status)}
              style={{ ...styles.infoText, marginLeft: isRtl ? 0 : 5, marginRight: isRtl ? 5 : 0 }}
            />
          </View>
        </View>

      </View>

      {(!!feeAmount || !!paymentStatus) && <View style={[styles.bookInfo, { borderBottomWidth: 1, borderBottomColor: colors.loyaltyTextSecondary, flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
        {!!feeAmount && <View style={{ flex: 1, paddingRight: isRtl ? 0 : 10, paddingLeft: isRtl ? 10 : 0 }}>
          <TypographyText
            font={BALOO_2}
            size={14}
            textColor={colors.loyaltyTextSecondary}
            title={t('Clinics.feeAmount')}

          />

          <TypographyText
            font={BALOO_2}
            size={18}
            textColor={colors.loyaltyPrimary}
            title={`${feeAmount} ${t('General.qar')}`}
            style={styles.infoText}
            numberOfLines={1}

          />
        </View>}

        {!!paymentStatus && <View style={{ alignItems: isRtl ? 'flex-start' : 'flex-end' }}>
          <TypographyText
            font={BALOO_2}
            size={14}
            textColor={colors.loyaltyTextSecondary}
            title={t('Clinics.paymentStatus')}

          />

          <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center' }}>
            <View style={[styles.circle, { backgroundColor: getStatusColor(paymentStatus) }]} />
            <TypographyText
              font={BALOO_2}
              size={18}
              textColor={getStatusColor(paymentStatus)}
              title={getStatusTranslation(paymentStatus)}
              style={{ ...styles.infoText, marginLeft: isRtl ? 0 : 5, marginRight: isRtl ? 5 : 0 }}
            />
          </View>
        </View>}

      </View>}

      {children}
    </View>
  );
};


const styles = StyleSheet.create({
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
    width: 180,
    height: 180,
    borderRadius: 20,
  },
  bookInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 6
  },
  infoText: {
    fontWeight: '500',
    marginTop: 3,
    flexShrink: 1
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    alignSelf: 'center'
  },
});

export default AppointmentCard