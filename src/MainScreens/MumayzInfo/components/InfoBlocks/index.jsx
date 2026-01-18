import TitleWithInfo from "../../../../components/TitleWithInfo";
import CommonButton from "../../../../components/CommonButton/CommonButton";

const InfoBlocks = ({ data, onPress, label, textColor, style }) => {
  return data.map((item) => {
    console.log("Info bloack data item:", item.showButton);
    if (!item.value) {
      return null;
    }

    return (
      <>
        <TitleWithInfo
          title={item.title}
          value={item.value}
          valueType={item.valueType}
          onPress={item.onPress}
        />
        {item.showButton && (
          <CommonButton
            onPress={onPress}
            label={label}
            textColor={textColor}
            style={style}
          />
        )}
      </>
    );
  });
};

export default InfoBlocks;
