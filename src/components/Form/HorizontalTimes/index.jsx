import {FlatList, StyleSheet, TouchableOpacity, View} from "react-native";
import {TypographyText} from "../../../components/Typography";
import {BALOO_2} from "../../../redux/types";
import {colors} from "../../../components/colors";
import {isRTL} from "../../../../utils";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import ListNoData from "../../../components/ListNoData";

const HorizontalTimes = ({selectedTime, setTime, times, loading,label}) => {
    const isRtl = isRTL();

    return (
        <View style={styles.wrapper}>
           {!!label && <TypographyText 
              font={BALOO_2}
              textColor={colors.loyaltyTextSecondary}
              title={label}
              style={styles.label}
           />}
       <FlatList
         contentContainerStyle={styles.contentContainerStyle}
         data={loading ? []: times}
         horizontal
         ListEmptyComponent={
          loading ?  <FullScreenLoader />: <ListNoData />
         }
         keyExtractor={(item) => `${item}`}
         renderItem={({item}) => {
             const isSelected = item === selectedTime;

            return (
            <TouchableOpacity onPress={() => setTime(item)} style={[styles.block,{backgroundColor: isSelected ? colors.primary: colors.cardBackground, marginLeft: isRtl ? 5: 0, marginRight: isRtl ? 0: 5}]}>
              <TypographyText 
                font={BALOO_2}
                size={10}
                title={item}
                textColor={isSelected ? colors.textForPrimaryBlock: colors.mainText}
                style={{fontWeight: '600'}}
              />
           </TouchableOpacity>
         )}}
        />
        </View>

    )
};

const styles = StyleSheet.create({
   wrapper: {
     flex: 1
   },
   block: {
    height: 38,
    width: 126,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
   },
   contentContainerStyle: {
     height: 38,
     flexGrow: 1. 
   },
   label: {
    marginHorizontal: 10
   }
});

export default HorizontalTimes