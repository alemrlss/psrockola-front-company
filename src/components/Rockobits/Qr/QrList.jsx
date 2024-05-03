/* eslint-disable react/prop-types */
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import html2canvas from "html2canvas";
import api from "../../../api/api";
import { updateUserBalance } from "../../../features/authSlice";
import ModalQr from "./ModalQr";
import { formatNumbers } from "../../../utils/formatNumbers";
import { useTranslation } from "react-i18next";

function QrList({
  qrList,
  fetchQrList,
  errorQrList,
  user,
  dispatch,
  selectedQr,
  isModalOpen,
  handleCloseModal,
  handleShowQr,
  playSound,
}) {
  const { t } = useTranslation();

  const handleToggleQr = async (newState) => {
    try {
      const qrUpdated = await api.patch(
        `/qr/rockobits/toggleState/${selectedQr.id}`,
        {
          state: newState,
          isEmployee: user.type === 22 ? true : user.type === 23 ? false : null,
          userId: user.id,
        }
      );

      if (qrUpdated.status === 200) {
        handleCloseModal();
        fetchQrList();

        const newBalance = user.balance + parseInt(qrUpdated.data.data.amount);
        dispatch(updateUserBalance(newBalance));
        playSound();
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
  const handleDownloadQR = async () => {
    const canvas = await (
      await html2canvas(document.getElementById("canvas"))
    ).toDataURL();

    const fileName = `QR-${selectedQr.amount}_${formatDateToFile(
      selectedQr.expiration
    )}.png`;
    if (canvas) {
      const a = document.createElement("a");
      a.download = fileName;
      a.href = canvas;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
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
    return `${formattedDate}`;
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
                {t("view_rockobits_qr_codes_table_created")}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                {t("view_rockobits_qr_codes_table_amount")}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                {t("view_rockobits_qr_codes_table_expire")}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                {t("view_rockobits_qr_codes_table_state")}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {errorQrList ? (
              <p className="text-red-500 text-2xl text-center my-4 font-bold">
                {" "}
                {errorQrList}
              </p>
            ) : qrList.length > 0 ? (
              qrList.map((qr) => (
                <TableRow
                  key={qr.id}
                  className={
                    qr.state === 1 && new Date(qr.expiration) < new Date()
                      ? "bg-yellow-300"
                      : qr.state === 0
                      ? "bg-red-300"
                      : qr.state === 2
                      ? "bg-green-300"
                      : qr.state === 1
                      ? "bg-gray-300"
                      : qr.state === 3
                      ? "bg-yellow-200"
                      : "bg-gray-300"
                  }
                >
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {formatExpirationDate(qr.createdAt)}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {formatNumbers(qr.amount)}
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
                      ? t("view_rockobits_qr_code_state_inactive")
                      : qr.state === 1
                      ?  t("view_rockobits_qr_code_state_active")
                      : qr.state === 2
                      ? t("view_rockobits_qr_code_state_consumed")
                      : qr.state === 3
                      ? t("view_rockobits_qr_code_state_expired")
                      : t("view_rockobits_qr_code_state_unknown")}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {qr.state === 1 && new Date(qr.expiration) > new Date() && (
                      <Button
                        onClick={() => handleShowQr(qr)}
                        variant="contained"
                        color="primary"
                      >
                        {t("view_rockobits_qr_codes_table_showqr")}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {t("view_rockobits_qr_codes_table_notfound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalQr
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        selectedQr={selectedQr}
        handleToggleQr={handleToggleQr}
        handleDownloadQR={handleDownloadQR}
        formatExpirationDate={formatExpirationDate}
      />
    </div>
  );
}

export default QrList;
