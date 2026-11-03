import {FlatList, StyleSheet, TouchableOpacity, View} from "react-native";
import WeekDays from "../WeekDays";
import {TypographyText} from "../../Typography";
import {BALOO_2} from "../../../redux/types";
import {useMemo} from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfDay,
  isBefore,
} from 'date-fns'
import {colors} from "../../colors";

const MUTED = '#777'

const Days = ({currentMonth, selectedDate, setSelectedDate, cellSize=48, width=333}) => {

      const days = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth))
        const end = endOfWeek(endOfMonth(currentMonth))
        return eachDayOfInterval({ start, end })
      }, [currentMonth])

    return (
     <>
      <WeekDays />


      <FlatList
        data={days}
        numColumns={7}
        keyExtractor={item => item.toISOString()}
        scrollEnabled={false}
        style={{width}}
        renderItem={({ item }) => {
          const isSelected = isSameDay(item, selectedDate)
          const isCurrentMonth = isSameMonth(item, currentMonth);
          const today = startOfDay(new Date())
          const isPast = isBefore(item, today)

          return (
            <TouchableOpacity
              style={[
                styles.dayCell,
                {height: cellSize, width: cellSize},
                isPast && { opacity: 0.3 }
              ]}
              disabled={!isCurrentMonth || isPast}
              onPress={() => setSelectedDate(item)}
            >
                <View style={isSelected && {backgroundColor: colors.loyaltyPrimary, ...styles.selectedText}}>
                <TypographyText 
                  font={BALOO_2}
                  title={format(item, 'd')}
                  style={[
                    !isCurrentMonth && { color: MUTED },
                    {color: isSelected ? 'white': colors.loyaltyTextMainTitle},
                  ]}
                  size={12}
                
                />
                </View>
            </TouchableOpacity>
          )
        }}
      />
    </>
    )
};

const styles = StyleSheet.create({
  dayCell: {
    width: 48,
    height: 48,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  selectedText: {
    color: '#000',
    fontWeight: '600',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Days;