import { StyleSheet, View } from "react-native";
import Checkbox from "../../../components/Form/Checkbox";
import { TypographyText } from "../../../components/Typography";
import { colors } from "../../../components/colors";
import { useTheme } from "../../../components/ThemeProvider";
import { useTranslation } from "react-i18next";
import { getFlexDirection } from "../../../../utils";

const SaveMe = ({ isActive, onChange }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.wrapper}>
      <Checkbox active={isActive} onChange={onChange} style={styles.checkbox} />

      <TypographyText
        title={t("Login.rememberMe")}
        textColor={isDark ? colors.darkGrey : colors.darkBlue}
        size={14}
        style={styles.text}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  text: {
    marginLeft: 10,
  },
});

export default SaveMe;
