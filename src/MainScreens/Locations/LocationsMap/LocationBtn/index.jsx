import { ActivityIndicator, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { TypographyText } from "../../../../components/Typography";
import GeolocationSvg from "../../../../assets/geolocation";
import { mainStyles } from "../../../../styles/mainStyles";
import { colors } from "../../../../components/colors";
import { BALOO_REGULAR } from "../../../../redux/types";
import { useTranslation } from "react-i18next";

const LocationBtn = ({ userLocation, onPress }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={onPress} style={styles.geoButton}>
      {userLocation === null ? (
        <ActivityIndicator color={colors.green} size={"small"} />
      ) : (
        <>
          <GeolocationSvg />
          <TypographyText
            textColor={"#686868"}
            size={8}
            font={BALOO_REGULAR}
            title={t("MapPage.nearMe")}
          />
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  geoButton: {
    ...mainStyles.shadow,
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    position: "absolute",
    bottom: 300,
    right: 6,
    zIndex: 10,
  },
});

export default LocationBtn;
