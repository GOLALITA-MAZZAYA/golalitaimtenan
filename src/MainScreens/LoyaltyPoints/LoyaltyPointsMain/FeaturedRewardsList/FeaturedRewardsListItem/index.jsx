import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {colors} from "../../../../../components/colors";
import {TypographyText} from "../../../../../components/Typography";
import ButtonWithImage from "../../../common/ButtonWithIcon";
import {isRTL} from "../../../../../../utils";

const FeaturedRewardslistItem = ({image, source, title, description, btnText, onPress, icon}) => {
    return (
      <TouchableOpacity style={[
           styles.wrapper,
           {flexDirection: isRTL() ? 'row-reverse': 'row',backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder,}
        ]}
      >
         <View style={[styles.infoBlock, {alignItems: isRTL()? 'flex-end': 'flex-start'}]}>
         <TypographyText
            title={title}
            textColor={colors.loyaltyTextMain}
            size={18}
            style={styles.actionText}
        /> 
        <TypographyText
            title={description}
            textColor={colors.loyaltyTextSecondary}
            size={10}
            style={styles.actionText}
        /> 

        <ButtonWithImage text={btnText} onPress={onPress} style={styles.btn} primary/>

         </View>

         <View style={styles.imageWrapper}>
            {image && image}
            {source && <Image source={source} resizeMode="contain" style={styles.logo}/>}
            {/* <Image source={source} style={styles.image}/> */}
         </View>
      </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    wrapper: {
       flexDirection: 'row',
       borderWidth: 1,
       borderRadius: 20,
       marginRight: 12
    },
    infoBlock: {
      paddingVertical: 9,
      paddingHorizontal: 18,
      alignItems: 'flex-start'
    },
    image: {
      
    },
    btn: {
        marginTop: 13
    },
    imageWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    logo: {
        width: 120,
        height: 75,
    }
});

export default FeaturedRewardslistItem;