import i18next from "i18next"
import {Linking} from "react-native";
import CallSvg from '../../../../../assets/loyaltyPoints/partners/phone.svg';
import {colors} from "../../../../../components/colors";
import InstructionSvg from '../../../../../assets/loyaltyPoints/instruction.svg';
import EmailSvg from '../../../../../assets/mailf.svg';
import LocationSvg from '../../../../../assets/location.svg';

export const getSmallDescriptionBlocks = (restaurant) => {

    const isArabic = i18next.language === 'ar';

    const data = [
        {
          title: i18next.t('Merchants.phone'),
          description: restaurant?.contact?.phone,
          onPress: () => Linking.openURL(`tel:${restaurant?.contact?.phone}`),
          icon: <CallSvg color={colors.loyaltyPrimary} />,
          visible: restaurant?.contact?.phone
        },
        {
          title: i18next.t('ProductPage.workingHours'),
          description: `${restaurant.operating_hours.general.open} - ${restaurant.operating_hours.general.close}`,
          icon: <InstructionSvg color={colors.loyaltyPrimary}/>,
          visible: restaurant?.operating_hours?.general?.open && restaurant?.operating_hours?.general?.close
        },
        {
            title: i18next.t('ProductPage.email'),
            description: restaurant?.contact?.email,
            onPress: () => Linking.openURL(`mailto:${restaurant?.contact?.email}`),
            icon: <EmailSvg color={colors.loyaltyPrimary}/>,
            visible: restaurant?.contact?.email,
            shortVersion: true,
            shortVersionTitle: i18next.t('ProductPage.sendEmail')
        },
        {
          title: i18next.t('ProductPage.address'),
          description: isArabic ? restaurant?.contact?.address_ar: restaurant?.contact?.address_ar,
          icon: <LocationSvg color={colors.loyaltyPrimary}/>,
          visible: true,
          footer: true
        },
    ];

    return data.filter(it => it.visible);
}