import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import { View } from 'react-native';
import { TypographyText } from '../../components/Typography';
import Card from '../../components/Card/Card';
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
            <Card
              name={item.name}
              lname={item.x_moi_last_name}
              barcode={item.barcode}
              expiryDate={expiryDate}
              availablePoints={item.available_points || item.points}
              renderHeader={() => (
                <TypographyText
                  textColor={isDark ? colors.white : colors.darkBlue}
                  size={16}
                  title={
                    item.partner_id
                      ? t('CardPage.employeeCard')
                      : t('CardPage.familyCard')
                  }
                  style={styles.cardType}
                />
              )}
            />
          )}
        />
      </View>

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
          <Barcode
            value={selectedCardItem?.barcode}
            format="CODE128"
            width={2}
            height={70}
            lineColor="black"
            background="white"
          />

          <TypographyText
            textColor={barcodeLineColor}
            size={22}
            title={selectedCardItem?.barcode}
            style={{ fontWeight: '600' }}
          />
        </View>

        <AddToWalletBtn selectedCardItem={selectedCardItem} />
      </View>
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
