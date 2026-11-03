import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TypographyText } from '../../../../components/Typography';
import { BALOO_2 } from '../../../../redux/types';
import { colors } from '../../../../components/colors';

const Clock = ({ style }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (num) => num.toString().padStart(2, '0');

  const formattedDateTime = `${now.getFullYear()}-${pad(
    now.getMonth() + 1
  )}-${pad(now.getDate())}  ${pad(now.getHours())}:${pad(
    now.getMinutes()
  )}:${pad(now.getSeconds())}`;

  return (
    <View style={[style,styles.wrapper,{backgroundColor: colors.loyaltyCardBackground}]}>
      <TypographyText
        font={BALOO_2}
        size={14}
        textColor={colors.mainText}
        title={formattedDateTime}
        style={styles.text}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    wrapper: {
       paddingVertical: 6,
       paddingHorizontal: 12,
       borderRadius: 8,
    },
    text: {
        fontWeight: '500'
    }
})

export default Clock;