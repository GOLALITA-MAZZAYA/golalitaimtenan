import {StyleSheet, View} from "react-native"
import {TypographyText} from "../../../../components/Typography";
import {useSelector} from "react-redux";
import {userSelector} from "../../../../redux/auth/auth-selectors";
import {colors} from "../../../../components/colors";
import {navigate} from "../../../../Navigation/RootNavigation";
import {useTranslation} from "react-i18next";
import useUserLoyaltyPoints from "../../../../hooks/useUserLoyaltyPoints";
import ButtonWithImage from "../../common/ButtonWithIcon";
import ScanSvg from '../../../../assets/loyaltyPoints/home/scan.svg';
import ScanSvgLight from '../../../../assets/loyaltyPoints/home/scan-light.svg';
import PlayLight from '../../../../assets/loyaltyPoints/home/play-light.svg';
import PlaySvg from '../../../../assets/loyaltyPoints/home/play.svg';
import {isRTL} from "../../../../../utils";
import {useTheme} from "../../../../components/ThemeProvider";

const LoyaltyPointsUserInfo = () => {
    const user = useSelector(userSelector);
    const {t} = useTranslation();
    const {loading, points} = useUserLoyaltyPoints();
    const {isDark} = useTheme();


    const handleScanPress = () => {
        navigate('BillScanner', {
          title: t('Drawer.scanBill'),
        })
    };

    const handleInfoPress = () => {
        navigate('loyaltyPoints-info')
    }


    return (
        <View style={styles.wrapper}>

         <TypographyText
            title={`${t('LoyaltyMain.hi')} ${user.name}`}
            textColor={colors.loyaltyTextMain}
            size={17}                
          />


        <View style={[
            styles.pointsInfo,
            {
            borderColor: colors.loyaltyCardBackground,
            borderColor: colors.loyaltyMainBorder,
            backgroundColor: colors.loyaltyCardBackground,
            }
        ]}>

        <View style={[
            styles.pointsWrapper,
            {
              flexDirection: isRTL() ? 'row-reverse': 'row',
              borderColor: colors.loyaltyPrimary,
            }]}>

        <View style={styles.block}>

        <TypographyText
            title={points}
            textColor={colors.loyaltyTextPrimary}
            size={30}    
            style={{fontWeight: '600'}}            
        />
        <TypographyText
            title={t('LoyaltyMain.availablePoints')}
            textColor={colors.loyaltyTextSecondary}
            size={14}              
        />
        </View>

         <View style={styles.redeemedBlock}>
           <TypographyText
            title={333}
            textColor={colors.loyaltyTextSecondary}
            size={20}    
            style={{fontWeight: '600'}}            
           />
        <TypographyText
            title={t('LoyaltyMain.redeemed')}
            textColor={colors.loyaltyTextSecondary}
            size={14}               
         />
        </View> 

        </View>

        <View style={[styles.controllBtns,{flexDirection: isRTL() ? 'row-reverse': 'row'}]}>

            <ButtonWithImage 
              text={t('LoyaltyMain.scan')}
              icon={isDark ? <ScanSvg /> : <ScanSvgLight />}
              primary
              style={{
                marginRight: isRTL() ? 0 : 6,
                marginLeft: isRTL() ? 6 : 0
              }}
              onPress={handleScanPress}
            
            />

            <ButtonWithImage 
              text={t('LoyaltyMain.howItWorks')}
              icon={isDark ? <PlaySvg/> : <PlayLight />}
              style={{
                marginRight: isRTL() ? 6 : 0,
                marginLeft: isRTL() ? 0 : 6
              }}
              onPress={handleInfoPress}
            
            />

        </View>

        </View>


        </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      paddingTop: 25,
      marginBottom: 25,
      marginHorizontal: 20
    },
    pointsInfo: {
        borderWidth: 1,
        padding: 18,
        borderRadius: 40,
        marginTop: 15
    },
    pointsWrapper: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'flex-end',
       borderBottomWidth: 1,
       paddingBottom: 8
    },
    scanWrapper: {
       
    },
    block: {
        
    },
    redeemedBlock: {
      justifyContent: 'center',
      alignItems: 'center',

    },
    nameBlock: {
       flexDirection: 'row',
       justifyContent: 'space-between'
    },
    controllBtns: {
      flexDirection: 'row',
      marginTop: 12
    }
})

export default LoyaltyPointsUserInfo;