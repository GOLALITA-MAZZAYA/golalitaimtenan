import {StyleSheet, TouchableOpacity, View} from "react-native";
import {TypographyText} from "../../Typography";
import {BALOO_2} from "../../../redux/types";
import {colors} from "../../colors";
import {isRTL} from "../../../../utils";

const Counter = ({onIncrease, onDecrease, value = 1, label, style, minValue=1}) => {
    const isRtl = isRTL();

    const handleIncrease = () => {
        if(value > 30){
            return
        }

        onIncrease(value + 1)
    };

    const handleDecrease = () => {
        if(value === minValue || value < minValue + 1){
            return
        }

        onDecrease(value - 1)
    }

    return (
      <View style={[styles.wrapper,style]}>

        <TypographyText 
          font={BALOO_2}
          textColor={colors.loyaltyTextSecondary}
          title={label}
          style={styles.label}
        />

        <View style={[styles.block,{flexDirection: isRtl? 'row-reverse': 'row'}]}>

            <View style={[styles.valueBlock,{backgroundColor: colors.loyaltyCardBackground}]} >
                <TypographyText 
                  font={BALOO_2}
                  textColor={colors.loyaltyTextMainTitle}
                  title={value}

                />
            </View>

            <View style={styles.actionBtns}>
                <TouchableOpacity style={[styles.actionBtn,{backgroundColor: colors.loyaltyPrimary}]} onPress={handleIncrease}>
                    <TypographyText 
                       font={BALOO_2}
                       title="+"
                       textColor={colors.loyaltyBtnTextPrimary}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionBtn,{backgroundColor: colors.loyaltyCardBackground}]} onPress={handleDecrease}>
                    <TypographyText 
                      font={BALOO_2}
                      title="-"
                    />
                </TouchableOpacity>
            </View>

        </View>

      </View>
    )
};

const styles = StyleSheet.create({
    valueBlock: {
        width: 63,
        height: 63,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center'
    },
    block: {
      marginTop: 3,
    },
    actionBtn: {
        height: 26,
        width: 34,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionBtns: {
        justifyContent: 'space-between',
        marginHorizontal: 8,
    },
    label: {
        marginHorizontal: 10
    }
});

export default Counter;