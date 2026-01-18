import {Image, ScrollView, StyleSheet, View} from "react-native";
import Header from "../../components/Header"
import MainLayout from "../../components/MainLayout"
import {useTheme} from "../../components/ThemeProvider";
import {TypographyText} from "../../components/Typography";
import {useTranslation} from "react-i18next";
import {colors} from "../../components/colors";
import CommonButton from "../../components/CommonButton/CommonButton";

const BillScannerHowToUse = ({navigation}) => {
    const {isDark} = useTheme();
    const {t} = useTranslation();

    const handleStartPress = () => {
       navigation.navigate('BillScanner')
    }


    const textColor = isDark ? colors.white : colors.mainDarkModeText;
    const btnTextColor = isDark ? colors.mainDarkModeText: colors.white;

    return (
          <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={t("Drawer.scanBill")} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={styles.contentContainerStyle}>

        <View>
        <View style={styles.textWrapper}>
        <TypographyText
           title={t('BillScannerInfo.title')}
           textColor={textColor}
           size={32}
           style={styles.text}
          />
        <TypographyText
           title={t('BillScannerInfo.description')}
           textColor={textColor}
           size={22}
           style={styles.description}
          />
        </View>

         <CommonButton
           onPress={handleStartPress}
           label={t('ar.start')}
           style={styles.startBtn}
           textColor={btnTextColor}
           />
        </View>  
      </ScrollView>       
      </MainLayout>
    )
};

const styles = StyleSheet.create({
   contentStyle: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 20,
    paddingBottom: 190,
   },
   image: {
    width: '100%',
    height: 200,
    marginBottom: 40
   },
   textWrapper: {
  
   },
   text: {
     paddingHorizontal: 20
   },
   description: {
     paddingHorizontal: 20,
     marginTop: 10
   },
   startBtn: {
    width: 200,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 35
   },
   contentContainerStyle: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center'
   },
});

export default BillScannerHowToUse;