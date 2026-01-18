import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import { connect, useDispatch } from "react-redux";
import { ActivityIndicator, View, StyleSheet, FlatList } from "react-native";
import { getFamilyMembers } from "../../redux/transactions/transactions-thunks";
import TransactionsHeader from "./components/TransactionsHeader";
import TransactionsListItem from "./components/TransactionsListItem";
import TransactionsModal from "./components/TransactionsModal";
import { showMessage } from "react-native-flash-message";
import { useTranslation } from "react-i18next";
import { getUserData } from "../../redux/auth/auth-thunks";
import NoData from "./components/NoData";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Transactions = (props) => {
  const { familyMembersLoading, familyMembers, getFamilyMembers } = props;
  const [selectedUserPhone, setSelectedUserPhone] = useState(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    getFamilyMembers();
  }, []);

  const handlePointsShareSuccess = async () => {
    setSelectedUserPhone(null);

    showMessage({
      message: t("Transactions.success"),
      type: "success",
    });

    const token = await AsyncStorage.getItem("token");
    dispatch(getUserData(token));
  };

  const handlePointsShareError = (errorMessage) => {
    setSelectedUserPhone(null);

    showMessage({
      message:
        typeof errorMessage === "string" ? errorMessage : t("General.error"),
      type: "danger",
    });
  };

  const loadingComponent = (
    <View style={styles.loader}>
      <ActivityIndicator />
    </View>
  );

  return (
    <>
      <MainLayout
        contentStyle={styles.wrapper}
        outsideScroll
        headerChildren={<TransactionsHeader />}
      >
        <FlatList
          contentContainerStyle={styles.contentContainerStyle}
          data={familyMembers}
          renderItem={({ item }) => (
            <TransactionsListItem
              name={item.name}
              phone={item.phone}
              logoUrl={item.image_url}
              onPress={setSelectedUserPhone}
            />
          )}
          ListEmptyComponent={
            familyMembersLoading ? loadingComponent : <NoData />
          }
        />
      </MainLayout>

      <TransactionsModal
        modalVisible={!!selectedUserPhone}
        phone={selectedUserPhone}
        setModalVisible={setSelectedUserPhone}
        onSuccess={handlePointsShareSuccess}
        onError={handlePointsShareError}
      />
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainerStyle: {
    paddingHorizontal: 16,
    paddingBottom: 60,
    flexGrow: 1,
  },
});

const mapStateToProps = (state) => ({
  transactionsLoading: state.transactionsReducer.transactionsHistoryLoading,
  familyMembers: state.transactionsReducer.familyMembers,
  familyMembersLoading: state.transactionsReducer.familyMembersLoading,
});

export default connect(mapStateToProps, {
  getFamilyMembers,
})(Transactions);
