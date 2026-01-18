import {Image, ScrollView, StyleSheet, View} from "react-native";
import Header from "../../../components/Header"
import MainLayout from "../../../components/MainLayout"
import {useTheme} from "../../../components/ThemeProvider";
import {TypographyText} from "../../../components/Typography";
import {useTranslation} from "react-i18next";
import {colors} from "../../../components/colors";
import CommonButton from "../../../components/CommonButton/CommonButton";

const ARHowToUse = ({navigation}) => {
    const {isDark} = useTheme();
    const {t} = useTranslation();

    const handleStartPress = () => {
       navigation.navigate('ARMerchants')
    }


    const textColor = isDark ? colors.white : colors.mainDarkModeText;
    const btnTextColor = isDark ? colors.mainDarkModeText: colors.white;

    return (
          <MainLayout
        outsideScroll={true}
        headerChildren={
          <Header label={t('Drawer.offersAroundYou')} btns={['back']} />
        }
        headerHeight={50}
        contentStyle={styles.contentStyle}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={require('../../../assets/360info.png')} style={styles.image} resizeMode="cover" />

        <View style={styles.textWrapper}>
        <View style={styles.textWrapper}>
        <TypographyText
           title={t('ar.title')}
           textColor={textColor}
           size={32}
           style={styles.text}
          />
        <TypographyText
           title={t('ar.infoDescription')}
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
    paddingBottom: 190
   },
   image: {
    width: '100%',
    height: 200,
    marginBottom: 40
   },
   textWrapper: {
    flex: 1
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
   }
});

export default ARHowToUse;