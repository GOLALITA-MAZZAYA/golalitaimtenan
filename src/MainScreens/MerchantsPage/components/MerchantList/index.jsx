import { useTranslation } from "react-i18next";
import CardWithNesetedItems from "../../../../components/CardWithNestedItems";
import { getLocalizedValue } from "../../../../../utils";
import BranchItem from "../BranchItem";
import OfferItem from "../OfferItem";
import { getOffersCountLabel, getToggleBtns } from "./helpers";
import { handleMerchantCardPress } from "../../helpers";
import useMerchantDiscount from "../../../../hooks/useMerchantDiscount";
import useRoadDistance from "../../../../hooks/useRoadDistance";
import {userLocationSelector} from "../../../../redux/global/global-selectors";
import {useSelector} from "react-redux";
import { rewriteAssetUrl } from "../../../../utils/rewriteAssetUrl";

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

  return (
    <CardWithNesetedItems
      toggleBtns={toggleBtns}
      parentProps={{
        onPress: () => handleMerchantCardPress(merchant),
        onPressFavourite: () => onPressFavourite(),
        uri: rewriteAssetUrl(merchant.merchant_logo),
        name: getLocalizedValue(merchant?.x_arabic_name, merchant?.merchant_name),
        description:
          language === "ar"
            ? discount?.x_ribbon_text_arabic || ""
            : discount?.ribbon_text || "",
        loadingDescription: loading,
        distance: merchant.distance_display || distance,
        distaceLoading,
        latitude: merchant.partner_latitude,
        longitude: merchant.partner_longitude,
        acceptGoLoyaltyPoint: merchant.accept_go_loyalty_point,
        isSaved: isSaved ? isSaved : isFavorite,
        offersLabel: getOffersCountLabel(merchant),
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
