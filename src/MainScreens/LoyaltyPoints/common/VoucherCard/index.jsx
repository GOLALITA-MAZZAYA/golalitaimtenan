import {Image, StyleSheet, TouchableOpacity, View} from "react-native"
import {TypographyText} from "../../../../components/Typography";
import {colors} from "../../../../components/colors";
import {useTranslation} from "react-i18next";

const VoucherCard = ({onPress, uri, style, expiringDate, value=0, title}) => {
    const {t} = useTranslation();
    
    return (
        <TouchableOpacity onPress={onPress} style={[styles.wrapper, style]}>

            <Image source={{ uri: `data:image/png;base64,${uri}` }} style={styles.backgroundImage} resizeMode="cover"/>

            <View style={styles.expiringDateBlock}>
              
                    <TypographyText
                      title={expiringDate}
                      textColor={'white'}
                      size={14}
                      style={styles.expiringDateText}
                    />
            </View>

            <View style={styles.pointsBlock}>
    
                 <TypographyText
                      title={title}
                      size={20}
                      style={styles.title}
                      numberOfLines={2}
                    />
  

                   <View style={styles.valueBlock}>
                     <TypographyText
                      title={value}
                      style={styles.value}
                    />
                      <TypographyText
                      title={t('LoyaltyVouchers.points')}
                      size={13}
                      style={[styles.pointsBlockText,{marginLeft: 5,}]}
                    />
                    </View>
                 </View>

        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      borderRadius: 8,
      overflow: 'hidden'
    },
    backgroundImage: {
        width: '100%',
        height: 180,
    },
    expiringDateBlock: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'red',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderBottomLeftRadius: 8

    },
    expiringDateText: {
      fontWeight: '600'
    },
 pointsBlock: {
  flexDirection: 'row',
  alignItems: 'flex-end',
  position: 'absolute',
  left: 0,
  bottom: 0,
  width: '100%',
  backgroundColor: 'rgba(0,0,0,0.7)',
  paddingHorizontal: 16,
  paddingVertical: 8,
},
  pointsBlockText: {
      color: colors.mainDarkMode,
      fontWeight: '600',
      marginTop:2
  },
 title: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
  flex: 1,         
  marginRight: 10, 
},
valueBlock: {
  flexDirection: 'row',
  alignSelf: 'center',
  flexShrink: 0  
},
    value: {
        fontSize: 16,
        color: colors.mainDarkMode,
        fontWeight: '600'
    }
})

export default VoucherCard;