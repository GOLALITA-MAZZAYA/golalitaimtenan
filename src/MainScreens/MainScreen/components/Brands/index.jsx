import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getMerchants } from "../../../../api/merchants";
import { transformBrandsData } from "./utils";
import ExpandedCategoryBlocks from "../../../../components/ExpandedCategoryBlocks";
import { useTheme } from "../../../../components/ThemeProvider";
import { useDispatch } from "react-redux";
import { getMerchantDetails } from "../../../../redux/merchant/merchant-thunks";
import { navigationRef } from "../../../../Navigation/RootNavigation";
import { getCategoryNameByIdAndLang } from "../../../../components/Categories/helpres";

const Brands = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const { isDark } = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    getMerchants({ category_id: [18] }).then((res) =>
      setData(transformBrandsData(res))
    );
  }, []);

  const handlePress = (brand) => {
    dispatch(
      getMerchantDetails(
        brand,
        navigationRef,
        t,
        getCategoryNameByIdAndLang(18),
        false
      )
    );
  };

  return (
    <ExpandedCategoryBlocks
      data={data}
      onPress={handlePress}
      title={t("MainScreen.brands")}
      isDark={isDark}
    />
  );
};

export default Brands;
