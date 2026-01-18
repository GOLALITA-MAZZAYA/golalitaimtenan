import {Image, StyleSheet, TouchableOpacity, View} from "react-native"
import {TypographyText} from "../../../../components/Typography";

const InfoCard = ({onPress, title, description, source, style}) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.wrapper, style]}>
            <Image source={source} style={styles.logo} resizeMode="cover"/>

            <View style={styles.descriptionBlock}>

                              <TypographyText
                                title={title}
                                style={styles.title}
                        
                              />


                                            <TypographyText
                                              title={description}
                                              style={styles.description}
                              
                                    
                                            />

            </View>

        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    wrapper: {
       position: 'relative',
       height: 200,
       width: '100%',
       borderRadius: 20,
       overflow: 'hidden',
    },
    logo: {
        height: 100,
        width: '100%'
    },
    descriptionBlock: {
        height: 110,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        left: 0,
        bottom: 0,
        backgroundColor: 'white',
        padding: 10
    },
    title: { 
      fontSize: 20,
      fontWeight: '600',
      color: 'black'

    },
    description: {
       color: 'black',
       marginTop: 10
    }
});

export default InfoCard;