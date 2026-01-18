import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import BottomSheetComponent from "../BottomSheetComponent";
import { getAllLocations } from "../../../../../api/global";

const LocationPicker = (props) => {
  const { onChange, loading, placeholder, value } = props;
  const [location, setLocation] = useState([]);

  const { t, i18n } = useTranslation();
  const language = i18n.language;

  useEffect(() => {
    getAllLocations()
      .then((res) => setLocation(res.data))
      .catch((err) => {
        console.log(err, "getAllLocations error");
      });
  }, []);

  const transformCounntries = (items) => {
    return items?.map((option) => {
      return {
        value: option.id,
        label: language === "ar" ? option.arabic_name : option.name,
        short_names: option.short_names,
      };
    });
  };

  const options = useMemo(
    () => transformCounntries(location),
    [location, language]
  );

  return (
    <>
      <BottomSheetComponent
        shouldCloseModal={loading}
        loading={loading}
        name="locationsheet"
        placeholder={placeholder}
        value={value}
        options={options}
        onChange={(i) => {
          onChange(i);
        }}
        onClearPress={() => {
          onChange(undefined);
        }}
        single={true}
        modalTitle={t("Location.location")}
        allowClear
      />
    </>
  );
};

export default LocationPicker;
