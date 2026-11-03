import { StyleSheet, TouchableOpacity, View } from "react-native";
import Image from "../../../../../../components/AppImage";
import { useTheme } from "../../../../../../components/ThemeProvider";
import MainHeader from "../../../../../../components/Header";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../../../components/colors";
import { SCREEN_WIDTH } from "../../../../../../styles/mainStyles";
import { TypographyText } from "../../../../../../components/Typography";
import { BALOO_2 } from "../../../../../../redux/types";
import StarFilledSvg from '../../../../../../assets/star-filled.svg';
import { useState } from "react";
import ImageViewerModal from "../../../../../PremiumPartner/MerchantInfo/TabHeader/ImageViewerModal";
import SaloonCard from "./SaloonCard";


const Header = ({ saloon }) => {

    const { isDark } = useTheme();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const [isModalVisible, setIsModalVisible] = useState(false);


    const handleLogoPress = () => {
        setIsModalVisible(true)
    };

    const imageViewerData = [{
        url: saloon.photo,
        width: SCREEN_WIDTH,
        height: 232,
    }]

    const saloonName = isArabic ? saloon.name_ar : saloon.name;


    return (
        <View
            style={{
                backgroundColor: isDark ? colors.navyBlue : '#fff',
                width: '100%',
            }}
        >

            <MainHeader label={saloonName} btns={['back']} />
            <TouchableOpacity style={[styles.merchantLogoBlock, { backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder }]} onPress={handleLogoPress}>
                <Image source={{ uri: saloon.photo }} style={styles.merchantLogo} contentFit="cover" />

                {!!saloon?.rating && <View style={[
                    styles.ratingBlock,
                    {
                        flexDirection: isArabic ? 'row-reverse' : 'row',
                        backgroundColor: colors.loyaltyCardBackground,
                        borderColor: colors.loyaltyMainBorder,
                        left: isArabic ? 28 : 'auto',
                        right: isArabic ? 'auto' : 28,
                    }]}
                >
                    <StarFilledSvg color={colors.primary} />
                    <TypographyText
                        title={saloon.rating}
                        font={BALOO_2}
                        size={12}
                        style={styles.ratingText}
                        textColor={colors.loyaltyTextMainTitle}
                    />
                </View>}
            </TouchableOpacity>

            <SaloonCard
                uri={saloon.photo} // Using photo as logo for mock
                ribbonText={isArabic ? saloon.address_ar : saloon.address}
                merchantName={saloonName}
            />

            <ImageViewerModal
                onClose={() => setIsModalVisible(false)}
                isVisible={isModalVisible}
                data={imageViewerData}
            />
        </View>


    )
};

const styles = StyleSheet.create({
    merchantLogo: {
        height: 195,
        width: '100%',
        borderTopLeftRadius: 38,
        borderTopRightRadius: 38,
        aspectRatio: 23 / 10
    },
    merchantLogoBlock: {
        borderRadius: 38,
        height: 242,
        borderWidth: 1,
        overflow: 'hidden',
        marginTop: 10,
        marginHorizontal: 20
    },
    ratingBlock: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        position: 'absolute',
        top: 28,
        borderWidth: 1,
        gap: 6
    },
    ratingText: {
        fontWeight: '700'
    }
});

export default Header;
