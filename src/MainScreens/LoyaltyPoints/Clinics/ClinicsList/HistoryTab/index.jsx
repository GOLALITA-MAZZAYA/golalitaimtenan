import {FlatList, StyleSheet} from "react-native";
import {useQuery} from "react-query";
import {getClinicsHistoryList} from "../../../../../api/clinics";
import ListNoData from "../../../../../components/ListNoData";
import FullScreenLoader from "../../../../../components/Loaders/FullScreenLoader";
import DoctorCard from "../../common/DoctorCard";
import {formatDate} from "../../helpers";
import { useCallback} from "react";
import {useFocusEffect, useNavigation} from "@react-navigation/native";


const HistoryTab = () => {
    const {isLoading,  isError, data, error, refetch } = useQuery(["clinics-history"], getClinicsHistoryList, {
     enabled: true
    });
    const navigation = useNavigation();

    useFocusEffect(
     useCallback(() => {
       refetch();
     }, [refetch])
    );

    console.log(data,'data');


    const renderItem = useCallback(({ item }) => {

      const onItemPress = (booking_reference) => {
          navigation.navigate('clinics-appointment-details',{ booking_reference})
      };

      return  <DoctorCard 
              style={styles.card}
              doctorName={item.doctor}
              clinicName={item.clinic}
              specialty={item.specialty}
              status={item.status}
              date={formatDate(item.date)}
              logo={item.doctor_photo}
              booking_reference={item.booking_reference}
              onPress={onItemPress}
            />
    },[]);

    return (
        <FlatList 
          data={data}
          renderItem={renderItem}
          ListEmptyComponent={!isLoading ? <ListNoData /> : <FullScreenLoader />}
          style={styles.list}
          contentContainerStyle={styles.contentContainerStyle}
        />
    )
};

const styles = StyleSheet.create({
   list: {
    marginTop: 20
   },
   contentContainerStyle: {
    paddingHorizontal: 20,
    flexGrow: 1,
    paddingBottom: 160
   },
   card: {
    marginBottom: 16
   }
});

export default HistoryTab