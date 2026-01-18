import { useEffect, useState } from "react";
import LocationItem from "./LocationItem";
import { TypographyText } from "../../../../../../../components/Typography";
import { StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../../../../../../components/colors";
import { BALOO_MEDIUM } from "../../../../../../../redux/types";
import { getLocations } from "../../../../../../../redux/locations/locations-thunks";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../../../../components/ThemeProvider";
import { connect } from "react-redux";

const SavedLocations = ({
  onApplyLocation,
  getLocations,
  locations,
  loading,
}) => {
  const [location, setLocation] = useState(null);
  const { t } = useTranslation();
  const { isDark } = useTheme();

  useEffect(() => {
    getLocations();
  }, []);

  const handleApplyLocation = () => {
    onApplyLocation(location);
  };

  return (
    <>
      {locations.map((item) => {
        const isChecked = location?.id === item.id;

        return (
          <LocationItem
            key={item.id}
            title={item.city}
            subTitle={item.formatted_address}
            isChecked={isChecked}
            onChange={() => setLocation(isChecked ? null : item)}
            isDark={isDark}
          />
        );
      })}

      {location && (
        <TouchableOpacity
          style={[
            styles.applyBtn,
            { backgroundColor: isDark ? "#0B177E" : colors.darkBlue },
          ]}
          onPress={handleApplyLocation}
        >
          <TypographyText
            title={t("RestaurantList.applyLocation")}
            textColor={colors.white}
            size={16}
            font={BALOO_MEDIUM}
          />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  applyBtn: {
    padding: 16,
    borderRadius: 8,
    height: 62,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
});

const mapStateToProps = (state) => ({
  locations: state.locationsReducer.locations,
  loading: state.locationsReducer.loading,
});

export default connect(mapStateToProps, { getLocations })(SavedLocations);
