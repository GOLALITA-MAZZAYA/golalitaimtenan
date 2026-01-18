import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { BALOO_MEDIUM } from "../../../../redux/types";
import { TypographyText } from "../../../../components/Typography";
import { useTheme } from "../../../../components/ThemeProvider";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../components/colors";
import BottomSheetComponent from "../../../../components/Form/BottomSheetComponent";
import { getGiftCardCountries } from "../../../../api/giftCard";


import { isRTL } from "../../../../../utils";

const getCountries = async () => {
  const countries = await getGiftCardCountries();
  const options = transformContries(countries);
  return options;
};

const transformContries = (countries) => {
  return countries?.map((item) => ({
    value: item.code,
    label: item.name,
    x_arabic_name: item.x_arabic_name,
    x_flag_image: item.x_flag_image,
  }));
};

const CountryPicker = (props) => {
  const { onChange } = props;
  const [countries, setCountries] = useState([]);

  const { isDark } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    getCountries().then((res) => setCountries(res));
  }, []);

  const transformCounntries = (items) => {
    let result = [];
    items.forEach((option) => {
      result.push({
        value: option.value,
        label: option.label,
        data: option.data,
        indent: 0,
        x_arabic_name: option.x_arabic_name,
        x_flag_image: option.x_flag_image,
      });
    });

    return result;
  };

  const options = useMemo(
    () => transformCounntries(countries),
    [countries?.length]
  );

  return (
    <BottomSheetComponent
      renderSelect={() => (
        <View
          style={{
            flexDirection: isRTL() ? "row-reverse" : "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 4,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: isDark ? colors.mainDarkMode : colors.darkBlue,
            }}
          >
            <TypographyText
              textColor={isDark ? colors.mainDarkMode : colors.darkBlue}
              size={16}
              font={BALOO_MEDIUM}
              title={t("Vouchers.countries")}
              numberOfLines={1}
            />
          </View>
        </View>
      )}
      options={options}
      onChange={onChange}
      onClearPress={() => {
        onChange("QA");
      }}
      single
      modalTitle={t("Vouchers.countries")}
    />
  );
};

export default CountryPicker;
