import React from "react";
import { useStateContext } from "../utils/StateContext";
import Table from "../components/Table.js";

const Transactions = () => {
  const {
    transactionData,
    transactionDataFilePath,
    transactionDataFields,
    showTransactionDataFields,
    transactionDataFieldsOrder,
  } = useStateContext();

  return (
    <Table
      fields={transactionDataFields}
      data={transactionData}
      filePath={transactionDataFilePath}
      showFields={showTransactionDataFields}
      fieldOrder={transactionDataFieldsOrder}
    />
  );
};

export default Transactions;
