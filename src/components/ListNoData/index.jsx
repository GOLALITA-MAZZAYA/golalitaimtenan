import { View } from "react-native";
import { TypographyText } from "../Typography";
import { LUSAIL_REGULAR } from "../../redux/types";
import { useTheme } from "../ThemeProvider";
import { colors } from "../colors";
import { useTranslation } from "react-i18next";

const ListNoData = ({ text, style = {} }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
        ...style,
      }}
    >
      <TypographyText
        title={text || t("General.noData")}
        textColor={isDark ? "white" : colors.darkBlue}
        size={16}
        font={LUSAIL_REGULAR}
        style={{ fontWeight: "700" }}
      />
    </View>
  );
};

export default ListNoData;
