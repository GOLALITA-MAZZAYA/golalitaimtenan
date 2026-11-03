import {StyleSheet, TouchableOpacity, View} from "react-native";
import Image from "../../../../../../components/AppImage";
import {colors} from "../../../../../../components/colors";
import {isRTL} from "../../../../../../../utils";
import {TypographyText} from "../../../../../../components/Typography";
import {BALOO_2} from "../../../../../../redux/types";
import Tag from "../../../common/Tag";
import i18next from "i18next";
import { getOnlineStatusColor, getStatusColor, getStatusTranslation, isActive,} from "../../../helpers";
import DoctorSvg from '../../../../../../assets/clinics/doctor.svg';


const DoctorCard
 = ({logo, doctorName, specialty, experiance, status,  onBookPress, style}) => {
    const isRtl = isRTL();

    return (
        <View style={[styles.wrapper,{backgroundColor: colors.cardBackground, borderColor: colors.mainBorder, flexDirection: isRtl ? 'row-reverse': 'row'}, style]}>
         
         <Image source={{uri: logo}} style={[styles.logo,{borderColor: colors.mainBorder}]}/>
            
          <View style={[styles.descriptionBlock,{alignItems: isRtl? 'flex-end': 'flex-start'}]}>

            <TypographyText 
              font={BALOO_2}
              title={doctorName}
              textColor={colors.mainText}
              size={16}
            />

            <TypographyText 
              font={BALOO_2}
              title={specialty}
              textColor={colors.textPrimary}
              size={12}
              style={styles.specialtyText}
            />

            <Tag text={[`${experiance} ${i18next.t('Clinics.yearsExpiriance')}`]} style={{...styles.tag,color: colors.primary}} icon={<DoctorSvg height={13} width={13} color={colors.primary}/>}/>

          </View>

          <View style={styles.statusBlock}>

           <View style={[styles.status,{flexDirection: isRtl ? 'row-reverse': 'row', borderColor: colors.statusCardBorder, backgroundColor: colors.statusCardBackground}]}>

            <View style={[styles.dot,{backgroundColor: getOnlineStatusColor(status), marginRight: isRtl? 0: 5, marginLeft: isRtl? 5: 0}]} />

            <TypographyText 
              font={BALOO_2}
              title={getStatusTranslation(status)}
              textColor={getStatusColor(status)}
              size={12}
              weight="500"
            />
            </View>

          <TouchableOpacity disabled={!isActive(status)} style={[styles.bookBtn,{backgroundColor: isActive(status) ?  colors.primary: colors.offline}]} onPress={onBookPress}>
            <TypographyText 
              font={BALOO_2}
              title={i18next.t('Clinics.book')}
              textColor={isActive(status) ? colors.textForPrimaryBlock : colors.mainText}
              size={15}
              style={styles.bookText}
            />
           </TouchableOpacity>
          </View>
        </View>
    )
};

const styles = StyleSheet.create({
   wrapper: {
     height: 101,
     width: '100%',
     borderWidth: 1,
     borderRadius: 34,
     padding: 16
   },
   logo: {
     width: 59,
     height: 59,
     borderRadius: 14,
     borderWidth: 1
   },
   descriptionBlock: {
    marginHorizontal: 8,
    flex: 1,
    alignItems: 'flex-start'
   },
   specialtyText: {
    marginTop: 5
   },
   tag: {
    marginTop: 5
   },
   status: {
     paddingVertical: 3,
     paddingHorizontal: 6,
     borderWidth: 1,
     alignItems: 'center',
     borderRadius: 16
   },
   dot: {
     width: 5,
     height: 5,
     borderRadius: 2.5
   },
   bookBtn: {
    height: 29,
    paddingHorizontal: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
   },
   bookText: {
    fontWeight: '500'
   }
});

export default DoctorCard
