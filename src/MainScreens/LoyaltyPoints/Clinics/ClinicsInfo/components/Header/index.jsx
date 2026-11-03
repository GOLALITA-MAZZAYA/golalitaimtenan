import {StyleSheet, TouchableOpacity, View} from "react-native";
import Image from "../../../../../../components/AppImage";
import {useTheme} from "../../../../../../components/ThemeProvider";
import MainHeader from "../../../../../../components/Header";
import {useTranslation} from "react-i18next";
import {colors} from "../../../../../../components/colors";
import {SCREEN_WIDTH} from "../../../../../../styles/mainStyles";
import {TypographyText} from "../../../../../../components/Typography";
import {BALOO_2} from "../../../../../../redux/types";
import StarFilledSvg from '../../../../../../assets/star-filled.svg';
import {useState} from "react";
import ImageViewerModal from "../../../../../PremiumPartner/MerchantInfo/TabHeader/ImageViewerModal";
import ClinicCard from "./ClinicCard";


const Header = ({clinic}) => {

    const {isDark} = useTheme();
    const {t, i18n} = useTranslation();
    const isArabic = i18n.language === 'ar';
    const [isModalVisible, setIsModalVisible] = useState(false);
    

    const handleLogoPress = () => {
       setIsModalVisible(true)
    };

    const imageViewerData = clinic?.banners?.map(banner => ({
        url: banner.banner_image,
        width: SCREEN_WIDTH,
        height: 232,
    }))

    const clinicName = isArabic ? clinic.name_ar : clinic.name;
    

    return (
      <View
        style={{
          backgroundColor: isDark ? colors.navyBlue : '#fff',
          width: '100%',
        }}
      >

        <MainHeader label={clinicName} btns={['back']}/>
        <TouchableOpacity style={[styles.merchantLogoBlock,{backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder}]} onPress={handleLogoPress}>
          <Image source={{uri: clinic.image}} style={styles.merchantLogo} contentFit="cover"/>

          {!!clinic?.rating && <View style={[
            styles.ratingBlock,
            { 
              flexDirection: isArabic ? 'row-reverse': 'row',
              backgroundColor: colors.loyaltyCardBackground,
              borderColor: colors.loyaltyMainBorder,
              left: isArabic ? 28: 'auto',
              right: isArabic ? 'auto': 28,
              borderColor: colors.loyaltyMainBorder
            }]}
              >
               <StarFilledSvg color={colors.primary}/>
               <TypographyText 
                 title={clinic.rating}
                 font={BALOO_2}
                 size={12}
                 style={styles.ratingText}
                 textColor={colors.loyaltyTextMainTitle}
               />
          </View>}
        </TouchableOpacity>

        <ClinicCard
           uri={clinic.logo}
           ribbonText={isArabic ? clinic.address_ar : clinic.address}
           merchantName={clinicName}
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
  bannerSwiper: {
    marginTop: 14,
    paddingHorizontal: 20
  },
  onlineStoreBtn: {
    backgroundColor: '#00A3FF',
    borderWidth: 0,
    marginTop: 25,
    marginHorizontal: 20
  },
  storeText: {
     color: '#fff'
  },
  merchantLogo: {
    height: 195,
    width: '100%',
    borderTopLeftRadius:38,
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