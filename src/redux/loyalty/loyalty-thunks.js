import { getPointsRate, getUserPoints } from "../../api/loyalty";
import { getMerchantMatrixDiscount } from "../../api/merchants";
import { setMerchantDetailsLoading } from "../merchant/merchant-actions";
import { setMerchantDiscount, setMerchantsPointRate, setUserLoayltyPoints, toggleMerchantPointsDiscount } from "./loyalty-actions";

export const getMerchantDiscount =
  (merchantId) =>
    async (dispatch) => {
      try {
        dispatch(setMerchantDetailsLoading(true));

        const result = await getMerchantMatrixDiscount(merchantId);

        console.log(result.data, 'discount')

        dispatch(setMerchantDiscount(result.data));
      } finally {
        dispatch(setMerchantDetailsLoading(false));
      }
    };

export const getMerchantsPointRate =
  () =>
    async (dispatch) => {
      try {
        dispatch(setMerchantDetailsLoading(true));

        const data = await getPointsRate();

        const pointRate = data?.conversion_rule?.points;

        if (pointRate) {
          dispatch(setMerchantsPointRate(pointRate));
        }

      } catch (err) {
        console.log(err, 'get merchant point rate thunk error')
      } finally {
        dispatch(setMerchantDetailsLoading(false));
      }
    };

export const getUserLoayltyPoints =
  () =>
    async (dispatch) => {
      try {
        dispatch(setMerchantDetailsLoading(true));

        const points = await getUserPoints();
        if (points != null) {
          dispatch(setUserLoayltyPoints(points));
        }

      } catch (err) {
        console.log(err, 'get user loyalty points thunk error')
      } finally {
        dispatch(setMerchantDetailsLoading(false));
      }
    };
