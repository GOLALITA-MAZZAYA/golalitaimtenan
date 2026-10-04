import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../../components/ThemeProvider';
import { colors } from '../../../../../components/colors';
import { sized } from '../../../../../Svg';
import { isRTL } from '../../../../../../utils';
import StarSvg from '../../../../../assets/star.svg';
import CommonButton from '../../../common/CommonButton';
import RateModal from './RateModal';
import useMyMerchantReview from '../../../../../hooks/useMyMerchantReview';

const RateBtn = ({
  merchantDetails,
  onSubmitted,
  visible: controlledVisible,
  onOpen,
  onClose,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const isArabic = isRTL();

  const [internalVisible, setInternalVisible] = useState(false);
  const isControlled = controlledVisible !== undefined;
  const isVisible = isControlled ? controlledVisible : internalVisible;

  const handleOpen = () => {
    if (isControlled && onOpen) {
      onOpen();
    } else {
      setInternalVisible(true);
    }
  };

  const handleClose = () => {
    if (isControlled && onClose) {
      onClose();
    } else {
      setInternalVisible(false);
    }
  };

  const btnColor = isDark ? colors.mainDarkMode : colors.darkBlue;
  const StarIcon = sized(StarSvg, 15, 15, btnColor);

  const merchantName = isArabic
    ? merchantDetails?.merchant_name_arabic || merchantDetails?.merchant_name
    : merchantDetails?.merchant_name;

  const merchantId =
    merchantDetails?.merchant_id ||
    merchantDetails?.id ||
    merchantDetails?.partner_id?.[0];

  const { review, saveReview, clearReview } = useMyMerchantReview(merchantId);

  return (
    <>
      <CommonButton
        text={
          review
            ? `${t('MerchantFeedback.yourRating')} ★ ${review.rating}`
            : t('MerchantFeedback.rate')
        }
        icon={<StarIcon />}
        onPress={handleOpen}
        textStyle={{
          color: btnColor,
          fontSize: 11,
          marginLeft: 4,
        }}
        wrapperStyle={{
          borderColor: btnColor,
          paddingHorizontal: 10,
        }}
      />

      <RateModal
        visible={isVisible}
        onClose={handleClose}
        onSubmitted={onSubmitted}
        merchantId={merchantId}
        merchantName={merchantName}
        existingReview={review}
        onSaved={saveReview}
        onDeleted={clearReview}
      />
    </>
  );
};

export default RateBtn;
