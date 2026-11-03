import {StyleSheet, View} from "react-native"
import Image from "../../../../../../../components/AppImage"
import { BALOO_2 } from "../../../../../../../redux/types"
import {useTranslation} from "react-i18next";
import LocationSvg from '../../../../../../../assets/location.svg';
import {sized} from "../../../../../../../Svg";
import {colors} from "../../../../../../../components/colors";
import {TypographyText} from "../../../../../../../components/Typography";


const ClinicCard = ({uri, ribbonText, merchantName}) => {
    const {i18n} = useTranslation();
    const isArabic = i18n.language === 'ar';

    const DiscountLabelF = sized(
        LocationSvg,
        12,
        12,
        colors.loyaltyPrimary,
    );

    return (
        
                  <View
                    style={{
                      ...styles.wrapper,
                      flexDirection: isArabic ? 'row-reverse' : 'row',
                    }}
                  >
                    <View style={[styles.infoBlock,{paddingRight: isArabic ? 0: 15, paddingLeft: isArabic? 15: 0}]}>
                    <TypographyText
                      textColor={colors.loyaltyTextMainTitle}
                      size={20}
                      font={BALOO_2}
                      title={merchantName}
                      numberOfLines={1}
                      style={styles.title}

                    />
                    {!!ribbonText && (
                      <View
                        style={{
                          ...styles.discountLabel,
                          flexDirection: isArabic ? 'row-reverse' : 'row',
                        }}
                      >
                        <DiscountLabelF />
                        <TypographyText
                          textColor={colors.loyaltyPrimary}
                          size={14}
                          font={BALOO_2}
                          title={ribbonText}
                          style={styles.discountText}
                          numberOfLines={1}
                        />
                      </View>
                    )}
                    </View>

                        
                      <Image
                        source={{ uri }}
                        style={[styles.logo,{borderColor: colors.loyaltyMainBorder}]}
                      />
              
                  </View>
    
    )
};

const styles = StyleSheet.create({
  discountLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    flex: 1,
  },
  discountText: {
    flexGrow: 1,
    marginHorizontal: 8
  },
wrapper: {
  marginTop: 20,
  marginHorizontal: 20,
  flexDirection: 'row',
  alignItems: 'center'
},

logo: {
  width: 58,
  height: 58,
  borderRadius: 14,
  borderWidth: 1,
  flexShrink: 0
},

infoBlock: {
  flex: 1,
},
  title: {
    fontWeight: '700',
    flex: 1
  }
});

export default ClinicCard;