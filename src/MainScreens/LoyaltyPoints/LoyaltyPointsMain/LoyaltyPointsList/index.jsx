
import {getQuickActionsData} from "./config";
import {FlatList, StyleSheet, View} from "react-native";
import ListCard from "../../common/ListCard";
import {colors} from "../../../../components/colors";
import {TypographyText} from "../../../../components/Typography";
import {useTranslation} from "react-i18next";
import {useTheme} from "../../../../components/ThemeProvider";

const LoyaltyPointsList = () => {
    const {t} = useTranslation();
    const {isDark} = useTheme();

    const data = getQuickActionsData(isDark);

    return (
      
       <View style={styles.wrapper}>
        <TypographyText
            title={t('LoyaltyMain.quickActions')}
            textColor={colors.loyaltyTextMain}
            size={18}
            style={styles.title}
         />
        <FlatList 
          data={data}
          renderItem={({item}) => <ListCard {...item} style={styles.card} isDark={isDark}/>}
        
        />
       </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      marginHorizontal: 20
    },
    title: {
      marginBottom: 10
    },
    card: {
        marginBottom: 12
    }
});


export default LoyaltyPointsList;