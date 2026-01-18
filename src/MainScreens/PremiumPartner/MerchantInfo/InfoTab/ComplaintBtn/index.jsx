import { useTheme } from '../../../../../components/ThemeProvider';
import ContactUsSvg from '../../../../../assets/contact_us.svg';
import { useState } from 'react';
import CommonButton from '../../../common/CommonButton';
import { useTranslation } from 'react-i18next';
import { isRTL } from '../../../../../../utils';
import ComplaintModal from './ComplaintModal';
import { colors } from '../../../../../components/colors';
import { sized } from '../../../../../Svg';

const ComplaintBtn = ({ merchantDetails }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const isArabic = isRTL();

  const [complaintData, setComplaintData] = useState({});
  const [isComplaintModalVisible, setIsComplaintModalVisible] = useState(false);

  const btnColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const ComplaintIcon = sized(ContactUsSvg, 16, 16, btnColor);

  return (
    <>
      <CommonButton
        text={t('Merchants.complaint')}
        icon={<ComplaintIcon />}
        onPress={() => {
          const merchantName = isArabic
            ? merchantDetails.merchant_name_arabic ||
              merchantDetails.merchant_name
            : merchantDetails.merchant_name;

          setComplaintData({
            merchant_name: merchantName,
            merchant_id: merchantDetails.id,
          });

          setIsComplaintModalVisible(true);
        }}
        textStyle={{
          color: btnColor,
          fontSize: 11,
          marginLeft: 4,
        }}
        wrapperStyle={{
          borderColor: btnColor,
          paddingHorizontal: 10,
          marginLeft: 16,
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
