import { StyleSheet, View } from "react-native";
import { TypographyText } from "../../../../components/Typography";
import { colors } from "../../../../components/colors";
import {BALOO_2} from "../../../../redux/types";
import {isRTL} from "../../../../../utils";

const GiftInfoCard = ({name, validity}) => {

  return (
    <View style={[styles.wrapper,{alignItems: isRTL() ? 'flex-end': 'flex-start'}]}>
        <TypographyText
          title={name}
          textColor={colors.loyaltyTextMainTitle}
          size={22}
          style={styles.name}
          font={BALOO_2}
        />
        <TypographyText
          title={`${validity} months`}
          textColor={colors.loyaltyPrimary}
          size={14}
          style={styles.months}
          font={BALOO_2}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
  },
  textWrapper: {
    justifyContent: "center",
    paddingVertical: 5,
  },
  name: {
    fontWeight: "700",
  },
  months: {
    marginTop: 2
  },
});

export default GiftInfoCard;
