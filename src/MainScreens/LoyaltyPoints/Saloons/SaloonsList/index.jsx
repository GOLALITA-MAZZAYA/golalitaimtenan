import { StyleSheet } from "react-native";
import { SCREEN_HEIGHT } from "../../../../styles/mainStyles";
import MainLayout from "../../../../components/MainLayout";
import Header from "../../../../components/Header";
import { useTranslation } from "react-i18next";
import SaloonsListTab from "./SaloonsListTab";

const SaloonsList = () => {
    const { t } = useTranslation();

    return (
        <MainLayout
            outsideScroll={true}
            headerChildren={
                <Header label={t('Saloons.title')} btns={['back']} />
            }
            headerHeight={50}
            contentStyle={styles.contentStyle}
        >
            <SaloonsListTab />
        </MainLayout>
    )
};

const styles = StyleSheet.create({
    contentStyle: {
        height: SCREEN_HEIGHT,
        flexGrow: 1,
        paddingHorizontal: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
    },
});

export default SaloonsList;
