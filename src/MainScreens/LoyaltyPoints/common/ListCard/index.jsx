import {Image, StyleSheet, TouchableOpacity, View} from "react-native"
import RightArrowSvg from '../../../../assets/loyaltyPoints/rightArrow.svg';
import RightArrowLightSvg from '../../../../assets/loyaltyPoints/right-arrow-light';
import {colors} from "../../../../components/colors";
import {TypographyText} from "../../../../components/Typography";
import {isRTL} from "../../../../../utils";

const ListCard = ({icon, onPress, title, description, style, isDark}) => {

    return (
        <TouchableOpacity style={[styles.wrapper,
          {flexDirection: isRTL() ? 'row-reverse': 'row',
            backgroundColor: colors.loyaltyCardBackground,
            borderColor: colors.loyaltyMainBorder,
          },
           style,
          ]}
          onPress={onPress}
          >
           <View style={styles.iconWrapper}>
            <Image source={typeof icon === 'string' ? {uri: icon}: icon} style={styles.icon} resizeMode="cover"/>
          </View>

          <View style={styles.textWrapper}>
           <TypographyText
              title={title}
              textColor={colors.loyaltyTextMainTitle}
              size={18}
              style={styles.title}
            />

            {description && <TypographyText
              title={description}
              textColor={colors.loyaltyTextSecondary}
              size={14}
            />}
          </View>
          
          <View style={[
            styles.arrowWrapper,
            {
            transform: [
              { rotate: isRTL() ? "180deg": '0deg' },
            ]
            }
           ]}>
             {isDark ? <RightArrowSvg color={'white'}/>: <RightArrowLightSvg />}
          </View>

        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      padding: 16,
      borderRadius: 20,
      borderWidth: 1,
    },
    iconWrapper: {
      width: 52,
      height: 52,
      justifyContent: 'center',
      alignItems: 'center'
    },
    icon: {
      width: 52,
      height: 52,
      borderRadius: 14
    },
    title: {
        fontWeight: '700'
    },
    textWrapper: {
      paddingHorizontal: 8,
      justifyContent: 'center',
      flex: 1,
    },
    arrowWrapper: {
      alignSelf: 'stretch',
      justifyContent: 'center',
      alignItems: 'center'
    }
});

export default ListCard