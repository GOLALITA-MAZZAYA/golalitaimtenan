import {Image, StyleSheet, TouchableOpacity, View} from "react-native"
import {BALOO_SEMIBOLD} from "../../../../../redux/types"
import {TypographyText} from "../../../../../components/Typography"
import HeartSvg from "../../../../../assets/heart.svg";
import {colors} from "../../../../../components/colors";

const RoomRatesListItem = ({uri, isLiked, title, description, onPress, onSavePress, isDark}) => {

    const textColor = isDark ? "#fff" : colors.darkBlue;
    const heartColor = isLiked ? colors.darkBlue : "#DDDFE4";
    
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.logoWrapper}>
                <Image source={{uri}} style={styles.logo}/>
            </View>
            <View style={styles.descriptionWrapper}>

                      <TypographyText
                          textColor={textColor}
                          size={16}
                          font={BALOO_SEMIBOLD}
                          title={title}
                          numberOfLines={3}
                        />

                
            </View>
            <View style={styles.likeWrapper}>
                    <TouchableOpacity onPress={onSavePress} style={styles.heartBtn}>
                          <HeartSvg color={heartColor} />
                     </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
   card: {
     flexDirection: 'row',
     marginBottom: 25
   },
   logoWrapper: {

   },
   logo:{
      width: 80,
      height: 80,
      borderRadius: 4
   },
   descriptionWrapper: {
     flex: 1,
     paddingHorizontal: 10,
     justifyContent: 'flex-start',
   },
   likeWrapper: {
     justifyContent: 'center',
     alignItems: 'center',
     alignSelf: 'stretch'
   }
});

export default RoomRatesListItem;