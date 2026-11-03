import {useMemo} from "react";
import {FlatList, StyleSheet, TouchableOpacity} from "react-native";
import {colors} from "../../colors";
import {TypographyText} from "../../Typography";
import {BALOO_2} from "../../../redux/types";

const Years = ({currentMonth, setCurrentMonth, setMode, setYear}) => {

    const years = useMemo(() => {
        const currentYear = currentMonth.getFullYear();

        return Array.from({ length: 12 }, (_, i) => currentYear - 6 + i)
    }, [currentMonth])


    return (
        <FlatList
              data={years}
              numColumns={3}
              keyExtractor={item => item.toString()}
              style={{width: 333, height: 400, marginTop: 30}}
              renderItem={({ item }) => {
                const isSelected = item === currentMonth.getFullYear();
                const currentYear = new Date().getFullYear();
                const isPastYear = item < currentYear;
                
        
                return (
                  <TouchableOpacity
                    disabled={isPastYear}
                    style={[
                      styles.pickerCell,
                      isSelected && {backgroundColor: colors.loyaltyPrimary},
                      isPastYear && { opacity: 0.3 }
                    ]}
                    onPress={() => {
                      setCurrentMonth(setYear(currentMonth, item))
                      setMode('calendar')
                    }}
                  >
                    <TypographyText 
                      font={BALOO_2}
                      title={item}
                      textColor={isSelected ? 'white': colors.loyaltyTextMainTitle}
                    />

                  </TouchableOpacity>
                )
       }}
      />
    )
};

const styles = StyleSheet.create({
  selectedDay: {
    backgroundColor: colors.loyaltyPrimary,
  },
  selectedText: {
    color: '#000',
    fontWeight: '600',
  },

  pickerCell: {
    flex: 1,
    margin: 8,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
});

export default Years;