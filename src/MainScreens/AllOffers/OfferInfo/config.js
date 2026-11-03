import CallSvg from '../../../assets/call.svg';
import MenuBookSvg from '../../../assets/menu-book.svg';
import { sized } from '../../../Svg';
import i18next from 'i18next';
import { Linking } from 'react-native';
import { getStringDate, isRTL } from '../../../../utils';
import { B1G1, PROMOCODE } from '../../../redux/types';
import { colors } from '../../../components/colors';
import { navigate } from '../../../Navigation/RootNavigation';
import { track } from '../../../redux/merchant/merchant-thunks';
import { getMerchantDetails } from '../../../api/merchants';
import store from '../../../redux/store';
import InstructionSvg from '../../../assets/loyaltyPoints/instruction.svg';
import EmailSvg from '../../../assets/mailf.svg';
import PhoneSvg from '../../../assets/loyaltyPoints/partners/phone.svg';
import DiscountLabelSvg from '../../../assets/discountLabel.svg';

export const OFFER_TAB_CONSTANTS = {
  OFFERS: "OFFERS",
  INFO: "INFO",
  GALLERY: 'GALLERY'
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
      title: i18next.t('ProductPage.description'),
      description: isRTL() ? offer.description_arabic : offer.description_sale,
      icon: <InstructionSvg color={colors.loyaltyPrimary} />,
      visible: isRTL() ? offer.description_arabic : offer.description_sale,
      header: true
    },
    {
      title: i18next.t("ProductPage.phone"),
      description: offer.merchant_phone,
      onPress: () => Linking.openURL(`tel:${offer.merchant_phone}`),
      icon: <PhoneSvg color={colors.loyaltyPrimary} />,
      visible: offer.merchant_phone
    },
    {
      title: i18next.t('ProductPage.email'),
      description: offer.merchant_email,
      onPress: () => Linking.openURL(`mailto:${offer.merchant_email}`),
      icon: <EmailSvg color={colors.loyaltyPrimary} />,
      shortVersion: true,
      shortVersionTitle: i18next.t('ProductPage.sendEmail'),
      visible: offer.merchant_email
    },
  ];

  if (bookNow === 'true') {
    data.push({
      title: i18next.t("ProductPage.price"),
      description: `${offer.price} ${i18next.t('General.qar')}`,
      icon: <DiscountLabelSvg width={14} height={14} color={colors.loyaltyPrimary} />,
      visible: offer.price
    });
  }

  return data.filter(item => item.visible)
};

export const getOfferTypeInfoBtnsConfig = offer => {

  console.log(offer,'offer')

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
          promo_code_description: offer.promo_code_description
        });
      },
    },
    {
      visible: offer.offer_type === PROMOCODE && offer.offer_type_promo_code,
      label: i18next.t('ProductPage.getPromocode'),
      onPress: async () => {
        store.dispatch(track('promocode', offer.product_id, false, offer.offer_type_promo_code));
        store.dispatch(track('promocode', offer.product_id, true, offer.offer_type_promo_code));

        let store_website;

        if (offer.online_store) {
          try {
            const merchantData = await getMerchantDetails({
              merchant_id: offer.merchant_id,
            });

            store_website = merchantData?.website;
          } catch (error) {
            console.error('Failed to fetch merchant details:', error);
          }
        }

        navigate('AllOffers', {
          screen: 'merchant-code-confirmation',
          params: {
            merchantName: isRTL() ? offer.merchant_name_arabic : offer.merchant_name,
            confirmationNumber: offer.offer_type_promo_code,
            id: offer.product_id,
            promocode: offer.offer_type_promo_code,
            merchant_id: offer.merchant_id,
            expiryDate: offer.end_date
              ? getStringDate(offer.end_date.split(' ')[0])
              : null,
            x_is_support_qr_promo: offer.x_is_support_qr_promo,
            qr_code_image_link: offer.qr_code_image_link,
            promo_code_description: offer.promo_code_description,
            store_website,
          },
        });
      },
    },
  ];
};
