import { StyleSheet, TouchableOpacity, View } from "react-native";
import Image from "../../../../../components/AppImage";
import { colors } from "../../../../../components/colors";
import { isRTL } from "../../../../../../utils";
import { TypographyText } from "../../../../../components/Typography";
import { BALOO_2 } from "../../../../../redux/types";

const SaloonServiceCard = ({ logo, serviceName, price, duration, isSelected, onToggle, style }) => {
    const isRtl = isRTL();
    

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onToggle}
            style={[
                styles.wrapper,
                {
                    backgroundColor: isSelected ? colors.smallCardBackground : colors.cardBackground,
                    borderColor: isSelected ? colors.primary : colors.mainBorder,
                    flexDirection: isRtl ? 'row-reverse' : 'row'
                },
                style
            ]}
        >

            <Image source={{ uri: logo }} style={[styles.logo, { borderColor: colors.mainBorder }]} />

            <View style={[styles.descriptionBlock, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>

                <TypographyText
                    font={BALOO_2}
                    title={serviceName}
                    textColor={colors.mainText}
                    size={16}
                />

                <TypographyText
                    font={BALOO_2}
                    title={`${duration}`}
                    textColor={colors.textPrimary}
                    size={12}
                    style={styles.durationText}
                />

            </View>

            <View style={styles.priceBlock}>

                <TypographyText
                    font={BALOO_2}
                    title={`${price} QAR`}
                    textColor={colors.primary}
                    size={15}
                    style={styles.priceText}
                />

                <View style={[styles.checkCircle, isSelected && { backgroundColor: colors.primary, borderColor: colors.primary,}]}>
                    {isSelected && (
                        <TypographyText
                            font={BALOO_2}
                            title="✓"
                            textColor={colors.textForPrimaryBlock}
                            size={14}
                        />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    wrapper: {
        minHeight: 100,
        width: '100%',
        borderWidth: 1,
        borderRadius: 18,
        padding: 16,
        alignItems: 'center'
    },
    logo: {
        width: 70,
        height: 70,
        borderRadius: 14,
        borderWidth: 1
    },
    descriptionBlock: {
        marginHorizontal: 12,
        flex: 1,
    },
    durationText: {
        marginTop: 5
    },
    priceBlock: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 60
    },
    priceText: {
        fontWeight: '700'
    },
    checkCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: colors.loyaltySecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    checkCircleSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    }
});

export default SaloonServiceCard;
