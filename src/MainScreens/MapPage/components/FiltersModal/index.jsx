import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Portal from '../../../../components/Portal';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../components/ThemeProvider';
import { useMemo, useRef } from 'react';
import { colors } from '../../../../components/colors';
import FiltersBtn from '../FiltersBtn';
import FiltersForm from '../FiltersForm';
import CloseSvg from '../../../../assets/close.svg';
import { sized } from '../../../../Svg';

const FiltersModal = ({ onGetFilters, filters }) => {
  const { isDark } = useTheme();
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['65%', '90%'], []);
  const name = 'map-filters';
  const CloseIcon = sized(CloseSvg, 16, 16, isDark ? '#fff' : '#312B3E');

  const handleFilterBtnPress = () => {
    bottomSheetModalRef.current?.present();
  };

  const handleClosePress = () => {
    bottomSheetModalRef.current?.close();
  };

  const handleSheetChanges = index => {
    if (index === -1) {
      bottomSheetModalRef.current?.close();
    }
  };

  const handleSubmit = filters => {
    bottomSheetModalRef.current?.close();

    onGetFilters(filters);
  };

  return (
    <>
      <FiltersBtn onPress={handleFilterBtnPress} />
      <Portal name={name}>
        <BottomSheetModalProvider key={name}>
          <View style={styles.container}>
            <BottomSheetModal
              key={name}
              ref={bottomSheetModalRef}
              index={0}
              snapPoints={snapPoints}
              enablePanDownToClose={true}
              onChange={handleSheetChanges}
              backgroundStyle={{
                backgroundColor: isDark ? colors.darkBlue : colors.white,
              }}
            >
              <BottomSheetView>
                <View style={{ flex: 1 }}>
                  <View style={styles.closeIconWrapper}>
                    <TouchableOpacity onPress={handleClosePress}>
                      <CloseIcon />
                    </TouchableOpacity>
                  </View>
                  <FiltersForm onSubmit={handleSubmit} filters={filters} />
                </View>
              </BottomSheetView>
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  closeIconWrapper: {
    height: 20,
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 32,
  },
});

export default FiltersModal;
