import { useTheme } from '../../../../../components/ThemeProvider';
import ContactUsSvg from '../../../../../assets/contact_us.svg';
import { useState } from 'react';
import CommonButton from '../../../common/CommonButton';
import { useTranslation } from 'react-i18next';
import { isRTL } from '../../../../../../utils';
import ComplaintModal from './ComplaintModal';
import { colors } from '../../../../../components/colors';
import { sized } from '../../../../../Svg';

const ComplaintBtn = ({ merchantDetails, compact = false }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const isArabic = isRTL();

  const [complaintData, setComplaintData] = useState({});
  const [isComplaintModalVisible, setIsComplaintModalVisible] = useState(false);

  const btnColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const ComplaintIcon = sized(
    ContactUsSvg,
    compact ? 12 : 15,
    compact ? 12 : 15,
    btnColor,
  );

  const merchantId =
    merchantDetails?.merchant_id ||
    merchantDetails?.id ||
    merchantDetails?.partner_id?.[0];

  return (
    <>
      <CommonButton
        text={t('Merchants.complaint')}
        icon={<ComplaintIcon />}
        onPress={() => {
          const merchantName = isArabic
            ? merchantDetails?.merchant_name_arabic ||
              merchantDetails?.merchant_name
            : merchantDetails?.merchant_name;

          setComplaintData({
            merchant_name: merchantName,
            merchant_id: merchantId,
          });

          setIsComplaintModalVisible(true);
        }}
        textStyle={{
          color: btnColor,
          fontSize: compact ? 11 : 12,
          marginLeft: compact ? 4 : 6,
        }}
        wrapperStyle={{
          borderColor: isDark
            ? 'rgba(255, 221, 0, 0.4)'
            : 'rgba(10, 37, 64, 0.18)',
          backgroundColor: isDark
            ? 'rgba(255, 221, 0, 0.08)'
            : 'rgba(10, 37, 64, 0.04)',
          paddingHorizontal: compact ? 10 : 14,
          paddingVertical: compact ? 4 : 7,
          borderRadius: 20,
          ...(compact && { marginTop: 10 }),
        }}
      />

      <ComplaintModal
        visible={isComplaintModalVisible}
        onClose={() => setIsComplaintModalVisible(false)}
        merchantData={complaintData}
      />
    </>
  );
};

export default ComplaintBtn;
