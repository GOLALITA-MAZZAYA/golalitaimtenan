import { StyleSheet, View,Switch } from "react-native";
import {useTheme} from "../../../../components/ThemeProvider";
import {useTranslation} from "react-i18next";
import {isRTL} from "../../../../../utils";
import {TypographyText} from "../../../../components/Typography";
import {colors} from "../../../../components/colors";
import {BALOO_BOLD} from "../../../../redux/types";

const RewardsPointsToggle = ({ style, isChecked, onToggleSwitch }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();


  const handleToggleSwitch = () => {
      onToggleSwitch(isChecked => !isChecked)
  }


  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.container}>
        
        <Switch
        trackColor={{false: '#767577', true: '#129B82'}}
        thumbColor={isChecked ? '#f4f3f4' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={handleToggleSwitch}
        value={isChecked}
      />
      </View>
      <View style={{flexDirection:isRTL() ? "row-reverse" : "row", flex:1, justifyContent:'space-between'}}>
        <TypographyText
          title={t("Vouchers.useRewardPoints")}
          textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
          size={16}
          font={BALOO_BOLD}
          style={styles.text}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    // lineHeight: 20,
  },
  container: {
   // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20
  },
});

export default RewardsPointsToggle;
