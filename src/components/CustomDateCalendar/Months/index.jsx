import {FlatList, StyleSheet, TouchableOpacity} from "react-native";
import {colors} from "../../colors";
import {TypographyText} from "../../Typography";
import {BALOO_2} from "../../../redux/types";
import {
  isSameYear,
  setMonth,
} from 'date-fns'
import {isRTL} from "../../../../utils";

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل',
  'مايو', 'يونيو', 'يوليو', 'أغسطس',
  'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];



const Months = ({currentMonth, setCurrentMonth, setMode}) => {
    const isRtl = isRTL();

    const data = isRtl ?  MONTHS_AR: MONTHS;

    return (
     <FlatList
      data={data}
      numColumns={3}
      keyExtractor={item => item}
      style={{width: 333, height: 400, marginTop: 30}}
      renderItem={({ item, index }) => {
        const isSelected =
          index === currentMonth.getMonth();
        const today = new Date()

        const isPastMonth = currentMonth.getFullYear() < today.getFullYear() || (isSameYear(currentMonth, today) && index < today.getMonth())

        return (
          <TouchableOpacity
            style={[
              styles.pickerCell,
              isSelected && {backgroundColor: colors.loyaltyPrimary},
              isPastMonth && {opacity: 0.3}
            ]}
            disabled={isPastMonth}
            onPress={() => {
              if (!isPastMonth) {
                setCurrentMonth(setMonth(currentMonth, index))
                setMode('calendar')
              }
            }}
          >
             <TypographyText 
                font={BALOO_2}
                title={item}
                style={{color: isSelected ? 'white': colors.loyaltyTextMainTitle}}
             />
          </TouchableOpacity>
        )
      }}
     />
    )
};

const styles = StyleSheet.create({
  pickerCell: {
    flex: 1,
    margin: 8,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
});

export default Months;