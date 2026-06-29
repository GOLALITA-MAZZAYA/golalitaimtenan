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

  const isOrganization = merchant.org_name;
  const isBusinessHotel = merchant.is_business_hotel;

  const toggleBtns = getToggleBtns(merchant, isB1G1);
  const isOffersVisible = !isOrganization;
  const isBranchesVisible = !isOrganization && !isBusinessHotel;

  const {loading, discount} = useMerchantDiscount(merchant.merchant_id);
  const {distance, distaceLoading} = useRoadDistance(userLocation?.longitude, userLocation?.latitude,merchant.partner_longitude, merchant.partner_latitude)

  if (!merchant) {
    return null;
  }  

  return (
    <CardWithNesetedItems
      toggleBtns={toggleBtns}
      parentProps={{
        onPress: () => handleMerchantCardPress(merchant),
        onPressFavourite: () => onPressFavourite(),
        uri: merchant.merchant_logo,
        name:
          language === "ar" ? merchant?.x_arabic_name : merchant.merchant_name,
        description:
          language === "ar"
            ? discount?.x_ribbon_text_arabic || ""
            : discount?.ribbon_text || "",
        loadingDescription: loading,
        distance,
        distaceLoading,
        latitude: merchant.partner_latitude,
        longitude: merchant.partner_longitude,
        acceptGoLoyaltyPoint: merchant.accept_go_loyalty_point,
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

export default MerchantsList;
