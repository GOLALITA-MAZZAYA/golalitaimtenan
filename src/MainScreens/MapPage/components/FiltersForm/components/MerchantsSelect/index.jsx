import React, { useMemo } from "react";
import Select from "../../../../../../components/Form/Select";
import useMerchants from "../../../../hooks/useMerchants";
import i18next from "i18next";

const transformMerchants = (merchants) => {
  const language = i18next.language;

  return merchants?.map((item) => ({
    value: item.merchant_name,
    label: language === "ar" ? item.x_arabic_name : item.merchant_name,
  }));
};

const MerchantsSelect = ({
  locationId,
  onChange,
  value,
  placeholder,
  latitude,
  longitude,
}) => {
  const { isLoading, data } = useMerchants(latitude, longitude);

  const options = useMemo(() => {
    const transformedData = transformMerchants(data) || [];

    return transformedData;
  }, [data?.length, locationId]);

  return (
    <Select
      name="map-merchants-select"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onClearPress={() => {
        onChange(null);
      }}
      single={true}
      loading={isLoading}
      options={options}
      allowClear
    />
  );
};

export default MerchantsSelect;
