import { useTranslation } from "react-i18next";
import { getAllMerchantsForScan } from "../../../../api/merchants";
import AsyncFormikSelect from "../../../../components/Formik/AsyncFormikSelect";

const transformCategories = (categories) => {
  return categories?.map((item) => ({
    value: item.name,
    label: item.name,
  }));
};

const AsyncFormikMerchantSelect = ({ onChange }) => {
  const { t } = useTranslation();

  const getMerchants = async () => {
    const merchants = await getAllMerchantsForScan();

    const options = transformCategories(merchants);

    return options;
  };

  return (
    <AsyncFormikSelect
      name="merchant_name"
      label={t("BillScanner.merchantsLabel")}
      getOptions={getMerchants}
      single
      queryName="merchants"
      onChange={onChange}
    />
  );
};

export default AsyncFormikMerchantSelect;
