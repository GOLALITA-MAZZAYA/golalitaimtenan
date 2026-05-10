import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { TypographyText } from '../../../../components/Typography';
import { useTheme } from '../../../../components/ThemeProvider';
import { colors } from '../../../../components/colors';

const { width } = Dimensions.get('screen');

const GiftInfoCard = (props) => {
  const { isDark } = useTheme();
  const giftCard = props.giftCard;

  return (
    <View style={styles.wrapper}>
      <View style={styles.logoWrapper}>
        <Image
          source={{ uri: giftCard.logo }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.textWrapper}>
        <TypographyText
          title={giftCard.name}
          textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
          size={14}
          style={styles.name}
        />
        <TypographyText
          title={`${giftCard.validity_in_months} months`}
          textColor="#F0F0F0"
          size={14}
          style={styles.months}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoWrapper: {
    width: 80,
    height: 80,
    marginRight: 15,
    backgroundColor: 'grey',
    borderRadius: 40,
    overflow: 'hidden',
  },
  wrapper: {
    flexDirection: 'row',
    marginTop: 30,
  },
  textWrapper: {
    justifyContent: 'center',
    paddingVertical: 5,
  },
  name: {
    fontWeight: '800',
  },
  months: {
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.lightGrey,
    alignSelf: 'center',
  },
});

export default GiftInfoCard;
