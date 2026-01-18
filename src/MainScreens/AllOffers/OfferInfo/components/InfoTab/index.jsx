import {useTranslation} from "react-i18next"
import CommonButton from "../../../../../components/CommonButton/CommonButton"
import FullScreenImageModal from "../FullScreenImageModal"
import InfoBlocks from "../InfoBlocks"
import {useTheme} from "../../../../../components/ThemeProvider"
import {colors} from "../../../../../components/colors"
import {StyleSheet} from "react-native"

const InfoTab = ({onMerchantDetailsPress, onBookNowPress, selectedImageUrl, onModalClose, infoBlocksConfig, bookNow}) => {
    const {t} = useTranslation();
    const {isDark} = useTheme();

    return (
        <>
            <InfoBlocks data={infoBlocksConfig} />

            <FullScreenImageModal
              visible={!!selectedImageUrl}
              url={selectedImageUrl}
              onClose={onModalClose}
            />

            <CommonButton
              onPress={onMerchantDetailsPress}
              label={t("ProductPage.merchantDetails")}
              textColor={isDark ? colors.mainDarkModeText : colors.white}
              style={styles.merchantBtn}
            />

            {bookNow === "true" && (
              <CommonButton
                onPress={onBookNowPress}
                label={t("Merchants.requestReservation")}
                textColor={isDark ? colors.mainDarkModeText : colors.white}
                style={styles.merchantBtn}
            />
        )}
        </>
    )
};

const styles = StyleSheet.create({
  merchantBtn: {
    marginTop: 20,
  },
});


export default InfoTab;