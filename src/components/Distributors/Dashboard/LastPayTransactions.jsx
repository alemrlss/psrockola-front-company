import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../utils/formatDate";

function LastPayTransactions({ data }) {
  const { t } = useTranslation();

  const getTypeDistributorString = (type) => {
    if (type === 5) {
      return "BEGINNER";
    }
    if (type === 10) {
      return "STARTER";
    }
    if (type === 20) {
      return "STANDARD";
    }
    if (type === 30) {
      return "ADVANCED";
    }
    if (type === 40) {
      return "ULTIMATE";
    }
    if (type === 50) {
      return "ELITE";
    }

    return "Unknown";
  };
  const renderTypeTransaction = (transaction) => {
    if (transaction.type === "distributor_membership") {
      return (
        <TableRow key={transaction.id}>
          <TableCell sx={{ textAlign: "center" }}>
            {formatDate(transaction.createdAt)}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            Compra de membresia{" "}
            {getTypeDistributorString(transaction.membershipDistributor.type)}{" "}
            (Distributor)
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {transaction.amount / 100}$
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {transaction.distributor.name}
          </TableCell>
        </TableRow>
      );
    }

    if (transaction.type === "distributor_rockobits") {
      return (
        <TableRow key={transaction.id}>
          <TableCell sx={{ textAlign: "center" }}>
            {formatDate(transaction.createdAt)}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            Buy {transaction.rockobits} Rockobits (Distributor)
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {transaction.amount / 100}$
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {transaction.distributor?.name}
          </TableCell>
        </TableRow>
      );
    }
  };
  return (
    <>
      <h2 className="text-xl font-bold mt-3 mb-2">Last Pay Transactions</h2>
      <Box
        className="flex items-center"
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <TableContainer className="max-w-xs lg:max-w-full">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#EFF0F2" }}>
                <TableCell sx={{ textAlign: "center" }}> Date</TableCell>
                <TableCell sx={{ textAlign: "center" }}> Type</TableCell>
                <TableCell sx={{ textAlign: "center" }}> Amount</TableCell>
                <TableCell sx={{ textAlign: "center" }}> Distributor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => renderTypeTransaction(row))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default LastPayTransactions;
