import Slider from "@react-native-community/slider";

const Range = ({
  minAmount,
  maxAmount,
  onValueChange,
  onSlidingComplete,
  ...props
}) => {
  return (
    <Slider
      minimumValue={+minAmount}
      maximumValue={+maxAmount}
      step={1}
      onValueChange={onValueChange}
      onSlidingComplete={onSlidingComplete}
      minimumTrackTintColor={"#838383"}
      {...props}
    />
  );
};

export default Range;
