import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
} from "@mui/material";
import { QRCode } from "react-qrcode";

import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import api from "../../api/api";

function QrList({ qrList, fetchQrList }) {
  const [selectedQr, setSelectedQr] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowQr = (qr) => {
    setSelectedQr(qr);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDownloadQR = () => {
    const qrImage = document.getElementById("qr-image");
    const fileName = `QR-${selectedQr.amount}_${formatDateToFile(
      selectedQr.expiration
    )}.png`;
    const link = document.createElement("a");
    link.href = qrImage.src;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleQr = async (newState) => {
    try {
      const qrUpdated = await api.patch(
        `/qr/rockobits/toggleState/${selectedQr.id}`,
        {
          state: newState,
        }
      );

      if (qrUpdated.status === 200) {
        handleCloseModal();
        fetchQrList();
      }
    } catch (error) {
      console.error("Error deleting QR:", error);
      // Manejo de errores
    }
  };

  const formatDateToFile = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year}-${hours}-${minutes}-${seconds}`;
  };

  const formatExpirationDate = (expiration) => {
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const date = new Date(expiration);
    const formattedDate = date.toLocaleDateString("en-US", options);
    return `expires ${formattedDate}`;
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead
            sx={{
              backgroundColor: "#E8E8E8",
            }}
          >
            <TableRow>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                Rockobits amount
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                Expiration Date
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                State
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                Show QR
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {qrList.map((qr) => (
              <TableRow
                key={qr.id}
                className={`${
                  qr.state === 1
                    ? "bg-gray-200"
                    : qr.state === 0
                    ? "bg-red-400"
                    : "bg-green-300"
                }`}
              >
                <TableCell
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {qr.amount}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {formatExpirationDate(qr.expiration)}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {qr.state === 0
                    ? "Inactive"
                    : qr.state === 1
                    ? "Active"
                    : qr.state === 2
                    ? "Consumed"
                    : "Unknown"}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {qr.state !== 2 && (
                    <Button
                      onClick={() => handleShowQr(qr)}
                      variant="contained"
                      color="primary"
                    >
                      Show QR
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
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg p-5 mx-4 sm:max-w-lg sm:p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-0 right-0 p-1 cursor-pointer text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex justify-center">
              <QRCode
                className="flex justify-center bg-red-500 "
                value={selectedQr.token}
                id="qr-image"
                level="H"
              />
            </div>
            <div className="p-1">
              <p className="text-center">
                <b>{selectedQr.amount} Rockobits</b>
              </p>
              <p className="text-center">
                Expiration: {formatExpirationDate(selectedQr.expiration)}
              </p>
              <div className="flex justify-center space-x-5 mt-2">
                {selectedQr.state === 1 && (
                  <Button
                    sx={{
                      backgroundColor: "#D20103",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#B30000",
                      },
                    }}
                    onClick={() => {
                      handleToggleQr(0);
                    }}
                    variant="contained"
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                )}
                {selectedQr.state === 0 && (
                  <Button
                    sx={{
                      backgroundColor: "#F0CC41",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#D7B73A",
                      },
                    }}
                    onClick={() => {
                      handleToggleQr(1);
                    }}
                    variant="contained"
                    startIcon={<DeleteIcon />}
                  >
                    Active
                  </Button>
                )}
                <Button
                  onClick={handleDownloadQR}
                  variant="contained"
                  color="success"
                  startIcon={<CloudDownloadIcon />}
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default QrList;
