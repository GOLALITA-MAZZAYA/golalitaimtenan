import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Header from '../../components/Header';
import { View } from 'react-native';
import { TypographyText } from '../../components/Typography';
import Card from '../../components/Card/Card';
import EnlargeIcon from '../../components/EnlargeIcon';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../../redux/auth/auth-selectors';
import Barcode from 'react-native-barcode-expo';
import { transformDisplayedExpiryDate } from './utils';
import { useTheme } from '../../components/ThemeProvider';
import { colors } from '../../components/colors';
import AddToWalletBtn from './components/AddToWalletBtn';
import { getFamilyMembers } from '../../redux/transactions/transactions-thunks';
import Carousel from 'react-native-reanimated-carousel';
import { SCREEN_WIDTH } from '../../styles/mainStyles';

const CardPage = () => {
  const user = useSelector(userSelector);
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const isMainUser = useSelector(state => state.authReducer.isMainUser);
  const familyMembers = useSelector(
    state => state.transactionsReducer.familyMembers,
  );
  const [data, setData] = useState([user]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullScreenVisible, setIsFullScreenVisible] = useState(false);
  const [isBarcodeFullScreenVisible, setIsBarcodeFullScreenVisible] = useState(false);
  console.log('datadatadatadata', data);
  const expiryDate = transformDisplayedExpiryDate(user?.x_user_expiry);
  const mainnBackgroundColor = isDark ? colors.darkModeBackground : '#fff';
  const barcodeLineColor = isDark ? '#fff' : 'black';

  useEffect(() => {
    if (familyMembers?.length && isMainUser) {
      setData([user, ...familyMembers]);
    }
  }, [familyMembers?.length]);

  useEffect(() => {
    if (isMainUser) {
      dispatch(getFamilyMembers());
    }
  }, []);

  const selectedCardItem = data[selectedIndex];

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: mainnBackgroundColor,
        },
      ]}
    >
      <Header label={t('CardPage.card')} btns={['back']} />

      <View
        style={{
          height: 220,
          marginTop: 25,
        }}
      >
        <Carousel
          width={SCREEN_WIDTH}
          data={data}
          scrollAnimationDuration={1000}
          onScrollEnd={setSelectedIndex}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} activeOpacity={0.9} onPress={() => setIsFullScreenVisible(true)}>
              <Card
                name={item.name}
                lname={item.x_moi_last_name}
                barcode={item.barcode}
                expiryDate={expiryDate}
                availablePoints={item.available_points || item.points}
              />
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity onPress={() => setIsFullScreenVisible(true)} style={{ marginTop: 5, paddingVertical: 5, alignSelf: 'flex-end', paddingRight: 20 }}>
        <EnlargeIcon size={28} color={isDark ? '#FFF' : colors.darkBlue} strokeWidth={2} />
      </TouchableOpacity>

      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            alignItems: 'center',
            marginTop: 10,
            flex: 1,
            marginBottom: 5,
          }}
        >
          <TouchableOpacity activeOpacity={0.8} onPress={() => setIsBarcodeFullScreenVisible(true)} style={{ alignItems: 'center' }}>
            {selectedCardItem?.barcode ? (
              <Barcode
                value={selectedCardItem?.barcode}
                format="CODE128"
                width={2}
                height={70}
                lineColor="black"
                background="white"
              />
            ) : null}

            <TypographyText
              textColor={barcodeLineColor}
              size={22}
              title={selectedCardItem?.barcode}
              style={{ fontWeight: '600' }}
            />
            
            <View style={{ marginTop: 5, paddingVertical: 5, alignSelf: 'flex-end', paddingRight: 10 }}>
              <EnlargeIcon size={28} color={isDark ? '#FFF' : colors.darkBlue} strokeWidth={2} />
            </View>
          </TouchableOpacity>
        </View>

        <AddToWalletBtn selectedCardItem={selectedCardItem} />
      </View>

      <Modal
        visible={isFullScreenVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsFullScreenVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity 
            style={{ position: 'absolute', top: 60, right: 30, zIndex: 10, padding: 10 }}
            onPress={() => setIsFullScreenVisible(false)}
          >
             <TypographyText title="✕" size={30} textColor="#FFFFFF" />
          </TouchableOpacity>

          <View style={{ height: 220, transform: [{ rotate: '90deg' }, { scale: 1.6 }] }}>
            <Card
              name={selectedCardItem?.name}
              lname={selectedCardItem?.x_moi_last_name}
              barcode={selectedCardItem?.barcode}
              expiryDate={expiryDate}
              availablePoints={selectedCardItem?.available_points || selectedCardItem?.points}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={isBarcodeFullScreenVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsBarcodeFullScreenVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity 
            style={{ position: 'absolute', top: 60, right: 30, zIndex: 10, padding: 10 }}
            onPress={() => setIsBarcodeFullScreenVisible(false)}
          >
             <TypographyText title="✕" size={30} textColor="#000000" />
          </TouchableOpacity>

          <View style={{ transform: [{ rotate: '90deg' }, { scale: 1.5 }], alignItems: 'center' }}>
            {selectedCardItem?.barcode ? (
              <Barcode
                value={selectedCardItem?.barcode}
                format="CODE128"
                width={3}
                height={100}
                lineColor="black"
                background="white"
              />
            ) : null}
            <TypographyText
              textColor="black"
              size={30}
              title={selectedCardItem?.barcode}
              style={{ fontWeight: '600', marginTop: 10 }}
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  cardType: {
    alignSelf: 'right',
    textAlign: 'right',
    marginRight: 20,
    marginBottom: 5,
  },
});

export default CardPage;
