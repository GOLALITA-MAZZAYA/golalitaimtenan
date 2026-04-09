import {FlatList, StyleSheet, TouchableOpacity, View} from "react-native";
import {TypographyText} from "../../Typography";
import {colors} from "../../colors";
import {BALOO_2} from "../../../redux/types";

const CustomSelectTabs = ({onSelect, value, options, label, style}) => {
    const handleItemSelect = (item) => {
        onSelect(value === item.value ? null : item.value)
    }

    return (
        <View style={style}>

        {label && <TypographyText 
            title={label}
            style={styles.label}
            font={BALOO_2}
            size={16}
            textColor={colors.loyaltySecondary}
        />}

        <FlatList 
          data={options}
          bounces={false}
          columnWrapperStyle={{
            justifyContent: 'space-between', 
            marginBottom: 4,                 
          }}
          ItemSeparatorComponent={() => <View style={{ height: 4 }} />}

          renderItem={({item}) => {

            const isSelected = item.value === value;

            return (
                <TouchableOpacity style={[styles.tab,{backgroundColor: isSelected ? colors.loyaltyPrimary: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder}]} onPress={() => handleItemSelect(item)}>
                   <TypographyText 
                     title={item.label}
                     style={styles.text}
                     font={BALOO_2}
                     size={16}
                     textColor={isSelected ? colors.loyaltyActiveTabText: colors.loyaltyTextMainTitle}
                 />
                </TouchableOpacity>
            )
          }}
          numColumns={2}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    tab: {
        height: 60,
        width: '49%',
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontWeight: '700'
    },
    label: {
        marginBottom: 10
    }

});

export default CustomSelectTabs;