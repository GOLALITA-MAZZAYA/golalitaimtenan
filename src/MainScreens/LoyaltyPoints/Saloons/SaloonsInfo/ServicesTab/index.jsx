import { FlatList, StyleSheet, View, TouchableOpacity } from "react-native";
import FullScreenLoader from "../../../../../components/Loaders/FullScreenLoader";
import ListNoData from "../../../../../components/ListNoData";
import useSaloonDetails from "../../hooks/useSaloonDetails";
import SaloonServiceCard from "./SaloonServiceCard";
import { useNavigation } from "@react-navigation/native";
import { isRTL } from "../../../../../../utils";
import { useState } from "react";
import { TypographyText } from "../../../../../components/Typography";
import { BALOO_2 } from "../../../../../redux/types";
import { colors } from "../../../../../components/colors";
import { useTranslation } from "react-i18next";
import {useSelector} from "react-redux";
import {loyaltySelector} from "../../../../../redux/loyalty/loyalty-selectors";
import {getChartPrice} from "../../../helpers";
import Button from "../../../../../components/Button";

const ServicesTab = ({ saloonId, feeAmount }) => {
    const { services, loading } = useSaloonDetails(saloonId);
    const navigation = useNavigation();
    const isRtl = isRTL();
    const { t } = useTranslation();

    const [selectedServices, setSelectedServices] = useState([]);
    const {merchantDiscount} = useSelector(loyaltySelector);

    const discountPercentage = merchantDiscount?.rule?.discount_percentage;
    const {total, discount} = getChartPrice(selectedServices, discountPercentage, !selectedServices?.length ? 'booking': 'order');

    const toggleService = (service) => {
        setSelectedServices(prev => {
            const exists = prev.find(s => s.id === service.id);
            if (exists) {
                return prev.filter(s => s.id !== service.id);
            }
            return [...prev, service];
        });
    };

    const isSelected = (service) => selectedServices.some(s => s.id === service.id);

    const totalPrice = selectedServices.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
    const totalDuration = selectedServices.reduce((sum, s) => sum + (parseInt(s.duration_minutes) || 0), 0);

    const handleBookSelected = () => {
        

        navigation.navigate('saloons-appointment', {
            selectedServices,
            saloonId
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.flatList}
                contentContainerStyle={styles.contentContainerStyle}
                data={loading ? [] : services}
                keyExtractor={(item) => String(item.id)}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={true}
                bounces={false}
                renderItem={({ item }) => (
                    <SaloonServiceCard
                        style={styles.card}
                        serviceName={isRtl ? item.name_ar : item.name}
                        duration={item.duration_minutes ? `${item.duration_minutes} min` : item.duration || ''}
                        price={item.price}
                        logo={item.icon || item.photo}
                        isSelected={isSelected(item)}
                        onToggle={() => toggleService(item)}
                    />
                )}
                ListFooterComponent={() => (
                   
                  <>
                        <View style={[styles.bottomBar, { backgroundColor: colors.cardBackground, borderColor: colors.mainBorder }]}>
                            <View style={[styles.bottomBarInfo]}>
                                {!!selectedServices.length &&<View style={styles.infoWrapper}>
                                    <TypographyText
                                        font={BALOO_2}
                                        title={`${selectedServices.length} ${t('Saloons.servicesSelected')}`}
                                        textColor={colors.textSecondary}
                                        size={14}
                                        weight="600"
                                    />
                                    <TypographyText
                                        font={BALOO_2}
                                        title={`${totalPrice} QAR${totalDuration ? ` • ${totalDuration} min` : ''}`}
                                        textColor={colors.textSecondary}
                                        size={14}
                                    />
                                </View>}

                                {!selectedServices.length && 
                                  <View style={styles.infoWrapper}>
                                    <TypographyText
                                        font={BALOO_2}
                                        title={t('Saloons.totalFee')}
                                        textColor={colors.textSecondary}
                                        size={14}
                                        weight="600"
                                    />
                                    <TypographyText
                                        font={BALOO_2}
                                        title={`${feeAmount} ${t("General.qar")}`}
                                        textColor={colors.textSecondary}
                                        size={14}
                                    />
                                </View>}

                                {!!selectedServices.length && !!discount && <View style={styles.infoWrapper}>
                                    <TypographyText
                                        font={BALOO_2}
                                        title={t('Saloons.discount')}
                                        textColor={colors.textSecondary}
                                        size={14}
                                        weight="600"
                                    />
                                    <TypographyText
                                        font={BALOO_2}
                                        title={`- ${discount} ${t("General.qar")}`}
                                        textColor={colors.textSecondary}
                                        size={14}
                                    />
                                </View>}
                             
                                  <View style={[styles.infoWrapper,{ borderTopWidth: 1, paddingTop: 10, borderTopColor: colors.textSecondary}]}>
                                    <TypographyText
                                        font={BALOO_2}
                                        title={t('Saloons.total')}
                                        textColor={colors.mainText}
                                        size={18}
                                        style={styles.totalText}
                                    />
                                    <TypographyText
                                        font={BALOO_2}
                                        title={`${total} ${t("General.qar")}`}
                                        textColor={colors.mainText}
                                        size={18}
                                        style={styles.totalText}
                                    />
                                </View>
                            </View>
                        </View>


                          <Button
                            onPress={handleBookSelected}
                            text={t('Saloons.bookAppointment')}
                            style={styles.bookBtn}
                          />


                    </>


                )}
                ListEmptyComponent={() => {
                    if (loading) {
                        return <FullScreenLoader style={styles.loader} />
                    }
                    return <ListNoData />
                }}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loader: {
        marginTop: 30,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    flatList: {
        marginTop: 20
    },
    contentContainerStyle: {
        flexGrow: 1,
    },
    card: {
        marginBottom: 16
    },
    bottomBar: {
        marginTop: 20,
        marginBottom: 40,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderWidth: 1.5,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    bottomBarInfo: {
        justifyContent: 'space-between',
    },
    bookBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 16,
    },
    totalText: {
      fontWeight: '500'
    },
    infoWrapper: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    }
});

export default ServicesTab;
