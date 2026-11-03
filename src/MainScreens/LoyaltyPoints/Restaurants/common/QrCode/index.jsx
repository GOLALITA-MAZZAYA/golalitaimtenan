import {StyleSheet, View} from "react-native"
import Image from "../../../../../components/AppImage";
import {colors} from "../../../../../components/colors";

const QrCode = ({uri, style}) => {
    return (
        <View style={[styles.wrapper, style, {backgroundColor: colors.cardBackground}]}>
            <Image source={{uri}} style={styles.logo}/>
        </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 8
    }
});

export default QrCode;