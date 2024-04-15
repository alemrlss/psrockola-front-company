import { useEffect, useState } from "react";
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
import { formatNumbers } from "../../utils/formatNumbers";
import TablePagination from "@mui/material/TablePagination";
import { Filter, MonetizationOn } from "@mui/icons-material";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [totalCount, setTotalCount] = useState(0);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get(
          `/transactions/${user.id}/${user.type}`,
          {
            params: {
              take: rowsPerPage,
              skip: page * rowsPerPage,
            },
          }
        );
        setTransactions(response.data.data.transactions);
        setTotalCount(response.data.data.total);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page, rowsPerPage, user.id, user.type]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
              <TableCell
                sx={{
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Amount
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Description
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Type
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                Payment Type
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableRow key={transaction.id}>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      color:
                        transaction.type === 0 ||
                        transaction.type === 2 ||
                        transaction.type === 5 ||
                        transaction.type === 8 ||
                        transaction.type === 6 ||
                        transaction.type === 12 ||
                        transaction.type === 13
                          ? "#FF0000" // rojo
                          : "#12A839", // verde
                    }}
                  >
                    {transaction.amount ? (
                      <>
                        {transaction.type === 0 ||
                        transaction.type === 2 ||
                        transaction.type === 5 ||
                        transaction.type === 8 ||
                        transaction.type === 6 ||
                        transaction.type === 12 ||
                        transaction.type === 13
                          ? "-" // Signo "-" para transacciones en rojo
                          : "+"}{" "}
                        {/* Signo "+" para transacciones en verde */}
                        {formatNumbers(transaction.amount)}{" "}
                        {/* Renderizar transaction.amount si existe */}
                      </>
                    ) : (
                      <>
                        {transaction.type === 0 ||
                        transaction.type === 2 ||
                        transaction.type === 5 ||
                        transaction.type === 8 ||
                        transaction.type === 6 ||
                        transaction.type === 12 ||
                        transaction.type === 13
                          ? "-" // Signo "-" para transacciones en rojo
                          : "+"}{" "}
                        {/* Signo "+" para transacciones en verde */}$
                        {formatNumbers(transaction.amountInCents / 100)}{" "}
                        {/* Renderizar transaction.amountInCents si transaction.amount es null */}
                      </>
                    )}
                  </TableCell>
                </TableRow>

                <TableCell
                  sx={{
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  {transaction.description}
                </TableCell>
                <TableCell
                  sx={{
                    color:
                      transaction.type === 0 ||
                      transaction.type === 2 ||
                      transaction.type === 5 ||
                      transaction.type === 8 ||
                      transaction.type === 6 ||
                      transaction.type === 12 ||
                      transaction.type === 13
                        ? "#FF0000" // rojo
                        : "#12A839", // verde
                    fontWeight: "bold",
                    fontSize: "10px",
                    textAlign: "center",
                  }}
                >
                  {(() => {
                    switch (transaction.type) {
                      case 0:
                        return "GASTO CLIENTE DE ROCKOBITS";
                      case 1:
                        return "RECIBO CLIENTE DE ROCKOBITS";
                      case 2:
                        return "TRANSFERENCIA A CLIENTE";
                      case 3:
                        return "COMPRA DE ROCKOBITS POR PLATAFORMA";
                      case 4:
                        return "RECIBO DE ROCKOBITS POR FACTOR EXTERNO";
                      case 5:
                        return "ENVIO DE ROCKOBITS A EMPRESA";
                      case 6:
                        return "TRANSFERENCIA DE ROCKOBITS A EMPLEADO";
                      case 7:
                        return "RECIBO DE ROCKOBITS DE EMPRESA";
                      case 8:
                        return "GENERACION QR";
                      case 9:
                        return "ANULACION QR";
                      case 10:
                        return "RECIBO QR";
                      case 11:
                        return "DEVOLUCION DE EMPLEADO A EMPRESA";
                      case 12:
                        return "COMPRA DE MEMBRESIA";
                      case 13:
                        return "COMPRA DE PANTALLA";

                      default:
                        return "";
                    }
                  })()}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "10px",
                    textAlign: "center",
                  }}
                >
                  {formatDateTime(transaction.createdAt)}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {transaction.type === 2 &&
                    transaction.voucher_url !== null && (
                      <Button
                        onClick={() => handleOpenModal(transaction.voucher)}
                        sx={{
                          minWidth: "unset", // Eliminar el ancho mínimo del botón para que se ajuste al icono
                          borderRadius: "50%", // Hacer que el botón tenga forma de círculo
                          padding: "8px", // Ajustar el padding del botón
                          fontSize: "0px", // Establecer el tamaño de fuente a 0 para ocultar el texto
                        }}
                      >
                        <Filter /> {/* Colocar el icono dentro del botón */}
                      </Button>
                    )}

                  {transaction.type === 2 &&
                    transaction.voucher_url === null && (
                      <Button
                        sx={{
                          minWidth: "unset", // Eliminar el ancho mínimo del botón para que se ajuste al icono
                          borderRadius: "50%", // Hacer que el botón tenga forma de círculo
                          padding: "8px", // Ajustar el padding del botón
                          fontSize: "0px", // Establecer el tamaño de fuente a 0 para ocultar el texto
                          color: "#1BA809", // Establecer el color del texto en gris
                          pointerEvents: "none", // Desactivar los eventos de puntero para que el botón no sea clickeable
                        }}
                      >
                        <MonetizationOn />{" "}
                        {/* Colocar el icono dentro del botón */}
                      </Button>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[20]}
        labelRowsPerPage={"Filas por página:"}
      />
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

export default Transactions;
