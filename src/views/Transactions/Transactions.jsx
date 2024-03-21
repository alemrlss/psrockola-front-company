import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import api from "../../api/api";
import { useSelector } from "react-redux";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get(`/transactions/${user.id}`);
        setTransactions(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = `${date.getFullYear()}/${padZero(
      date.getMonth() + 1
    )}/${padZero(date.getDate())}`;
    const formattedTime = `${padZero(date.getHours())}:${padZero(
      date.getMinutes()
    )}:${padZero(date.getSeconds())}`;
    return `${formattedDate}-${formattedTime}`;
  };

  const padZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Transactions
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className={
                  transaction.type === 0 ||
                  transaction.type === 2 ||
                  transaction.type === 5 ||
                  transaction.type === 8 ||
                  transaction.type === 6
                    ? "bg-red-200"
                    : "bg-green-200"
                }
              >
                <TableCell
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {transaction.amount}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{formatDateTime(transaction.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Transactions;
