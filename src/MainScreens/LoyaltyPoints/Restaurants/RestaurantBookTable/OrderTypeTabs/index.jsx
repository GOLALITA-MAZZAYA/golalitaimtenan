import {useDispatch, useSelector} from "react-redux";
import TabsSelect from "../../../../../components/Form/TabsSelect";
import {selectOrderType} from "../../../../../redux/restaurant/restaurant-selectors";
import {setOrderType} from "../../../../../redux/restaurant/restaurant-actions";

const options = [
    {
        label: 'Reservation',
        value: 'reservation'
    },
    {
        label: 'Delivery',
        value: 'delivery'
    },
    {
        label: 'Takeaway',
        value: 'takeaway'
    },
]

const OrderTypeTabs = () => {
    const dispatch = useDispatch();
    const type = useSelector(selectOrderType);
    

    return (
        <TabsSelect
            options={options}
            value={type}
            onChange={(val) => dispatch(setOrderType(val))}
            style={{marginBottom: 20}}
        />

    );
};

export default OrderTypeTabs;