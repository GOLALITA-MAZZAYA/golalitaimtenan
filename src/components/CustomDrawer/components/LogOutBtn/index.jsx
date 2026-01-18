import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TypographyText } from "../../../Typography";
import { LUSAIL_REGULAR } from "../../../../redux/types";
import LogoutSvg from "../../../../assets/logout.svg";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { logout } from "../../../../redux/auth/auth-thunks";
import { isRTL } from "../../../../../utils";

const LogOutBtn = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      onPress={() => dispatch(logout())}
      style={[
        styles.wrapper,
        { flexDirection: isRTL() ? "row-reverse" : "row" },
      ]}
    >
      <TypographyText
        textColor={"#EA3434"}
        size={18}
        font={LUSAIL_REGULAR}
        title={t("Drawer.logout")}
        style={styles.text}
      />

      <View style={styles.iconWrapper}>
        <LogoutSvg
          height={20}
          width={20}
          style={{ transform: [{ rotate: isRTL() ? "180deg" : "0deg" }] }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  iconWrapper: {
    marginHorizontal: 5,
  },
  text: {
    marginRight: 5,
    marginLeft: 5,
  },
});

export default LogOutBtn;
