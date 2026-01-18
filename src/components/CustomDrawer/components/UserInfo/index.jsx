import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { TypographyText } from "../../../Typography";
import { colors } from "../../../colors";
import { LUSAIL_REGULAR } from "../../../../redux/types";
import { isRTL } from "../../../../../utils";
import { useTheme } from "../../../ThemeProvider";

const UserInfo = () => {
  const user = useSelector((state) => state.authReducer.user);
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.wrapper,
        { alignItems: isRTL() ? "flex-end" : "flex-start" },
      ]}
    >
      <TypographyText
        title={`${user?.name}  ${user?.x_moi_last_name || ""}`}
        textColor={isDark ? colors.white : colors.darkBlue}
        size={24}
        font={LUSAIL_REGULAR}
      />

      <TypographyText
        title={user?.barcode}
        textColor={"#838383"}
        size={15}
        font={LUSAIL_REGULAR}
        style={styles.barcode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 15,
  },
  wrapperPoints: {
    flexDirection: "row",
    marginTop: 12,
  },
  barcode: {
    marginTop: 12,
  },
  pointItem: {
    flexDirection: "row",
    marginLeft: !isRTL() ? 0 : 10,
    marginRight: isRTL() ? 0 : 10,
  },
  label: {
    marginRight: 5,
  },
});

export default UserInfo;
