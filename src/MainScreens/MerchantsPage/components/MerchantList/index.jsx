import { useTranslation } from "react-i18next";
import CardWithNesetedItems from "../../../../components/CardWithNestedItems";
import BranchItem from "../BranchItem";
import OfferItem from "../OfferItem";
import { getToggleBtns } from "./helpers";
import { handleMerchantCardPress } from "../../helpers";
import { getMerchantDisscountForOffers } from "../../../../api/merchants";
import { useEffect, useState } from "react";

const MerchantsList = ({
  merchant,
  isB1G1,
  onPressFavourite,
  isFavorite,
  isSaved,
}) => {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const isOrganization = merchant.org_name;
  const isBusinessHotel = merchant.is_business_hotel;

  const toggleBtns = getToggleBtns(merchant, isB1G1);
  const isOffersVisible = !isOrganization;
  const isBranchesVisible = !isOrganization && !isBusinessHotel;

  const [loadingDescription, setLoadingDescription] = useState(false);
  const [description, setDescription] = useState(null);

  const getOffersDiscountValue = async () => {

    if (!merchant || !merchant.merchant_id) {
      return;
    }

    try {
      setLoadingDescription(true);

      const description = await getMerchantDisscountForOffers(
        merchant.merchant_id
      );

      setDescription(description);
    } catch (err) {
      console.log(err, "err");
    } finally {
      setLoadingDescription(false);
    }
  };

  useEffect(() => {
    getOffersDiscountValue();
  }, []);

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
            ? description?.x_ribbon_text_arabic || ""
            : description?.ribbon_text || "",
        loadingDescription,
        acceptGoLoyaltyPoint: merchant.accept_go_loyalty_point,
        goPoints: merchant.gpoint,
        isSaved: isSaved ? isSaved : isFavorite,
        latitude: merchant.partner_latitude,
        longitude: merchant.partner_longitude
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
