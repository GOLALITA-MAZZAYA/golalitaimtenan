import {useDispatch, useSelector} from "react-redux";
import CustomInput from "../../../../../components/Form/CustomInput";
import FoodList from "../FoodList"
import {selectCurrentForm} from "../../../../../redux/restaurant/restaurant-selectors";
import {setDeliveryField} from "../../../../../redux/restaurant/restaurant-actions";
import {useTranslation} from "react-i18next";
import {StyleSheet, View} from "react-native";
import Header from "../../../../../components/Header";
// import Button from "../../../../../components/Button";
import {useNavigation} from "@react-navigation/native";
import ChartBlock from "../ChartBlock";

const DeliveryForm = ({restaurantId}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const form = useSelector(selectCurrentForm);
    const value = form?.special_instructions;
    const navigation = useNavigation();

    const handleSubmit = () => {
        navigation.navigate('restaurant-delivery-address-list',{ restaurantId });
    }

    return (
       <View style={{flex: 1}}>
        <FoodList 
           restaurantId={restaurantId}
           formName="delivery"
           renderHeader={() => (
            <View >
             <Header
                  label={t('Restaurants.deliveryTitle')}
                  btns={['back']}
                />
            <CustomInput
                value={value}
                onChangeText={(text) => dispatch(setDeliveryField('special_instructions', text))}
                label={t("Restaurants.noteLabel")}
                placeholder={t("Restaurants.notePlaceholder")}
                textAlignVertical="top"
                style={{marginBottom: 20, paddingHorizontal: 20}}
             />
             </View>
           )}
        />
                      
         {/* <Button
              onPress={handleSubmit}
              text={'Continue'}
              style={styles.submitBtn}
         /> */}

         <ChartBlock 
              type="order"
              onPress={handleSubmit}
              title={t('Restaurants.deliveryChart')}
              submitBtnText={t('Restaurants.continue')}
          />
        </View>
    )
};

const styles = StyleSheet.create({
    submitBtn: {
     marginHorizontal: 20,
     marginBottom: 20
    }
})

export default DeliveryForm;