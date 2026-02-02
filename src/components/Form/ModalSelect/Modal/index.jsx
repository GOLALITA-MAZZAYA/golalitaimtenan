import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {useTheme} from '../../../ThemeProvider';
import {TypographyText} from '../../../Typography';
import Portal from '../../../Portal';
import {colors} from '../../../colors';
import {BALOO_2} from '../../../../redux/types';


const Modal = props => {
  const {
    options,
    onClearPress,
    renderItem,
    onSubmit,
    renderSelect,
    renderHeader,
    renderFooter,
    renderTitle,
    defaultValue: propsValue,
    single,
    shouldCloseModal,
    modalKeyName
  } = props;
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState([]);
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');

  const { isDark } = useTheme();

  console.log(options,'options')
  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['1%','100%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handlePresentModalclose = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const handleSheetChanges = useCallback(index => {
    if (!index) {
      handlePresentModalclose();
      setVisible(false);
    }
  }, []);

  useEffect(() => {
    if (shouldCloseModal) {
      handlePresentModalclose();
    }
  }, [shouldCloseModal]);

  useEffect(() => {
    setValue(propsValue);
  }, [propsValue]);

  const onOk = () => {
    handlePresentModalclose();
    setVisible(false);

    const item = options.find(o => o.value === value);

    onSubmit(value, item);
  };

  const handleClosePress = () => {
    console.log('handle close')
    setValue(single ? undefined : []);

    if (onClearPress) {
      onClearPress();
    }
  };

  const handleSearchChange = text => {
    console.log('hrere')
    setSearch(text);
  };

  const updatedOptions = useMemo(() => {
    return options.filter(item => item.label.includes(search));
  });

  console.log(search,'search')


  const renderBody = () => (
    <BottomSheetFlatList
      style={[
        styles.contentContainer,
        { backgroundColor: isDark ? colors.darkBlue : colors.white },
      ]}
      ListEmptyComponent={() => (
        <View style={styles.empty}>
          <TypographyText
            textColor={isDark ? colors.white : '#312B3E'}
            size={14}
            font={BALOO_2}
            title={t('General.noData')}
            numberOfLines={1}
            style={{fontWeight: '600'}}
          />
        </View>
      )}
      renderItem={({ item: option }) => {

        const active = single
          ? option.value === value
          : value?.includes(option.value);

        const onItemPress = () => {
           setValue(option.value)
        }

        return renderItem?.({
                  isActive: active,
                  item: option,
                  toggleItem: onItemPress
               }) 
      }}
      data={updatedOptions}
      keyExtractor={item => {
        return String(item.value);
      }}
      showsVerticalScrollIndicator={false}
    />
  );

  const openModal = () => {
     handlePresentModalPress()
  };

  return (
    <>
       {renderSelect({openModal})}

      <Portal name={modalKeyName}>
        <BottomSheetModalProvider key={modalKeyName}>
          <View style={styles.container}>
            <BottomSheetModal
              key={modalKeyName}
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              enablePanDownToClose={false}
              onChange={handleSheetChanges}
              backgroundStyle={{
                backgroundColor: isDark ? colors.darkBlue : colors.white,
              }}
              topInset={0}
            >
              {renderTitle?.({onPress: handlePresentModalclose})}

              {renderHeader?.({onChangeText: handleSearchChange})}

              {renderBody()}

              {renderFooter({onSubmit: onOk})}
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'green',
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 8,
    borderWidth: 1.5,
    borderRadius: 4,
    borderColor: '#999CAD',
    height: 36,
  },
  empty: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    marginTop: 5,
  },
  search: {
    borderBottomColor: '#12234D',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchIcon: { marginBottom: 10 },
  searchField: {
    flexGrow: 1,
    marginLeft: 18,
    marginBottom: 10,
    color: '#000',
  },
  body: {
    flex: 1,
  },
  required: {
    color: 'red',
  },
  label: {
    marginBottom: 11,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  help: {
    marginLeft: 5,
  },
  labelText: { marginLeft: 10 },
  valueMargin: {
    marginBottom: 15,
  },
  valueDisabled: {
    color: '#ccc',
  },
  list: {
    alignItems: 'center',
  },
  option: {},
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    height: 20,
    width: 20,
  },

  customOptionMain: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customOptionInput: {
    flexGrow: 1,
    width: 120,
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    marginRight: 10,
    color: '#000',
  },
  container: {
    justifyContent: 'center',
    // backgroundColor: 'grey',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    //alignItems: 'center',
    paddingHorizontal: 25,
    paddingBottom: 100,
    //alignSelf:'center'
  },
  footerContainer: {
    padding: 12,
    // margin: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '40%',
    alignSelf: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '800',
  },
  searchWrapper: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    marginHorizontal: 35,
    marginBottom: 20,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default Modal;
