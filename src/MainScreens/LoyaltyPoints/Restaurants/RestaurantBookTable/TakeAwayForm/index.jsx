import {useDispatch, useSelector} from "react-redux";
import CustomInput from "../../../../../components/Form/CustomInput";
import FoodList from "../FoodList"
import {selectCurrentForm} from "../../../../../redux/restaurant/restaurant-selectors";
import {setTakeawayField} from "../../../../../redux/restaurant/restaurant-actions";
import {useTranslation} from "react-i18next";
import {StyleSheet, View} from "react-native";
import Header from "../../../../../components/Header";
// import Button from "../../../../../components/Button";
import {restaurantBook} from "../../../../../redux/restaurant/restaurant-thunks";
import ChartBlock from "../ChartBlock";

const TakeawayForm = ({restaurantId}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const form = useSelector(selectCurrentForm);
    const value = form?.special_instructions;

    const handleSubmit = () => {
        dispatch(restaurantBook(restaurantId));
    }

    return (
       <View style={{flex: 1}}>
        <FoodList 
           restaurantId={restaurantId}
           formName="takeaway"
           renderHeader={() => (
            <View >
             <Header
                  label={t('Restaurants.takeawayTitle')}
                  btns={['back']}
             />
            <CustomInput
                value={value}
                onChangeText={(text) => dispatch(setTakeawayField('special_instructions', text))}
                label={t("Restaurants.noteLabel")}
                placeholder={t("Restaurants.notePlaceholder")}
                textAlignVertical="top"
                style={{marginBottom: 20, paddingHorizontal: 20}}
             />
             </View>
           )}
        />
                      
         <ChartBlock type="order" onPress={handleSubmit} title={t('Restaurants.takeawayChart')} submitBtnText={t('Restaurants.confirm')}/>
    </View>
    )
};

const styles = StyleSheet.create({
    submitBtn: {
     marginHorizontal: 20,
     marginBottom: 20
    }
})

export default TakeawayForm;