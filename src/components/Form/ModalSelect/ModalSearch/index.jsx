import {StyleSheet, TextInput, View} from "react-native";
import SearchSvg from '../../../../assets/search-new.svg';
import {colors} from "../../../colors";
import {BALOO_2} from "../../../../redux/types";
import {isRTL} from "../../../../../utils";

const ModalSearch = ({onChangeText, placeholder}) => {
    const isRtl = isRTL();

    return (
       
        <View style={[styles.wrapper,{backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder, flexDirection: isRtl? 'row-reverse': 'row'}]}>

            <View style={[styles.searchIcon, {left: isRtl ? undefined: 15, right:  isRtl? 15: undefined}]}>
                <SearchSvg color={colors.loyaltyTextInputText}/>
            </View>
           
           <TextInput style={[styles.input,{color: colors.loyaltyTextInputText, paddingLeft: isRtl? 20: 52, paddingRight: isRtl ? 52:20, textAlign: isRtl ? 'right': 'left' }]}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.loyaltyTextInputText}
           />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
      height: 48,
      borderRadius: 20,
      marginHorizontal: 20,
      marginBottom: 22
    },
    searchIcon: {
       position: 'absolute',
       left: 20,
       top: 15
    },
    input: {
        paddingLeft: 52,
        flex: 1,
        fontSize: 16,
        fontFamily: BALOO_2,
        paddingRight: 20
    }
});

export default ModalSearch;