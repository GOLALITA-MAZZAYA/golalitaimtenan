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

  const fullName = `${user?.name || ""} ${user?.x_moi_last_name || ""}`.trim() || "User";
  const initial = (user?.name?.[0] || "U").toUpperCase();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? "#1C1C1E" : "#F5F5F7",
          borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
          flexDirection: isRTL() ? "row-reverse" : "row",
        },
      ]}
    >
      <View
        style={[
          styles.avatar,
          {
            backgroundColor: isDark ? "rgba(221, 189, 107, 0.15)" : "rgba(162, 148, 117, 0.15)",
            borderColor: isDark ? colors.mainDarkMode : colors.darkBlue,
          },
        ]}
      >
        <TypographyText
          title={initial}
          textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
          size={18}
          font={LUSAIL_REGULAR}
          style={styles.avatarText}
        />
      </View>

      <View
        style={[
          styles.details,
          {
            alignItems: isRTL() ? "flex-end" : "flex-start",
            marginRight: isRTL() ? 14 : 0,
            marginLeft: isRTL() ? 0 : 14,
          },
        ]}
      >
        <TypographyText
          title={fullName}
          textColor={isDark ? colors.white : "#1C1C1E"}
          size={17}
          font={LUSAIL_REGULAR}
          style={styles.name}
          numberOfLines={1}
        />

        {!!user?.barcode && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)",
              },
            ]}
          >
            <TypographyText
              title={user?.barcode}
              textColor={isDark ? "#8E8E93" : "#6B7280"}
              size={12}
              font={LUSAIL_REGULAR}
              style={styles.barcode}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 8,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontWeight: "700",
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontWeight: "700",
  },
  badge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  barcode: {
    fontWeight: "500",
  },
});

export default UserInfo;
