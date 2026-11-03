import {StyleSheet, View} from "react-native";
import {TypographyText} from "../../Typography";
import {BALOO_2} from "../../../redux/types";
import {colors} from "../../colors";
import {isRTL} from "../../../../utils";

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WEEK_DAYS_AR = ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];


const WeekDays = () => {
    const data = isRTL() ? WEEK_DAYS_AR : WEEK_DAYS;

    return (
      <View style={styles.weekRow}>
        {data.map(day => (
            <TypographyText 
                key={day}
                font={BALOO_2}
                style={styles.weekText}
                title={day}
                textColor={colors.loyaltyPrimary}

            />
        ))}
      </View>
    )
};

const styles = StyleSheet.create({
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 10
  },

  weekText: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
  },
});

export default WeekDays;