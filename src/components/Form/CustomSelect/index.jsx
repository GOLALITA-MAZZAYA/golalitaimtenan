import {ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View} from "react-native";
import {TypographyText} from "../../Typography";
import {isRTL} from "../../../../utils";
import {colors} from "../../colors";
import ArrowSvg from '../../../assets/loyaltyPoints/rightArrow';
import {BALOO_2} from "../../../redux/types";
import {useState} from "react";

// `listItem` style is a fixed height: 58, no gap between rows.
const ITEM_HEIGHT = 58;

const getItemLayout = (data, index) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

const CustomSelect = ({onSelect, value, options, placeholder, label, style, loading}) => {
    const isRtl = isRTL();
    const [isOpened, setIsOpened] = useState(false);

    const handleSelectPress = () => {
        setIsOpened(prev => !prev);
    };

    const handleItemSelect = (item) => {
        onSelect(value === item.value ? null : item.value);
        setIsOpened(false)
    }
    const valueObj = options.find(item => item.value === value);
    const valueStr = isRtl ? valueObj?.label_arabic: valueObj?.label || '';

    return (
        <View style={style}>
                   <TypographyText
                      font={BALOO_2}
                      textColor={colors.loyaltyTextSecondary}
                      title={label}
                      style={styles.label}
                    />

        <TouchableOpacity onPress={handleSelectPress}  style={[styles.select,{flexDirection: isRtl ? 'row-reverse': 'row', backgroundColor: colors.loyaltyCardBackground, borderColor: colors.loyaltyMainBorder}]}>
            <TypographyText 
               title={value ? `${valueStr}`: placeholder}
               style={styles.placeholder}
               font={BALOO_2}
               size={16}
               textColor={colors.loyaltyTextMainTitle}
            />

            <View style={[
                styles.arrow,
                {
                 transform: [
                   { rotate: isOpened ? "270deg": '90deg' },
                 ]
                }

            ]}>
              {loading ? <ActivityIndicator color={colors.mainText}/> : <ArrowSvg color={colors.loyaltyPrimary}/>}
            </View>
        </TouchableOpacity>
        {isOpened && <View style={{backgroundColor:colors.loyaltySelectBackground, borderRadius: 23}}>
            <FlatList
               data={options}
               keyExtractor={(item, index) => String(item.value ?? index)}
               getItemLayout={getItemLayout}
               renderItem={({item}) => {

                const isSelected = item.value === value;

                return (
                    <TouchableOpacity 
                      style={[styles.listItem,{backgroundColor: isSelected ? colors.loyaltyPrimary: colors.loyaltySelectBackground}]}
                      onPress={() => handleItemSelect(item)}
                     >
                        <TypographyText 
                          title={isRtl ? item.label_arabic: item.label}
                          style={styles.value}
                          font={BALOO_2}
                          size={16}
                          textColor={isSelected ? colors.loyaltyActiveTabText: colors.loyaltyTextMainTitle}
                        />

                    </TouchableOpacity>
                )
               }}
            />
        </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    select: {
        height: 58,
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 23
    },
    placeholder: {
      paddingHorizontal: 20,
      flex: 1
    },
    arrow: {
      paddingHorizontal: 20
    },
    listItem: {
        height: 58,
        borderRadius: 23,
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    value: {

    },
    label: {
        marginHorizontal: 10
    }
});

export default CustomSelect;