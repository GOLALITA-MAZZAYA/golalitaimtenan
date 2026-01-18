import { useEffect, useState } from "react";
import { View } from "react-native";
import { BALOO_MEDIUM } from "../../../../redux/types";
import { TypographyText } from "../../../../components/Typography";
import { useTheme } from "../../../../components/ThemeProvider";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../components/colors";
import BottomSheetComponent from "../../../../components/Form/BottomSheetComponent";
import { getGiftCardCategories } from "../../../../api/giftCard";

import { isRTL } from "../../../../../utils";

const transformCategories = (items) => {
  return items.map((option) => ({
    value: option.category_id,
    label: option.name,
    x_arabic_name: option.x_arabic_name,
    x_flag_image: option.x_flag_image,
  }));
};

const getCategories = async () => {
  const countries = await getGiftCardCategories();

  const uniquecountries = await countries.reduce((acc, current) => {
    // Check if the current category_id already exists in the accumulator
    if (!acc.find((item) => item.category_id === current.category_id)) {
      acc.push(current);
    }
    return acc;
  }, []);

  const options = transformCategories(uniquecountries);
  return options;
};

const UGotGiftCategorySelect = (props) => {
  const { onChange } = props;
  const [options, setOptions] = useState([]);

  const { isDark } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    getCategories().then((res) => setOptions(res));
  }, []);

  return (
    <BottomSheetComponent
      name="giftcard-categories"
      renderSelect={() => (
        <View
          style={{
            flexDirection: isRTL() ? "row-reverse" : "row",
            justifyContent: "space-between",
            alignItems: "center",
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
              title={t("Vouchers.categories")}
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
      modalTitle={t("Vouchers.categories")}
    />
  );
};

export default UGotGiftCategorySelect;
