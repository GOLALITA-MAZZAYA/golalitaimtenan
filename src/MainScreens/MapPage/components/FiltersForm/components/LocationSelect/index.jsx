import { useTranslation } from 'react-i18next';
import Select from '../../../../../../components/Form/Select';
import useLocations from '../../../../hooks/useLocations';
import { useMemo } from 'react';

const LocationSelect = props => {
  const { placeholder, value, onChange } = props;
  const { isLoading, data } = useLocations();
  const { i18n } = useTranslation();
  const language = i18n.language;

  const transformLocations = items => {
    return items?.map(option => {
      return {
        value: option.id,
        label:
          language === 'ar' ? option.arabic_name || option.name : option.name,
        short_names: option.short_names,
      };
    });
  };

  const options = useMemo(
    () => transformLocations(data?.data || []),
    [data?.data?.length, language],
  );

  const handleChange = locationId => {
    const fullLocationData = data?.data?.find(item => item.id === locationId);

    onChange(locationId, fullLocationData);
  };

  return (
    <Select
      name="map-location-select"
      options={options}
      style={{ marginTop: 15 }}
      placeholder={placeholder}
      allowClear
      loading={isLoading}
      single
      value={value}
      onChange={handleChange}
    />
  );
};

export default LocationSelect;
