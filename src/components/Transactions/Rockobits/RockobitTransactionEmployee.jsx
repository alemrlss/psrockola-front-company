import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  Button,
  Modal,
  CircularProgress,
  Typography,
} from "@mui/material";
import api from "../../../api/api";
import { formatDate } from "../../../utils/formatDate";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function TransactionRockobitsEmployee() {
  const user = useSelector((state) => state.auth.user);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [take, setTake] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    fetchTransactions();
  }, [page, take]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`transactions/rockobits/${user.id}`, {
        params: {
          skip: page * take,
          take,
          isEmployee: user.type === 22,
        },
      });
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

  const renderTransactionRockobits = (transaction) => {
    //rojo se debita
    if (transaction.type === "transfer_rockobits_to_client") {
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
              color: "red",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            - {transaction.amount}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {transaction.receiver.name}
          </TableCell>

          <TableCell
            sx={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Transferencia a Cliente
            {transaction.voucher && (
              <PhotoCamera
                sx={{ marginLeft: "8px", cursor: "pointer" }}
                onClick={() => handleOpenModal(transaction.voucher)}
              />
            )}
          </TableCell>
        </TableRow>
      );
    }

    //verde se acredita
    if (transaction.type === "transfer_rockobits_to_employee") {
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
              color: "green",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            + {transaction.amount}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {transaction.emitter.name}
          </TableCell>

          <TableCell
            sx={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Transferencia a Empleado
          </TableCell>
        </TableRow>
      );
    }

    //rojo se debita
    if (transaction.type === "revoke_all_rockobits_from_employee") {
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
              color: "red",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            - {transaction.amount}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {transaction.receiver.name}
          </TableCell>

          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            Revocacion de Rockobits de Empleado
          </TableCell>
        </TableRow>
      );
    }

    //rojo se debita
    if (transaction.type === "claim_qr_rockobits") {
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
              color: "red",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            - {transaction.amount}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {transaction.receiver.name}
          </TableCell>

          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            Reclamo de QR
          </TableCell>
        </TableRow>
      );
    }
  };
  const handleOpenModal = (voucher) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVoucher(null);
  };

  return (
    <div className="mt-4">
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
            {t("view_trasactions_loading")}
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table
            aria-label="Rockobits Transactions Table"
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
                  {t("view_transactions_table_date")}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {t("view_transactions_table_amount")}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {t("view_transactions_table_user")}
                </TableCell>

                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {t("view_transactions_table_type")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                    <Typography variant="body1">
                      {t("view_transactions_no_transactions")}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) =>
                  renderTransactionRockobits(transaction)
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
            labelRowsPerPage={t("view_transactions_pagination_rows")}
          />
        </TableContainer>
      )}

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
            style={{ width: "500px", height: "500px", objectFit: "contain" }} // Ajustar el tamaño de la imagen
          />
          <Box sx={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                window.open(selectedVoucher, "_blank");
              }}
              sx={{ marginRight: "10px" }}
            >
              Open in New Tab
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default TransactionRockobitsEmployee;
