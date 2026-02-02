import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {TypographyText} from "../../../Typography";
import {isRTL} from "../../../../../utils";
import {colors} from "../../../colors";
import OkSvg from '../../../../assets/loyaltyPoints/ok.svg';
import {BALOO_2} from "../../../../redux/types";


const ModalListItem = (props) => {
    const {item, isActive, toggleItem} = props;

    const isRtl = isRTL();


    return (
      <TouchableOpacity style={[
          styles.wrapper,
         {flexDirection: isRtl ? 'row-reverse': "row", backgroundColor: isActive ? colors.loyaltyRadioBorder : colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder}
        ]}
        onPress={toggleItem}
       >
        <View style={[styles.titleWrapper,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>
        {item?.icon && (
            <Image source={{uri: `data:image/png;base64,${item.icon}`}} style={styles.icon}/>
        )}

        <TypographyText 
           title={isRtl ? item.label_arabic : item.label}
           font={BALOO_2}
           style={[styles.title, {marginHorizontal: item?.icon ? 14: 0}]}
           textColor={isActive ? colors.loyaltyRadioBorderActive: colors.loyaltyTextInputText}
        />
        </View>

         <View style={[styles.circleWrapper,{borderColor: isActive ? colors.loyaltyRadioBorderActive : colors.loyaltyRadioBorder}]}>
            {isActive && <OkSvg color={isActive ? colors.loyaltyRadioBorderActive: colors.loyaltyPrimary} height={10} width={10} size={10}/>}
        </View>
      </TouchableOpacity>
    );
};



const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 66,
      flexGrow: 1,
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 20,
      marginTop: 8
    },
    circleWrapper: {
       width: 25,
       height: 25,
       borderRadius: 25,
       justifyContent: 'center',
       alignItems: 'center',
       borderWidth: 2,
    },
    title: {
      fontSize: 16,
    },
    circle: {

    },
    titleWrapper: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    icon: {
        width: 32,
        height: 20
    }
});

export default ModalListItem;