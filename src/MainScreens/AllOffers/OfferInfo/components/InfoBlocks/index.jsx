import TitleWithInfo from "../../../../../components/TitleWithInfo";

const InfoBlocks = ({ data }) => {
  return data.map((item) => {
    if (!item.value) {
      return null;
    }

    return (
      <TitleWithInfo
        title={item.title}
        value={item.value}
        valueType={item.valueType}
        onPress={item.onPress}
      />
    );
  });
};

export default InfoBlocks;
