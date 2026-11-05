import {
  getGiftCards as getGiftCardsRequest,
} from "../../api/giftCard";
import { org } from "../../org/config";
import {
  setGiftCards,
  setGiftCardsLoading,
} from "./giftcards-actions";

// Escapes text so it can sit safely inside a quoted string in the Odoo domain.
const escapeDomainString = (value) =>
  String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");

// Typing in search fires several requests; only the latest one may update the list.
let latestRequestId = 0;

export const getGiftCards =
  (categoryId, countryCode, searchText) => async (dispatch, getState) => {
    const { token } = getState().authReducer;
    const requestId = ++latestRequestId;

    try {
      dispatch(setGiftCardsLoading(true));

      const domainParts = [
        "('is_active', '=', True)",
        "('denomination_ids', '!=', False)",
        "('denomination_ids.is_active', '=', True)",
        `('x_org_type', 'in', ['${org.code}', False])`,
      ];

      if (categoryId) {
        domainParts.push(`('category_ids.category_id', '=', ${categoryId})`);
      }

      const search = searchText?.trim();
      if (search) {
        domainParts.push(`('name', 'ilike', '${escapeDomainString(search)}')`);
      }

      if (countryCode) {
        domainParts.push(
          "'|'",
          `('country_ids.code', '=', '${countryCode}')`,
          "('country_ids', '=', False)"
        );
      }

      const params = {
        token,
        domain: `[${domainParts.join(", ")}]`,
        fields:
          "['id','name','brand_code', 'brand_id', 'brand_accepted_currency', 'category_ids', 'country_ids', 'denomination_ids', 'description', 'detail_url', 'display_name', 'image_gallery', 'is_active', 'is_generic', 'locations_url', 'logo', 'pin_redeemable', 'product_image', 'redemption_instructions', 'redemption_type', 'tagline', 'validity_in_months', 'variable_amount', 'x_org_type', 'x_rate', 'x_minimum_point']",
      };

      //console.log(params, 'getGiftCardsRequest params')

      const giftCards = await getGiftCardsRequest(params);

      //console.log(giftCards, 'gift acrds response"**********')

      if (requestId !== latestRequestId) {
        return;
      }

      if (!giftCards) {
        throw "get favourtire gift cards error";
      }

      dispatch(setGiftCards(giftCards));
    } catch (err) {
      console.log(err, "error");

      if (requestId === latestRequestId) {
        dispatch(setGiftCards([]));
      }
    } finally {
      if (requestId === latestRequestId) {
        dispatch(setGiftCardsLoading(false));
      }
    }
  };

