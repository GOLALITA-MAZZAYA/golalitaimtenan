import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getMerchants } from "../../../../api/merchants";
import { transformMerchantsData } from "./utils";
import ExpandedCategoryBlocks from "../../../../components/ExpandedCategoryBlocks";
import { useTheme } from "../../../../components/ThemeProvider";
import { useDispatch } from "react-redux";
import { getMerchantDetails } from "../../../../redux/merchant/merchant-thunks";
import { navigationRef } from "../../../../Navigation/RootNavigation";
import { getOffsetAndLimit } from "../../../../../utils";
import { getCategoryNameByIdAndLang } from "../../../../components/Categories/helpres";

const LIMIT = 30;

const Merchants = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const pageRef = useRef(1);

  const [isShowLessVisible, setIsShowLessVisible] = useState(false);
  const [isShowMoreVisible, setIsShowMoreVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMerchants({ ...getOffsetAndLimit(pageRef.current, LIMIT) })
      .then((res) => {
        setData(transformMerchantsData(res));
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePress = (brand) => {
    dispatch(
      getMerchantDetails(
        brand,
        navigationRef,
        t,
        getCategoryNameByIdAndLang(brand.category_id),
        false
      )
    );
  };

  const handleShowMorePress = () => {
    if (pageRef.current === 1 && data?.length > 0 && data?.length <= LIMIT) {
      pageRef.current = 2;
    }

    setLoading(true);

    getMerchants({ ...getOffsetAndLimit(pageRef.current, LIMIT) })
      .then((res) => {
        if (!res?.length) {
          setIsShowMoreVisible(false);
          return;
        }

        if (!isShowLessVisible) {
          setIsShowLessVisible(true);
        }

        pageRef.current = pageRef.current + 1;
        setData((prevData) => {
          return prevData.concat(transformMerchantsData(res));
        });
      })
      .finally(() => setLoading(false));
  };

  const handleShowLessPress = () => {
    setIsShowLessVisible(false);
  };

  return (
    <ExpandedCategoryBlocks
      data={data}
      onPress={handlePress}
      title={t("MainScreen.merchants")}
      isDark={isDark}
      pagination={{
        onShowMorePress: handleShowMorePress,
        isShowMoreVisible: isShowMoreVisible && !loading,
        loading,
        isShowLessVisible: isShowLessVisible && !loading,
        onShowLessPress: handleShowLessPress,
      }}
      isShowMoreBtn={false}
    />
  );
};

export default Merchants;
