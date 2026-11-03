import {StyleSheet, View} from "react-native"
import {colors} from "../../../../../../components/colors";
import {isRTL} from "../../../../../../../utils";
import {BALOO_2} from "../../../../../../redux/types";
import {TypographyText} from "../../../../../../components/Typography";
import {useTranslation} from "react-i18next";

const WorkingHours = ({icon, title,  style, weekdays, weekends}) => {
    const isRtl = isRTL();
    const {t} = useTranslation();

    return (
        <View 
         style={[styles.wrapper,{backgroundColor: colors.loyaltyCardBackground, borderColor: colors.mainBorder}, style]}>
            <View style={[styles.header,{flexDirection: isRtl? 'row-reverse': 'row',}]}>
                {icon}

                <TypographyText
                   title={title}
                   font={BALOO_2}
                   size={16}
                   textColor={colors.loyaltyPrimary}
                   style={[styles.title,{marginLeft: isRtl ? 0 : icon ? 6: 0, marginRight: isRtl ?icon ?  6: 0 : 0}]}
                />
            </View>

            <View style={styles.description}>
                <View style={[styles.row,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>
                <TypographyText 
                   title={t('Clinics.weekdays')}
                   font={BALOO_2}
                   size={15}
                   textColor={colors.loyaltyTextSecondary}
                   style={styles.description}
                />

               <TypographyText 
                   title={weekdays}
                   font={BALOO_2}
                   size={15}
                   textColor={colors.mainText}
                   style={styles.description}
                />

                </View>

                                <View style={[styles.row,{flexDirection: isRtl ? 'row-reverse': 'row'}]}>
                <TypographyText 
                   title={t('Clinics.weekends')}
                   font={BALOO_2}
                   size={15}
                   textColor={colors.loyaltyTextSecondary}
                   style={styles.description}
                />

               <TypographyText 
                   title={weekends}
                   font={BALOO_2}
                   size={15}
                   textColor={colors.mainText}
                   style={styles.description}
                />

                </View>

            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      padding: 20,
      borderRadius: 40,
      borderWidth: 1
    },
    header: {
     alignItems: 'center'
    },
    arrowBlock: {
      alignSelf: 'center',
      transform: [
        { rotate: "90deg"},
      ],
      marginTop: 10
    },
    title: {
      fontWeight: '500'
    },
    description: {
      marginTop: 12
    },
    row: {
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});

export default WorkingHours;


