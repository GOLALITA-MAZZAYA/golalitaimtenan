import {StyleSheet, TouchableOpacity, View} from "react-native"
import {TypographyText} from "../../../Typography";
import {BALOO_2} from "../../../../redux/types";
import {colors} from "../../../colors";
import {useTranslation} from "react-i18next";
import {isRTL} from "../../../../../utils";

const SubmitBtn = ({onSubmit, onClear, title}) => {
    const {t} = useTranslation();
    const isRtl = isRTL();

    return (
        <View style={[styles.wrapper, {flexDirection: isRtl ? 'row-reverse' : 'row'}]}>
            {!!onClear && (
                <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
                    <TypographyText
                       title={t('General.clearFilter')}
                       font={BALOO_2}
                       textColor={colors.loyaltyTextMainTitle}
                       style={styles.clearText}
                    />
                </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onSubmit} style={[styles.submitBtn,{backgroundColor: colors.loyaltyPrimary}]}>
                <TypographyText
                   title={title}
                   font={BALOO_2}
                   textColor={colors.loyaltyBtnTextPrimary}
                   style={styles.text}
                />
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      marginHorizontal: 20,
      marginBottom: 30,
      marginTop: 30,
    },
    clearBtn: {
      height: 50,
      paddingHorizontal: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    clearText: {
      fontSize: 16,
      fontWeight: '500',
      textDecorationLine: 'underline',
    },
    submitBtn: {
      flex: 1,
      height: 50,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
     fontSize: 16,
     fontWeight: '500',
    }
});

export default SubmitBtn;
