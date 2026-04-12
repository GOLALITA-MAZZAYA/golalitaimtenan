import { navigationRef } from "../../Navigation/RootNavigation";
import { getBranchesById } from "../../api/merchants";
import { getCategoryNameByIdAndLang } from "../../components/Categories/helpres";
import i18n from "../../languages";
import { getMerchantDetails } from "../../redux/merchant/merchant-thunks";
import store from "../../redux/store";

export const handleMerchantCardPress = (merchant, offer) => {
  const merchantId = merchant?.merchant_id ?
    merchant.merchant_id : offer.merchant_id

    console.log(merchantId,'merchantId')

  store.dispatch(
    getMerchantDetails(
      merchantId,
      navigationRef,
      i18n.t,
      getCategoryNameByIdAndLang(merchant.category_id),
      merchant.isOrganization,
      false, false, merchant.restaurantId
    )
  );
};

export const handleBranchPress = (merchant) => {
  store.dispatch(
    getMerchantDetails(
      merchant.merchant_sub_id || merchant.merchant_id,
      navigationRef,
      i18n.t,
      getCategoryNameByIdAndLang(merchant.category_id),
      merchant.isOrganization
    )
  );
};

export const getTransformedBranches = async (merchantId) => {
  try {
    const res = await getBranchesById(merchantId);

    if (!res.length) {
      return [];
    }

    return res.map((item) => ({
      ...item,
      value: undefined,
      name: item.name,
    }));
  } catch (err) {
    console.log(err);
    return [];
  }
};
