import {Image, StyleSheet, TouchableOpacity, View} from "react-native"
import {colors} from "../../../../../components/colors";
import {TypographyText} from "../../../../../components/Typography";
import RightArrowSvg from "../../../../../assets/loyaltyPoints/rightArrow.svg";
import {isRTL} from "../../../../../../utils";
import {BALOO_2} from "../../../../../redux/types";
import {useTranslation} from "react-i18next";

const VoucherCard = ({base64, title, description, pointValue, priceValue, earnValue, expiringDate, onPress}) => {
    const isRtl = isRTL();
    const {t} = useTranslation();


    return (
        <TouchableOpacity style={[styles.wrapper,{backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder}]} onPress={onPress}>

            <Image source={{uri: `data:image/png;base64,${base64}`}} style={styles.logo} resizeMode="cover"/>

            <View style={styles.infoBlock}>
                <View style={[styles.infoHeader,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>

                    <View style={styles.infoBlockTitles}>
                    <TypographyText 
                      title={title}
                      font={BALOO_2}
                      size={14}
                      textColor={colors.loyaltyTextPrimary}
                      style={styles.title}
                      numberOfLines={1}
                    />
                    {!!description && <TypographyText 
                      title={description}
                      font={BALOO_2}
                      size={20}
                      textColor={colors.loyaltyTextMainTitle}
                      style={styles.subTitle}
                      numberOfLines={1}
                    />}
                    </View>

                    <View style={[
                        styles.arrow,
                        {paddingRight: isRtl ? 0: 10, paddingLeft: isRtl? 10: 0},
                        { transform: [
                        { rotate: isRtl ? "180deg": '0deg' }]}
                        ]}>
                        <RightArrowSvg color={colors.loyaltyTextMain}/>
                    </View>

                </View>
                <View style={[styles.infoFooter,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>

                    <View style={[styles.priceBlock,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>


                    <View style={[styles.points,{borderColor: colors.loyaltyTabsBorder, backgroundColor: colors.loyaltyTabsBackground, flexDirection: isRtl ? 'row-reverse': 'row'}]}>
                      <TypographyText 
                       title={pointValue}
                       font={BALOO_2}
                       size={14}
                       style={styles.pointsValue}
                       textColor={colors.loyaltyTextPrimary}
                     />
                     <TypographyText 
                       title={t('LoyaltyVouchers.pts')}
                       font={BALOO_2}
                       size={14}
                       style={[styles.pointsValueText,{marginLeft: isRtl? 4: 0, marginRight: isRtl?4:0}]}
                       textColor={colors.loyaltyTextPrimary}
                     />
                    </View>

                      <TypographyText 
                       title={t('LoyaltyVouchers.or')}
                       font={BALOO_2}
                       size={14}
                       textColor={colors.loyaltyTextSecondary3}
                       style={styles.orText}
                     />

                     <View style={[styles.price,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>
                       <TypographyText 
                        title={priceValue}
                        font={BALOO_2}
                        size={14}
                        style={styles.priceValue}
                        textColor={colors.loyaltyCardExpiringText}
                      />
                      <TypographyText 
                        title={t('LoyaltyVouchers.qar')}
                        font={BALOO_2}
                        size={14}
                        style={styles.priceValueText}
                        textColor={[colors.loyaltyCardExpiringText,{marginLeft: isRtl? 4: 0, marginRight: isRtl?4:0}]}
                      />
                     </View>

                    </View>

                    <View style={[styles.earnsBlock,{alignItems: isRtl ? 'flex-start': 'flex-end'}]}>
                      <TypographyText 
                        title={t('LoyaltyVouchers.earn')}
                        font={BALOO_2}
                        size={12}
                        textColor={colors.loyaltyCardExpiringText}
                        style={styles.earnTitle}
                      />

                      <View style={[styles.earnValueBlock,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>
                       <TypographyText 
                        title={`${isRtl?'':'+'}${earnValue}${isRtl?'+':''}`}
                        font={BALOO_2}
                        size={14}
                        textColor={colors.loyaltyTextPrimary}
                        style={styles.earnPointsValue}
                       />
                       <TypographyText 
                        title={t('LoyaltyVouchers.pts')}
                        font={BALOO_2}
                        size={14}
                        textColor={colors.loyaltyTextPrimary}
                        style={[styles.earnPointsText,{marginLeft: isRtl? 0: 4, marginRight: isRtl?4:0}]}
                       />
                      </View>

                    </View>

                </View>

            </View>

            {!!expiringDate && <View style={[
                styles.expiringDate,
                {backgroundColor: colors.loyaltyExpiringCard, borderColor: colors.loyaltyMainBorder, left: isRtl ? undefined: 20, right: isRtl ? 20: undefined}
                ]}>
                <TypographyText 
                    title={expiringDate}
                    font={BALOO_2}
                    style={styles.expiringText}
                    textColor={colors.loyaltyCardExpiringText}
                />
            </View>}

        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      height: 344,
      borderWidth: 1,
      marginBottom: 16,
      borderRadius: 38,
      overflow: 'hidden'
    },
    logo: {
        height: 195,
        borderTopLeftRadius: 38,
        borderTopRightRadius: 38
    },
    title: {
      fontWeight: '500'
    },
    subTitle: {
      fontWeight: '700',
      marginTop: 5
    },
    infoBlock: {
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 16,
        justifyContent: 'space-between'
    },
    points: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 18
    },
    pointsValue: {
      fontWeight: '700'
    },
    pointsValueText: {
       marginLeft: 4
    },
    infoBlockTitles: {
        flex: 1
    },
    arrow: {

    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    priceBlock: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    expiringDate: {
        position: 'absolute',
        top: 20,
        height: 28,
        paddingVertical: 7,
        paddingHorizontal: 11,
        borderRadius: 20,
        borderWidth: 1

    },
    expiringText: {
     fontSize: 9,
     fontWeight: '700'
    },
    price: {
        flexDirection: 'row',
        paddingVertical: 10
    },
    priceValue: {

    },
    priceValueText: {
       marginLeft: 4
    },
    orText: {
        marginHorizontal: 10
    },
    earnsBlock: {
        alignItems: 'flex-end'
    },
    earnValueBlock: {
      marginTop: 2,
      flexDirection: 'row'
    },
    earnPointsValue: {
        fontWeight: '700'
    },
    earnPointsText: {
      marginLeft: 4,
      fontWeight: '500'
    },
    earnTitle: {
      fontWeight: '500'
    }
});

export default VoucherCard;