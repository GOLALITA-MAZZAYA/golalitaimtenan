import {StyleSheet} from "react-native";
import Select from "../../../../components/Form/Select";

const AmountSelect = ({options, onChange, value}) => {
    return (
     <Select
            mainStyle={styles.select}
            options={options}
            value={value}
            onChange={onChange}
            single={true}
            allowClear={false}
          />
    );
};

const styles = StyleSheet.create({
   select: {

   }
});

export default AmountSelect;