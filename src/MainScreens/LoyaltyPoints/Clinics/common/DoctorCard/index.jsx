import {StyleSheet, TouchableOpacity, View} from "react-native";
import Image from "../../../../../components/AppImage";
import {colors} from "../../../../../components/colors";
import {isRTL} from "../../../../../../utils";
import {TypographyText} from "../../../../../components/Typography";
import {BALOO_2} from "../../../../../redux/types";
import Tag from "../Tag";
import DoctorSvg from '../../../../../assets/clinics/doctor.svg';
import {formatDate, getStatusColor, getStatusTranslation} from "../../helpers";

const DoctorCard = ({item, onPress, style}) => {
    const {doctor, clinic, specialty,status, date, doctor_photo, booking_reference, tags} = item;
    const isRtl = isRTL();

    return (
        <TouchableOpacity onPress={() => onPress(booking_reference)}  style={[styles.wrapper,{backgroundColor: colors.cardBackground, borderColor: colors.mainBorder, flexDirection: isRtl ? 'row-reverse': 'row'}, style]}>
         
         <Image source={{uri: doctor_photo}} style={[styles.logo,{borderColor: colors.mainBorder}]}/>
            
          <View style={[styles.descriptionBlock,{alignItems: isRtl? 'flex-end': 'flex-start'}]}>

            <TypographyText 
              font={BALOO_2}
              title={doctor}
              textColor={colors.mainText}
              size={16}
            />

            {!!specialty && <TypographyText 
              font={BALOO_2}
              title={specialty}
              textColor={colors.textPrimary}
              size={12}
              style={styles.specialtyText}
            />}

            {clinic && <Tag text={clinic} style={styles.tag} icon={<DoctorSvg height={12} width={12} color={colors.mainText}/>}/>}

            {!clinic && !!tags?.length && <Tag text={tags} style={styles.tag}/>}

          </View>

          {!!status && <View style={[styles.statusBlock,{alignItems: isRtl ? 'flex-start': 'flex-end'}]}>

            <TypographyText 
              font={BALOO_2}
              title={getStatusTranslation(status)}
              textColor={getStatusColor(status)}
              size={12}
              weight="500"
            />

            <TypographyText 
              font={BALOO_2}
              title={formatDate(date)}
              textColor={colors.textSecondary}
              size={12}
              style={styles.dateText}
            />

          </View>}
        </TouchableOpacity>
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
    alignItems: 'flex-start',
    justifyContent: 'space-around',
   },
   specialtyText: {
    // marginTop: 5
   },
   tag: {
     marginTop: 5
   },
   dateText: {
    marginTop: 8
   },
   statusBlock: {
    
   }
});

export default DoctorCard