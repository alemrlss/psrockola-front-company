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
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"; // Importa el icono de Material Icons
import MoneyIcon from "@mui/icons-material/Money"; // Importar el icono de efectivo
import { Filter, MonetizationOn } from "@mui/icons-material";

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
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",

                    fontSize: "16px",
                    color:
                      transaction.type === 0 ||
                      transaction.type === 2 ||
                      transaction.type === 5 ||
                      transaction.type === 8 ||
                      transaction.type === 6
                        ? "#FF0000" // rojo
                        : "#12A839", // verde
                  }}
                >
                  {
                    transaction.type === 0 ||
                    transaction.type === 2 ||
                    transaction.type === 5 ||
                    transaction.type === 8 ||
                    transaction.type === 6
                      ? "-" // Agrega el signo - si el color es rojo
                      : "+" // Agrega el signo + si el color es verde
                  }
                  {formatNumbers(transaction.amount)}
                </TableCell>

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
                      transaction.type === 6
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
                  {formatDateTime(transaction.date)}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {transaction.type === 2 && transaction.voucher !== null && (
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

                  {transaction.type === 2 && transaction.voucher === null && (
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
