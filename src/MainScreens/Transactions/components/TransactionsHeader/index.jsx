import React from "react";
import MainScreenHeader from "../../../MainScreen/MainScreenHeader";
import { useTranslation } from "react-i18next";

const TransactionsHeader = () => {
  const { t } = useTranslation();

  return <MainScreenHeader headerLabel={t("Transactions.transaction")} />;
};

export default TransactionsHeader;
