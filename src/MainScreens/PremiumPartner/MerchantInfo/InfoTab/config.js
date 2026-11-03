import i18next from "i18next";
import { Linking } from "react-native";
import CallSvg from '../../../../assets/loyaltyPoints/partners/phone.svg';
import { colors } from "../../../../components/colors";
import InstructionSvg from '../../../../assets/loyaltyPoints/instruction.svg';
import EmailSvg from '../../../../assets/mailf.svg';
import PlanetSvg from '../../../../assets/planet.svg';
import LocationSvg from '../../../../assets/location.svg';
import { sized } from '../../../../Svg';
import trackActivity from '../../../../api/activityTracker';

const PhoneIcon = sized(CallSvg, 18, 18, colors.loyaltyPrimary);
const TimeIcon = sized(InstructionSvg, 18, 18, colors.loyaltyPrimary);
const MailIcon = sized(EmailSvg, 18, 18, colors.loyaltyPrimary);
const WebIcon = sized(PlanetSvg, 18, 18, colors.loyaltyPrimary);
const PinIcon = sized(LocationSvg, 18, 18, colors.loyaltyPrimary);

export const getSmallDescriptionBlocks = (merchant) => {

    const isArabic = i18next.language === 'ar';
    const merchant_id = merchant.id ?? merchant.merchant_id;

    const trackLinkClick = (link_type, link_value) => trackActivity('merchant_detail_link_click', {
      merchant_id,
      page_name: 'merchant_detail',
      metadata: { link_type, link_value, source: 'info_tab' },
    });

    const data = [
        {
          title: i18next.t('Merchants.phone'),
          description: merchant.phone,
          onPress: () => {
            trackLinkClick('phone', merchant.phone);
            Linking.openURL(`tel:${merchant.phone}`);
          },
          icon: <PhoneIcon />,
          visible: merchant.phone,
        },
        {
          title: i18next.t('ProductPage.workingHours'),
          description: `${merchant.open_from} - ${merchant.open_till}`,
          icon: <TimeIcon />,
          visible: merchant.open_from && merchant.open_till,
        },
        {
            title: i18next.t('ProductPage.email'),
            description: merchant.email,
            onPress: () => {
              trackLinkClick('email', merchant.email);
              Linking.openURL(`mailto:${merchant.email}`);
            },
            icon: <MailIcon />,
            visible: merchant.email,
            shortVersion: true,
            shortVersionTitle: i18next.t('ProductPage.sendEmail'),
        },
        {
            title: i18next.t('ProductPage.website'),
            description: merchant.website,
            onPress: () => {
              trackActivity('page_visit', {
                merchant_id,
                page_name: 'merchant_website',
                metadata: { link_type: merchant?.category_id === 192 ? 'book_now' : 'website', link_value: merchant.website, source: 'info_tab' },
              });
              Linking.openURL(merchant.website);
            },
            icon: <WebIcon />,
            visible: merchant.website,
            shortVersion: true,
            shortVersionTitle: merchant?.category_id === 192 ? i18next.t('ProductPage.bookNow') : i18next.t('ProductPage.visitWebsite'),
        },
        {
          title: i18next.t('ProductPage.address'),
          description: isArabic
          ? `${merchant.x_arabic_name || ''} ${merchant.x_street_ar ? `${merchant.x_street_ar},` : ''}${merchant.x_city_ar ? `,${merchant.x_city_ar}` : ''}${merchant.x_country_ar ? `, ${merchant.x_country_ar}` : ''}`
          : merchant.address,
          icon: <PinIcon />,
          visible: true,
          footer: true,
        },
    ];

    return data.filter(it => it.visible);
};