import React, { useEffect, useState } from "react";
import { SafeAreaView, Image, View, StyleSheet } from "react-native";
import { colors } from "../../components/colors";
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import { mainStyles } from "../../styles/mainStyles";
import { TypographyText } from "../../components/Typography";
import { BALOO_SEMIBOLD } from "../../redux/types";
import { useTheme } from "../../components/ThemeProvider";
import { useTranslation } from "react-i18next";
import { getFlexDirection, isRTL } from "../../../utils";
import { connect } from "react-redux";
import { FlatList } from "react-native";
import DashboardItem from "./components/DashboardItem";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import FromToDateSelect from "../../components/FromToDateSelect";
import { getTransformedDateFromTimestamp } from "../../components/FromToDateSelect/helpers";
import { getTransactionsPoints as getTransactionsPointsRequest } from "../../api/transactions";
import { showMessage } from "react-native-flash-message";

const getDefaultFromDate = () => {
  var nextDate = new Date();
  nextDate.setYear(nextDate.getFullYear() - 1);

  return nextDate.getTime();
};

const Dashboard = ({ user }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [fromDate, setFromDate] = useState(getDefaultFromDate());
  const [toDate, setToDate] = useState(new Date().getTime());
  const mainColor = isDark ? colors.white : colors.darkBlue;

  const getTransactionsPoints = async (fromDateTimestamp, toDateTimestamp) => {
    const fromDate = getTransformedDateFromTimestamp(fromDateTimestamp);
    const toDate = getTransformedDateFromTimestamp(toDateTimestamp);

    try {
      setLoading(true);
      const transactions = await getTransactionsPointsRequest({
        fromDate,
        toDate,
      });

      if (Array.isArray(transactions)) {
        setData(transactions);
      } else {
        throw "err";
      }
    } catch (err) {
      showMessage({
        message: t("Dashboard.error"),
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((fromDate && toDate) || (!fromDate && !toDate)) {
      getTransactionsPoints(fromDate, toDate);
    }
  }, [fromDate, toDate]);

  const loader = <FullScreenLoader />;

  const noData = (
    <View style={styles.noDataWrapper}>
      <TypographyText
        textColor={mainColor}
        size={16}
        font={BALOO_SEMIBOLD}
        title={t("Dashboard.noData")}
        style={[isRTL() ? { marginRight: 5 } : { marginLeft: 5 }]}
      />
    </View>
  );

  const header = (
    <View
      style={[{ paddingBottom: 20, marginBottom: 0, alignItems: "center" }]}
    >
      <TypographyText
        textColor={mainColor}
        size={42}
        font={BALOO_SEMIBOLD}
        title={"QAR 0"}
        style={{ marginTop: 0 }}
      />

      <View style={[mainStyles.row, getFlexDirection()]}>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
        />
        <TypographyText
          textColor={mainColor}
          size={24}
          font={BALOO_SEMIBOLD}
          title={user.available_points}
          style={[isRTL() ? { marginRight: 5 } : { marginLeft: 5 }]}
        />
      </View>

      <FromToDateSelect
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        style={styles.datePicker}
      />
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: isDark ? colors.darkBlue : colors.white,
        flex: 1,
      }}
    >
      <SafeAreaView style={{ flex: 1, flexGrow: 1 }}>
        <CommonHeader
          isWhite={isDark}
          label={t("Dashboard.dashboard")}
          style={{ backgroundColor: isDark ? colors.darkBlue : undefined }}
        />

        {header}

        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
          data={loading ? [] : data}
          renderItem={({ item }) => (
            <DashboardItem
              name={item.merchant_category_name}
              points={`${item.points} ${t("Dashboard.points")}`}
              logo={item.merchant_category_logo}
            />
          )}
          ListEmptyComponent={loading ? loader : noData}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 40,
    width: 40,
  },

  headerWrapper: {
    paddingBottom: 20,
    marginBottom: 0,
    alignItems: "center",
  },
  header: {
    marginTop: 10,
  },
  pointsWrapper: {
    flexDirection: "row",
    alignSelf: "center",
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  safeArea: {
    flex: 1,
  },
  noDataWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  datePicker: {
    width: "100%",
    marginTop: 16,
    paddingHorizontal: 10,
  },
});

const mapStateToProps = (state) => ({
  user: state.authReducer.user,
});

export default connect(mapStateToProps, {})(Dashboard);
