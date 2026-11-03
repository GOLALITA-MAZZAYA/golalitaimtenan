import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {TypographyText} from '../../../../components/Typography';
import {BALOO_2} from '../../../../redux/types';
import {colors} from '../../../../components/colors';
import {useTranslation} from 'react-i18next';

const PaymentError = ({ onSubmitPress }) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      

      <Text style={styles.icon}>❌</Text>


      <TypographyText 
        title={t('Restaurants.paymentFailed')}
        font={BALOO_2}
        style={styles.title}
        textColor={colors.loyaltyTextMainTitle}
      />


      <TypographyText 
        title={t('Restaurants.paymentErrorDescription')}
        font={BALOO_2}
        style={styles.description}
        textColor={colors.textSecondary}
      />


      <TouchableOpacity onPress={onSubmitPress}>

       <TypographyText 
         title={t('Restaurants.goBack')}
         font={BALOO_2}
         style={styles.secondaryText}
       />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  primaryBtn: {
    backgroundColor: '#E53935',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 15,
  },
  primaryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  secondaryText: {
    color: '#E53935',
  },
});

export default PaymentError;