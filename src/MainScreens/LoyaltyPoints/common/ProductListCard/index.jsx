import {Image, StyleSheet, TouchableOpacity, View} from "react-native"
import {TypographyText} from "../../../../components/Typography";
import {useTranslation} from "react-i18next";

const ProductListCard = ({onPress, uri, style, expiringDate, value}) => {
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
                      title={value}
                      size={20}
                      style={styles.pointsBlockText}
                    />
                      <TypographyText
                      title={t('LoyaltyOffers.points')}
                      size={13}
                      style={[styles.pointsBlockText,{marginLeft: 5, marginBottom: 3}]}
                    />
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
        position: 'absolute',
        left: 0,
        bottom: 0,
        borderTopRightRadius: 18,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 12,
        width: 140,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    pointsBlockText: {
        color: 'black',
        fontWeight: '600'
    }
})

export default ProductListCard;