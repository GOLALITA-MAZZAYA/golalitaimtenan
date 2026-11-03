import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native'
import {
  setYear,
} from 'date-fns'
import Years from './Years'
import Months from './Months'
import Days from './Days'
import Modes from './Modes'
import {TypographyText} from '../Typography'
import {colors} from '../colors'
import {useTranslation} from 'react-i18next'
import {SCREEN_WIDTH} from '../../styles/mainStyles'
import {BALOO_2} from '../../redux/types'

export default function CustomCalendar({
  initialDate = new Date(),
  onApply,
  isVisible = false,
  isModal = true,
  modes = true,
  setIsVisible,
  onChange,
  label
}) {
  const [currentMonth, setCurrentMonth] = useState(initialDate)
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [mode, setMode] = useState('calendar') // calendar | month | year
  const {t} = useTranslation();

  const handleApply = (data) => {
     onApply(data);

     setIsVisible(false)
  };



  const handleChange = (date) => {
    console.log(date,'date on chagne')
    setSelectedDate(date);

    onChange(date)
  }


  if(!isModal) {
    return (
             <View>
              <TypographyText 
                  title={label}
                  textColor={colors.loyaltyTextSecondary}
                  font={BALOO_2}
                  style={styles.label}
              />
             <View style={[styles.block,{backgroundColor: colors.cardBackground}]}>
                      {modes && <View style={styles.header}>
                        <Modes currentMonth={currentMonth} setMode={setMode}/>
                     </View>}
      

                     {mode === 'calendar' && <Days currentMonth={currentMonth} selectedDate={selectedDate} setSelectedDate={handleChange} cellSize={SCREEN_WIDTH * 0.12} />  } 
                     {mode === 'month' && modes && <Months currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} setMode={setMode} />}
                     {mode === 'year' && modes && <Years currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} setMode={setMode} setYear={setYear}/>}
               </View>
               </View>
    )
  }

  return (
       <Modal
          animationType="fade"
          transparent={true}
          visible={isVisible}
          onRequestClose={() => {
            setIsVisible(prev => !prev);
          }}>

            <View style={styles.modalView}>
                <View style={[styles.container,{backgroundColor: colors.loyaltyExpiringCard}]}>
                     <View style={styles.header}>
                        <Modes currentMonth={currentMonth} setMode={setMode}/>
                     </View>

                     {mode === 'calendar' && <Days currentMonth={currentMonth} selectedDate={selectedDate} setSelectedDate={setSelectedDate}/> }
                     {mode === 'month' && <Months currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} setMode={setMode} />}
                     {mode === 'year' && <Years currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} setMode={setMode} setYear={setYear}/>}
               </View>
                 
                     <TouchableOpacity
                        disabled={mode !== 'calendar'}
                        style={[styles.applyButton,{backgroundColor: colors.loyaltyPrimary}]}
                        onPress={() => handleApply(selectedDate)}
                     >
                        <TypographyText 
                          size={14}
                          textColor={colors.loyaltyBtnTextPrimary}
                          title={t('BillScanner.apply')}
                         />
                     </TouchableOpacity>
                  
            </View>
     
        </Modal>


  )
}

const styles = StyleSheet.create({
  block: {
    borderRadius: 16,
    padding: 16,
  },
  container: {
    borderRadius: 16,
    padding: 16,
    height: 400,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  applyButton: {
    marginTop: 16,
    alignSelf: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 20
  },
  applyText: {
    color: '#000',
    fontWeight: '600',
  },
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  label: {
    marginHorizontal: 10
  }
})
