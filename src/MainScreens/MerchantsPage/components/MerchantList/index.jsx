import { memo } from "react";
import { useTranslation } from "react-i18next";
import CardWithNesetedItems from "../../../../components/CardWithNestedItems";
import BranchItem from "../BranchItem";
import OfferItem from "../OfferItem";
import { getToggleBtns } from "./helpers";
import { handleMerchantCardPress } from "../../helpers";
import useMerchantDiscount from "../../../../hooks/useMerchantDiscount";
import useRoadDistance from "../../../../hooks/useRoadDistance";
import {userLocationSelector} from "../../../../redux/global/global-selectors";
import {useSelector} from "react-redux";
import ComplaintBtn from "../../../PremiumPartner/MerchantInfo/InfoTab/ComplaintBtn";

const MerchantsList = ({
  merchant,
  isB1G1,
  onPressFavourite,
  isFavorite,
  isSaved,
}) => {
  const { i18n } = useTranslation();
  const userLocation = useSelector(userLocationSelector);
  const language = i18n.language;

  const {loading, discount} = useMerchantDiscount(merchant?.merchant_id);
  // useRoadDistance(userLat, userLong, merchantLat, merchantLong) — same
  // order as HotelsListCard / getRoadDistance API.
  const {distance, distaceLoading} = useRoadDistance(
    userLocation?.latitude,
    userLocation?.longitude,
    merchant?.partner_latitude,
    merchant?.partner_longitude,
    !merchant.distance_display,
  );

  if (!merchant) {
    return null;
  }

  const isOrganization = merchant.org_name;
  const isBusinessHotel = merchant.is_business_hotel;

  const toggleBtns = getToggleBtns(merchant, isB1G1);
  const isOffersVisible = !isOrganization;
  const isBranchesVisible = !isOrganization && !isBusinessHotel;

  const isTruthy = (val) => Boolean(val && val !== "false" && val !== "0");
  const isStampEnabled = isTruthy(merchant.is_stamp_enabled);
  const isProvidingCoupon = isTruthy(merchant.is_providing_coupon);

  return (
    <CardWithNesetedItems
      toggleBtns={toggleBtns}
      footerAction={
        !isOrganization && (
          <ComplaintBtn
            compact
            merchantDetails={{
              merchant_id: merchant.merchant_id,
              merchant_name: merchant.merchant_name,
              merchant_name_arabic: merchant.x_arabic_name,
            }}
          />
        )
      }
      parentProps={{
        onPress: () => handleMerchantCardPress(merchant),
        onPressFavourite: () => onPressFavourite?.(merchant.merchant_id),
        uri: merchant.merchant_logo,
        name:
          language === "ar" ? merchant?.x_arabic_name : merchant.merchant_name,
        description:
          language === "ar"
            ? discount?.x_ribbon_text_arabic || ""
            : discount?.ribbon_text || "",
        loadingDescription: loading,
        distance: merchant.distance_display || distance,
        distaceLoading,
        acceptGoLoyaltyPoint: merchant.accept_go_loyalty_point,
        goPoints: merchant.gpoint,
        stamp: isStampEnabled,
        coupon: isProvidingCoupon,
        isStampEnabled,
        isProvidingCoupon,
        is_stamp_enabled: isStampEnabled,
        is_providing_coupon: isProvidingCoupon,
        isSaved: isSaved ? isSaved : isFavorite,
      }}
    >
      {isOffersVisible && (
        <OfferItem merchant={merchant} isB1G1={isB1G1} type={"offers"} />
      )}
      {isBranchesVisible && (
        <BranchItem merchantId={merchant.merchant_id} type={"branches"} />
      )}
    </CardWithNesetedItems>
  );
};

export default memo(MerchantsList);
