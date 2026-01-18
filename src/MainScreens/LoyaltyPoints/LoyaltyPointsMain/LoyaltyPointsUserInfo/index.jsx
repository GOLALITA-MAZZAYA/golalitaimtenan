import {StyleSheet, TouchableOpacity, View} from "react-native"
import {TypographyText} from "../../../../components/Typography";
import {useSelector} from "react-redux";
import {userSelector} from "../../../../redux/auth/auth-selectors";
import {useTheme} from "../../../../components/ThemeProvider";
import {colors} from "../../../../components/colors";
import ScanSvg from '../../../../assets/scan.svg';
import {navigate} from "../../../../Navigation/RootNavigation";
import {useTranslation} from "react-i18next";
import useUserLoyaltyPoints from "../../../../hooks/useUserLoyaltyPoints";

const LoyaltyPointsUserInfo = () => {
    const user = useSelector(userSelector);
    const {isDark} = useTheme();
    const {t} = useTranslation();
    const {loading, points} = useUserLoyaltyPoints();

    const textColor = isDark ? colors.mainDarkMode : colors.darkBlue;

    const handleScanPress = () => {
        navigate('BillScanner', {
          title: t('Drawer.scanBill'),
        })
    }


    return (
        <View style={styles.wrapper}>
        <View style={styles.nameBlock}>
        <TypographyText
            title={user.name}
            textColor={textColor}
            size={16}                
          />

                    

        <TouchableOpacity style={styles.scanWrapper} onPress={handleScanPress}>
            <ScanSvg height={30} width={30} color={textColor}/>
        </TouchableOpacity> 
        </View>

        <View style={styles.pointsInfo}>

  

        <View style={styles.block}>
        <TypographyText
            title={points}
            textColor={textColor}
            size={22}    
            style={{fontWeight: '600'}}            
           />
        <TypographyText
            title={t('LoyaltyMain.availablePoints')}
            textColor={textColor}
            size={13}
            style={{marginLeft: 4, marginBottom: 2, fontWeight: '600'}}                
        />
        </View>

        {/* <View style={styles.block}>
           <TypographyText
            title={333}
            textColor={textColor}
            size={22}    
            style={{fontWeight: '600'}}            
           />
        <TypographyText
            title={t('LoyaltyMain.saved')}
            textColor={textColor}
            size={13}
            style={{marginLeft: 4, marginBottom: 2, fontWeight: '600'}}                
         />

  
        </View> */}



        </View>


        </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      paddingHorizontal: 20,
      paddingTop: 25,
      marginBottom: 25
    },
    pointsInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 25
    },
    scanWrapper: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    block: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 10
    },
    nameBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

export default LoyaltyPointsUserInfo;