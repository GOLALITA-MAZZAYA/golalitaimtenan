import {Image, StyleSheet, View} from "react-native"
import {BALOO_SEMIBOLD} from "../../../../../redux/types"
import {useTheme} from "../../../../../components/ThemeProvider";
import {useTranslation} from "react-i18next";
import {isRTL} from "../../../../../../utils";
import DiscountLabel from '../../../../../assets/discountLabel.svg';
import {sized} from "../../../../../Svg";
import {colors} from "../../../../../components/colors";
import {TypographyText} from "../../../../../components/Typography";

const MerchantCard = ({uri, ribbonText, merchantName}) => {
    const {isDark} = useTheme();
    const {i18n} = useTranslation();
    const isArabic = i18n.language === 'ar';

    const DiscountLabelF = sized(
        DiscountLabel,
        12,
        12,
        isDark ? colors.black : colors.darkBlue,
    );

    const textColor = isDark ? colors.mainDarkMode : colors.darkBlue;
    const discountTextColor = isDark ? colors.mainDarkModeText : colors.darkBlue;

    return (
             <View style={styles.titleWrapper}>
                  <View
                    style={{
                      ...styles.wrapper,
                      flexDirection: isRTL() ? 'row-reverse' : 'row',
                    }}
                  >
                    <View>
                      <Image
                        source={{ uri }}
                        style={styles.logo}
                      />
                    </View>
                    <TypographyText
                      textColor={textColor}
                      size={18}
                      font={BALOO_SEMIBOLD}
                      title={merchantName}
                      style={{
                        marginHorizontal: 8,
                        flex: 1,
                      }}
                      numberOfLines={1}
                    />
                    {!!ribbonText && (
                      <View
                        style={{
                          ...styles.discountLabel,
                          backgroundColor: isDark ? colors.mainDarkMode : null,
                          borderColor: isDark ? null : colors.darkBlue,
                        }}
                      >
                        <DiscountLabelF />
                        <TypographyText
                          textColor={discountTextColor}
                          size={14}
                          font={BALOO_SEMIBOLD}
                          title={ribbonText}
                          style={styles.discountText}
                          numberOfLines={1}
                          textElipsis={'tail'}
                        />
                      </View>
                    )}
                  </View>
                </View>
    )
};

const styles = StyleSheet.create({
  discountLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  discountText: {
    marginLeft: 6,
    textAlign: 'center',
  },
  wrapper: {
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    flex: 1,
  },  
  logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "white",
  },
});

export default MerchantCard;