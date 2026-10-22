import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { TypographyText } from '../../../Typography';

const MyBookingsBtn = ({ onPress, ...props }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} {...props}>
      <TypographyText title="🎫" size={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyBookingsBtn;
