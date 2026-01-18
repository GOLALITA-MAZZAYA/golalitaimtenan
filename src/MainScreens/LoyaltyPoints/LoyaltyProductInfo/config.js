import i18next from "i18next";
import {isRTL} from "../../../../utils";

export const getInfoBlocksConfig = (product) => {
  const data = [
    {
      title: i18next.t('LoyaltyOffers.description'),
      value: isRTL() ? product.description_arabic : product.description_sale,
      valueType: 'string',
    },
    {
       title: i18next.t('LoyaltyOffers.expiryDate'),
       value: `${product.loyalty_expiry_date}`,
       valueType: 'string',
    }
  ];

  return data;
};
