import CallSvg from '../../../assets/call.svg';
import MenuBookSvg from '../../../assets/menu-book.svg';
import { sized } from '../../../Svg';
import i18next from 'i18next';
import { Linking } from 'react-native';
import { getStringDate, isRTL } from '../../../../utils';
import { B1G1, PROMOCODE } from '../../../redux/types';
import { colors } from '../../../components/colors';
import { navigate } from '../../../Navigation/RootNavigation';

export const OFFER_TAB_CONSTANTS = {
  OFFERS: "OFFERS",
  INFO: "INFO"
}

export const getInfoBtnsConfig = (offer, isDark) => {
  const btnColor = isDark ? colors.mainDarkMode : colors.darkBlue;

  const MenuBookIcon = sized(MenuBookSvg, 16, 16, btnColor);
  const CallIcon = sized(CallSvg, 16, 16, btnColor);

  return [
    {
      visible: !!offer?.merchant_mobile || !!offer?.merchant_phone,
      disabled: !offer?.merchant_mobile && !offer?.merchant_phone,
      text: i18next.t('Merchants.phone'),
      icon: CallIcon,
      onPress: () => {
        const phone = offer?.merchant_mobile || offer?.merchant_phone;
        Linking.openURL(`tel:${phone}`);
      },
      //Linking.openURL(`tel:${offer.merchant_mobile}`),
    },
    {
      visible: offer?.offer_detail_url,
      disabled: false,
      text: i18next.t('Merchants.offerContract'),
      icon: MenuBookIcon,
      onPress: () => {
        navigate('offer-menu', {
          company_contract_url: offer.offer_detail_url,
        });
      },
    },
    {
      visible: offer?.merchant_contract_url,
      disabled: false,
      text: i18next.t('Merchants.contract'),
      icon: MenuBookIcon,
      onPress: () => {
        navigate('offer-menu', {
          company_contract_url: offer?.merchant_contract_url,
        });
      },
    },
  ];
};

export const getInfoBlocksConfig = (offer, bookNow) => {
  const data = [
    {
      title: i18next.t('Product.name'),
      value: isRTL() ? offer.arabic_name : offer.name,
      valueType: 'string',
    },
    // {
    //   title: i18next.t("ProductPage.price"),
    //   value: `${offer.price} QAR`,
    //   valueType: "string",
    // },
    // {
    //   title: i18next.t("ProductPage.disReceivable"),
    //   value: `${offer.discount}%`,
    //   valueType: "string",
    // },
    {
      title: i18next.t('ProductPage.description'),
      value: isRTL() ? offer.description_arabic : offer.description_sale,
      valueType: 'string',
    },
    // {
    //   title: i18next.t("ProductPage.phone"),
    //   value: offer.merchant_phone,
    //   valueType: "string",
    //   onPress: () => Linking.openURL(`tel:${offer.marchant_mobile}`),
    // },
    {
      title: i18next.t('ProductPage.email'),
      value: offer.merchant_email,
      valueType: 'string',
      onPress: () => {},
    },
  ];

  if (bookNow === 'true') {
    data.unshift({
      title: i18next.t('ProductPage.price'),
      value: offer.price,
      valueType: 'string',
    });
  }

  return data;
};

export const getOfferTypeInfoBtnsConfig = offer => {
  return [
    {
      visible: offer.offer_type === B1G1,
      label: i18next.t('ProductPage.b1g1Free'),
      onPress: () => {
        navigate('Promocode', {
          merchant_name: isRTL() ? offer.arabic_name : offer.name,
          name: isRTL() ? offer.arabic_name : offer.name,
          expiryDate: offer.end_date
            ? getStringDate(offer.end_date.split(' ')[0])
            : null,
          merchant_logo: offer.merchant_logo,
          id: offer.product_id,
          promocode: offer.x_offer_type_promo_code,
          merchant_id: offer.merchant_id,
          isB1G1: offer.offer_type === B1G1,
          branches: offer.branches,
        });
      },
    },
    {
      visible: offer.offer_type === PROMOCODE && offer.offer_type_promo_code,
      label: i18next.t('ProductPage.getPromocode'),
      onPress: () => {
        navigate('Voucher', {
          name: offer.name,
          id: offer.product_id,
          merchant_name: offer.merchant_name,
          expiryDate: offer.end_date
            ? getStringDate(offer.end_date.split(' ')[0])
            : null,
          merchant_logo: offer.merchant_logo,
          promocode: offer.offer_type_promo_code,
          merchant_id: offer.merchant_id,
        });
      },
    },
  ];
};
