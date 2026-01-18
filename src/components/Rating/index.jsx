import { View, StyleSheet } from 'react-native';
import FullStarSvg from "../../assets/full_star.svg";
import HalfStarSvg from "../../assets/half_star.svg";
import { sized } from '../../Svg';
import { colors } from '../colors';
import { TypographyText } from '../Typography';
import { BALOO_SEMIBOLD } from '../../redux/types';

const FullStarIcon = sized(FullStarSvg, 16);
const HalfStarIcon = sized(HalfStarSvg, 16);

const Rating = (props) => {

    return (
        <View style={styles.wrapper}>
        <TypographyText
            textColor={colors.orange}
            size={18}
            font={BALOO_SEMIBOLD}
            title={(+props.value).toFixed(1)}
        />
        {[1, 2, 3, 4, 5].map((i) => {
          return (
            <View key={i} style={styles.stars}>
              {i <= +props.value ? (
                <FullStarIcon />
              ) : (
                <HalfStarIcon />
              )}
            </View>
          );
        })}
      </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    stars: {
        marginLeft: 4
    }
})

export default Rating;