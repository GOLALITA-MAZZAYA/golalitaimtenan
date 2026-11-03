import { FlatList } from "react-native";
import { StyleSheet } from "react-native";
import FullScreenLoader from "../../../../../components/Loaders/FullScreenLoader";
import ListNoData from "../../../../../components/ListNoData";
import useDoctors from "../../hooks/useDoctors";
import DoctorCard from "./DoctorCard";
import {useNavigation} from "@react-navigation/native";
import {isRTL} from "../../../../../../utils";

const DoctorsTab = ({clinicId}) => {
    
    const {data, loading} = useDoctors(clinicId);
    const navigation = useNavigation();
    const isRtl = isRTL();


    const handleBookPress = (doctor) => {

      navigation.navigate('clinics-appointment',{doctor, clinicId})
    }

    return  (
    <FlatList 
        style={styles.flatList}
        contentContainerStyle={styles.contentContainerStyle}
        data={loading ? [] : data}
        showsVerticalScrollIndicator={false}
        bounces={false}
        renderItem={({item}) => (
          <DoctorCard 
             style={styles.card}
             doctorName={isRtl ? item.name_ar: item.name}
             experiance={item.experience_years}
             specialty={isRtl ? item.specialty_ar: item.specialty}
             status={item.status}
             logo={item.photo}
             onBookPress={() => handleBookPress(item)}
           />
        )
        }
        ListEmptyComponent={() => {
          if(loading){
            return  <FullScreenLoader style={styles.loader} />
          }
         
          return  <ListNoData />

        }}
      />
    )
};

const styles = StyleSheet.create({
  loader: {
    marginTop: 30,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  noData: {
    flexDirection: "row",
    marginTop: 30,
  },
  flatList: {
    marginTop: 20
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
  card: {
    marginBottom: 16
  }
});

export default DoctorsTab;
