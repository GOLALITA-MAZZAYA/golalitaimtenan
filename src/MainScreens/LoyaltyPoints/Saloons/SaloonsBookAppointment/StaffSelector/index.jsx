import React from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Image from "../../../../../components/AppImage";
import UserSvg from "../../../../../assets/Profile.svg";
import { TypographyText } from "../../../../../components/Typography";
import { colors } from "../../../../../components/colors";
import { isRTL } from "../../../../../../utils";

const StaffSelector = ({ staff = [], selectedStaff, setSelectedStaff, t }) => {
  const isRtl = isRTL();

  return (
    <View style={styles.section}>
      <View style={[styles.title, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
        <UserSvg color={colors.primary} width={20} height={20} />
        <TypographyText title={t("Saloons.selectStaff")} size={14} style={{ marginHorizontal: 2 }} textColor={colors.loyaltyTextSecondary}/>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {staff.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setSelectedStaff(item)}
            style={[
              styles.card,
              selectedStaff?.id === item.id && {borderColor: colors.primary, backgroundColor: colors.smallCardBackground,},
            ]}
          >
            <Image source={{ uri: item.photo }} style={styles.photo} />
            <TypographyText
              title={item.name}
              size={12}
              textColor={
                selectedStaff?.id === item.id
                  ? colors.primary
                  : colors.mainText
              }
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginTop: 20 },
  title: { alignItems: "center", marginBottom: 16 },
  card: {
    marginRight: 15,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.smallCardBackground,
  },
  photo: { width: 60, height: 60, borderRadius: 30 },
});

export default StaffSelector;