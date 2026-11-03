import { FlatList, StyleSheet, ActivityIndicator, View, TouchableOpacity } from "react-native";
import { useQuery } from "react-query";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { getSaloonsList } from "../../../../api/saloons";
import ListNoData from "../../../../components/ListNoData";
import SaloonListTabItem from "./SaloonListTabItem";
import { useNavigation } from "@react-navigation/native";
import { isRTL } from "../../../../../utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TypographyText } from "../../../../components/Typography";
import { BALOO_2 } from "../../../../redux/types";
import { colors } from "../../../../components/colors";
import {useTheme} from "../../../../components/ThemeProvider";

const SaloonsListTab = () => {
    const navigation = useNavigation();
    const isRtl = isRTL();
    const { t } = useTranslation();
    const [filter, setFilter] = useState('male');
    const {isDark} = useTheme();

    const {
        data: saloons,
        isLoading,
    } = useQuery(
        ["saloons-list", filter],
        () => getSaloonsList({ page: 1, type: filter })
    );


    // Fallback local filtering in case the backend returns all despite the query param
    const filteredSaloons = saloons?.filter(item => {
        if (!item.audience_type) return true; // If backend doesn't send it, assume it returns the correct list

        if (filter === 'male') {
            return item.audience_type === 'men' || item.audience_type === 'unisex';
        }
        if (filter === 'family') {
            return item.audience_type === 'women' || item.audience_type === 'unisex';
        }
        return true;
    });

    const getBtnStyles = (isActive) => {

        const defaultStyle = isDark ?  { backgroundColor: colors.cardBackground, borderColor: colors.primary } : {backgroundColor: 'white', borderColor: colors.primary}

        return isActive ? { backgroundColor: colors.primary, borderColor: colors.primary} : defaultStyle
    }

    const getBtnTextColor = (isActive) => {

        return isActive ? isDark ? colors.mainDarkModeText: 'white': colors.primary;
    }

    const renderFilters = () => (
        <View style={[styles.filterContainer, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity
                onPress={() => setFilter('male')}
                style={[styles.filterBtn, getBtnStyles(filter === 'male')]}
            >
                <TypographyText
                    font={BALOO_2}
                    size={14}
                    textColor={getBtnTextColor(filter === 'male')}
                    title={t('Saloons.male')}
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setFilter('family')}
                style={[styles.filterBtn, getBtnStyles(filter === 'family')]}
            >
                <TypographyText
                    font={BALOO_2}
                    size={14}
                    textColor={getBtnTextColor(filter === 'family')}
                    title={t('Saloons.family')}
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            {renderFilters()}
            <FlatList
                data={filteredSaloons}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                removeClippedSubviews={true}
                renderItem={({ item }) => (
                    <SaloonListTabItem
                        logo={item.photo}
                        name={isRtl ? item.name_ar : item.name}
                        time={item.distance_km ? `${item.distance_km} km` : ''}
                        rating={item.rating}
                        address={isRtl ? item.address_ar : item.address}
                        onPress={() =>
                            navigation.navigate("saloons-info", {
                                saloonId: item.salon_id || item.id,
                            })
                        }
                    />
                )}
                keyExtractor={(item) => (item.salon_id || item.id).toString()}
                style={styles.list}
                contentContainerStyle={styles.contentContainerStyle}
                ListEmptyComponent={!isLoading ? <ListNoData /> : <FullScreenLoader />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        marginTop: 10,
    },
    contentContainerStyle: {
        paddingHorizontal: 20,
        flexGrow: 1,
        paddingBottom: 160,
    },
    filterContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        justifyContent: 'center'
    },
    filterBtn: {
        flex: 1,
        height: 45,
        backgroundColor: '#2E2E2E',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginHorizontal: 5,
        borderWidth: 1.5,
        borderColor: '#514735'
    },
    activeFilterBtn: {
        backgroundColor: colors.primary,
        borderColor: colors.primary
    }
});

export default SaloonsListTab;
