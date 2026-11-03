import Button from "../../../../../components/Button";

const OfferTypeInfoButtons = ({ data }) => {
  return data.map((item) => {
    if (!item.visible) {
      return null;
    }

    return (
      <Button 
         text={item.label}
         onPress={item.onPress}
         style={{marginTop: 20}}
      />
    )

  });
};

export default OfferTypeInfoButtons;
