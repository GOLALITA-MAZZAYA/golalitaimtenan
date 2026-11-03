import { StyleSheet, TouchableOpacity, View } from "react-native";
import Image from "../../../../../components/AppImage";
import { colors } from "../../../../../components/colors";
import { TypographyText } from "../../../../../components/Typography";
import RightArrowSvg from "../../../../../assets/loyaltyPoints/rightArrow.svg";
import { isRTL } from "../../../../../../utils";
import { BALOO_2 } from "../../../../../redux/types";
import { useTranslation } from "react-i18next";

const VoucherCard = ({ base64, title, description, pointValue, priceValue, earnValue, expiringDate, onPress, style }) => {
    const isRtl = isRTL();
    const { t } = useTranslation();

    const displayTitle = description || title;

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            style={[
                styles.wrapper,
                { backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder },
                style
            ]}
            onPress={onPress}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: base64?.startsWith?.('http') ? base64 : `data:image/png;base64,${base64}` }}
                    style={styles.logo}
                    contentFit="cover"
                />

                {!!expiringDate && (
                    <View style={[
                        styles.expiringDate,
                        { left: isRtl ? undefined : 8, right: isRtl ? 8 : undefined }
                    ]}>
                        <TypographyText
                            title={expiringDate}
                            font={BALOO_2}
                            style={styles.expiringText}
                            textColor="#FFFFFF"
                        />
                    </View>
                )}
            </View>

            <View style={styles.infoBlock}>
                {/* Header Row: Brand Title & Chevron */}
                <View style={[styles.infoHeader, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    <View style={styles.infoBlockTitles}>
                        {!!displayTitle && (
                            <TypographyText
                                title={displayTitle}
                                font={BALOO_2}
                                size={12}
                                textColor={colors.loyaltyTextMainTitle}
                                style={styles.cardTitle}
                            // numberOfLines={1}
                            />
                        )}
                    </View>

                    {/* <View style={[
                        styles.arrow,
                        { paddingLeft: isRtl ? 0 : 4, paddingRight: isRtl ? 4 : 0 },
                        { transform: [{ rotate: isRtl ? "180deg" : '0deg' }] }
                    ]}>
                        <RightArrowSvg color={colors.loyaltyTextMain} width={14} height={14} />
                    </View> */}
                </View>

                <View style={[styles.infoFooter, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                    {/* Price Block: Points Cost on Line 1, Cash Price on Line 2 */}
                    <View style={[styles.priceBlock, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
                        {/* Line 1: Points Cost */}
                        {!!pointValue && <View style={[styles.pointsInline, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                            <TypographyText
                                title={pointValue}
                                font={BALOO_2}
                                size={12}
                                style={styles.pointsValue}
                                textColor={colors.loyaltyTextPrimary}
                            />
                            <TypographyText
                                title={t('LoyaltyVouchers.pts')}
                                font={BALOO_2}
                                size={12}
                                style={[styles.pointsUnitText, { marginLeft: isRtl ? 0 : 3, marginRight: isRtl ? 3 : 0 }]}
                                textColor={colors.loyaltyTextPrimary}
                            />
                        </View>}

                        {/* Line 2: "or 100 QAR" */}
                        {!!priceValue && (
                            <View style={[styles.priceInline, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                                {!!pointValue && <TypographyText
                                    title={t('LoyaltyVouchers.or')}
                                    font={BALOO_2}
                                    size={11}
                                    textColor={colors.loyaltyTextSecondary3}
                                    style={[styles.orText, { marginRight: isRtl ? 0 : 3, marginLeft: isRtl ? 3 : 0 }]}
                                />}
                                <TypographyText
                                    title={priceValue}
                                    font={BALOO_2}
                                    size={11}
                                    style={styles.priceValue}
                                    textColor={colors.loyaltyTextMainTitle}
                                />
                                <TypographyText
                                    title={t('LoyaltyVouchers.qar')}
                                    font={BALOO_2}
                                    size={11}
                                    style={[styles.priceUnitText, { marginLeft: isRtl ? 0 : 3, marginRight: isRtl ? 3 : 0 }]}
                                    textColor={colors.loyaltyTextMainTitle}
                                />
                            </View>
                        )}
                    </View>

                    {/* Earn Reward Block - Stacked in 2 Lines (Earn on top, +0 Pts below) */}
                    {(earnValue !== undefined && earnValue !== null) && (
                        <View style={[styles.earnBlock, { alignItems: isRtl ? 'flex-start' : 'flex-end' }]}>
                            <TypographyText
                                title={t('LoyaltyVouchers.earn')}
                                font={BALOO_2}
                                size={11}
                                textColor={colors.loyaltyCardExpiringText}
                                style={styles.earnTitle}
                            />
                            <View style={[styles.earnValueRow, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
                                <TypographyText
                                    title={`${isRtl ? '' : '+'}${earnValue}${isRtl ? '+' : ''}`}
                                    font={BALOO_2}
                                    size={12}
                                    textColor={colors.success}
                                    style={styles.earnPointsValue}
                                />
                                <TypographyText
                                    title={t('LoyaltyVouchers.pts')}
                                    font={BALOO_2}
                                    size={12}
                                    textColor={colors.success}
                                    style={[styles.earnPointsText, { marginLeft: isRtl ? 0 : 3, marginRight: isRtl ? 3 : 0 }]}
                                />
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        maxWidth: '48.5%',
        borderWidth: 1,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        backgroundColor: '#FFFFFF',
    },
    logo: {
        height: 125,
        width: '100%',
    },
    expiringDate: {
        position: 'absolute',
        top: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    expiringText: {
        fontSize: 10,
        fontWeight: '600',
    },
    infoBlock: {
        paddingHorizontal: 6,
        paddingTop: 10,
        paddingBottom: 12,
    },
    infoHeader: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    infoBlockTitles: {
        flex: 1,
    },
    cardTitle: {
        fontWeight: '700',
    },
    arrow: {
        justifyContent: 'center',
    },
    infoFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 2,
    },
    priceBlock: {
        alignItems: 'baseline',
        flexWrap: 'wrap',
        flex: 1,
    },
    pointsInline: {
        alignItems: 'baseline',
    },
    pointsValue: {
        fontWeight: '800',
    },
    pointsUnitText: {
        fontWeight: '600',
    },
    orText: {
        fontWeight: '400',
    },
    priceInline: {
        alignItems: 'baseline',
    },
    priceValue: {
        fontWeight: '600',
    },
    priceUnitText: {
        fontWeight: '500',
    },
    earnBlock: {
        justifyContent: 'center',
    },
    earnTitle: {
        fontWeight: '500',
    },
    earnValueRow: {
        alignItems: 'center',
    },
    earnPointsValue: {
        fontWeight: '700',
    },
    earnPointsText: {
        fontWeight: '600',
    },
});

export default VoucherCard;