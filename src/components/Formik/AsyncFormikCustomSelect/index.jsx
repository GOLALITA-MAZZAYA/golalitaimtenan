import FormikCustomSelect from "../FormikCustomSelect";
import { useQuery } from "react-query";

const AsyncFormikCustomSelect = (props) => {
  const {
    name,
    label,
    getOptions,
    queryName,
    criteria,
    onSelect,
    style,
    placeholder
  } = props;

  const {
    isLoading,
    isError,
    data = [],
    error,
  } = useQuery([queryName, criteria], () => getOptions());

  return (
    <FormikCustomSelect
      name={name}
      label={label}
      options={data}
      loading={isLoading}
      onSelect={onSelect}
      style={style}
      placeholder={placeholder}
    />
  );
};

export default AsyncFormikCustomSelect;
