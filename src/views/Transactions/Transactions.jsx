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
  Button,
  Modal,
  Box,
} from "@mui/material";
import api from "../../api/api";
import { useSelector } from "react-redux";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleOpenModal = (voucher) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
              <TableCell>Voucher</TableCell>
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
                <TableCell>
                  {transaction.type === 2 && transaction.voucher !== null && (
                    <Button
                      onClick={() => handleOpenModal(transaction.voucher)}
                      variant="contained"
                      color="primary"
                    >
                      Show Voucher
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <Button
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            X
          </Button>
          <img
            src={selectedVoucher}
            alt="Voucher"
            style={{ width: "500px", height: "500px" }}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default Transactions;
