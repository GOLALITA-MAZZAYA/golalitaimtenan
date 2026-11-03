import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "../../../../components/colors";
import { isRTL } from "../../../../../utils";
import { TypographyText } from "../../../../components/Typography";
import { BALOO_2 } from "../../../../redux/types";
import { getStatusColor, getStatusTranslation } from "../../../../components/AppointmentCard/helpers";
import { formatDate } from "../../../LoyaltyPoints/Clinics/helpers";
import { useTranslation } from "react-i18next";

const SaloonHistoryCard = ({ date, booking_reference, name, status, onPress, services, staff, total_estimated_price, currency, style }) => {
    const { t } = useTranslation();
    const isRtl = isRTL();

    const servicesText = Array.isArray(services) ? services.join(', ') : services || '';

    return (
        <TouchableOpacity onPress={() => onPress(booking_reference)} style={[styles.wrapper, { backgroundColor: colors.cardBackground, borderColor: colors.mainBorder, flexDirection: isRtl ? 'row-reverse' : 'row' }, style]}>

            <View style={[styles.iconContainer, { backgroundColor: colors.smallCardBackground, borderColor: colors.primaryBorderLight }]}>
                <TypographyText
                    font={BALOO_2}
                    title="✂️"
                    size={24}
                />
            </View>

            <View style={[styles.descriptionBlock, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>

                <TypographyText
                    font={BALOO_2}
                    title={name}
                    textColor={colors.mainText}
                    size={16}
                />

                <TypographyText
                    font={BALOO_2}
                    title={servicesText || staff || ''}
                    textColor={colors.textPrimary}
                    size={12}
                    style={styles.specialtyText}
                    numberOfLines={1}
                />

            </View>

            {!!status && <View style={[styles.statusBlock, { alignItems: isRtl ? 'flex-start' : 'flex-end' }]}>

                <TypographyText
                    font={BALOO_2}
                    title={getStatusTranslation(status)}
                    textColor={getStatusColor(status)}
                    size={12}
                    weight="500"
                />

                <TypographyText
                    font={BALOO_2}
                    title={formatDate(date)}
                    textColor={colors.textSecondary}
                    size={12}
                    style={styles.dateText}
                />

            </View>}
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    wrapper: {
        minHeight: 101,
        width: '100%',
        borderWidth: 1,
        borderRadius: 34,
        padding: 16,
        alignItems: 'center'
    },
    iconContainer: {
        width: 59,
        height: 59,
        borderRadius: 14,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    descriptionBlock: {
        marginHorizontal: 8,
        flex: 1,
        alignItems: 'flex-start'
    },
    specialtyText: {
        marginTop: 5
    },
    dateText: {
        marginTop: 8
    }
});

export default SaloonHistoryCard;
