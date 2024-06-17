import { useEffect, useState } from "react";
import api from "../../../../api/api";
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { formatDate } from "../../../../utils/formatDate";
import { useSelector } from "react-redux";

function PayTransactions() {
  const user = useSelector((state) => state.auth.user);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [take, setTake] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [page, take]);
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `/transactions/pay/distributor/${user.id}`,
        {
          params: {
            skip: page * take,
            take,
          },
        }
      );
      setTransactions(response.data.data.transactions);
      setTotalCount(response.data.data.total);
    } catch (error) {
      console.error("Error fetching Rockobits transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setTake(parseInt(event.target.value, 10));
    setPage(0);
  };
  const renderTransactionPay = (transaction) => {
    if (transaction.type === "rockobits") {
      return (
        <TableRow key={transaction.id}>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {formatDate(transaction.createdAt)}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            Compra de {transaction.rockobits} Rockobits
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {transaction.amount / 100}$
          </TableCell>
        </TableRow>
      );
    }

    if (transaction.type === "screen") {
      return (
        <TableRow key={transaction.id}>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {formatDate(transaction.createdAt)}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            Compra de Screen: {transaction.screen.code}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {transaction.amount / 100}$
          </TableCell>
        </TableRow>
      );
    }
    if (transaction.type === "membership") {
      return (
        <TableRow key={transaction.id}>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {formatDate(transaction.createdAt)}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            Compra de Membresia: {getTypeString(transaction.membership.type)}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {transaction.amount / 100}$
          </TableCell>
        </TableRow>
      );
    }
    if (transaction.type === "distributor_rockobits") {
      return (
        <TableRow key={transaction.id}>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {formatDate(transaction.createdAt)}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            Compra de {transaction.rockobits} Rockobits
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {transaction.amount / 100}$
          </TableCell>
        </TableRow>
      );
    }

    if (transaction.type === "distributor_membership") {
      return (
        <TableRow key={transaction.id}>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {formatDate(transaction.createdAt)}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            Compra de Membresia{" "}
            {getTypeDistributorString(transaction.membershipDistributor.type)}{" "}
            (Distribuidor)
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {transaction.amount / 100}$
          </TableCell>
        </TableRow>
      );
    }
    if (transaction.type === "gift_distributor") {
      return (
        <TableRow key={transaction.id}>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {formatDate(transaction.createdAt)}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            Regalo PSROCKOLA
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {transaction.amount}$
          </TableCell>
        </TableRow>
      );
    }
  };

  const getTypeString = (type) => {
    if (type === 10) {
      return "BASIC";
    }
    if (type === 20) {
      return "PLUS";
    }
    if (type === 30) {
      return "PREMIUM";
    }

    return "Unknown";
  };

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

  return (
    <Box sx={{ my: 1 }}>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress size={120} />
          <Typography variant="h6" sx={{ marginTop: "16px", fontSize: "32px" }}>
            Loading..{" "}
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table
            aria-label="Pay Transactions Table"
            sx={{
              border: "2px solid #e0e0e0",
            }}
          >
            <TableHead
              sx={{
                backgroundColor: "#CFD1D0",
              }}
            >
              <TableRow>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  Type
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                    <Typography variant="body1">
                      No transactions found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) =>
                  renderTransactionPay(transaction)
                )
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={take}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[20, 10]}
          />
        </TableContainer>
      )}
    </Box>
  );
}

export default PayTransactions;
