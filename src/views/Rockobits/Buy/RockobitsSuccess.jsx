import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUserBalance } from "../../../features/authSlice";
import { useSelector } from "react-redux";
import api from "../../../api/api";
import { Box, Typography } from "@mui/material";

function RockobitsSuccess() {
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");
  const [status, setStatus] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        const response = await api.post(
          `stripe/checkout-session-subscription`,
          {
            sessionId: sessionId,
          }
        );

        const data = await response.data;
        setStatus(data.payment_status);
        if (data.payment_status === "paid") {
          const walletResponse = await api.get(
            `wallet/${user.wallet.id}/amount`
          );
          const walletData = await walletResponse.data;
          dispatch(
            updateUserBalance(parseInt(walletData.data.decryptedAmount))
          );
          setTimeout(() => {
            navigate("/rockobits/buy");
          }, 3000);
        }
      } catch (error) {
        console.error("Error en la petición al backend:", error);
        // Manejo de errores según sea necesario
      }
    };

    if (sessionId) {
      handleSuccess();
    }
  }, [sessionId, dispatch, user.wallet.id]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="transparent"
    >
      <Box
        bgcolor="#E6DCDC"
        p={4}
        borderRadius={4}
        boxShadow={3}
        textAlign="center"
      >
        {status && (
          <>
            <Typography variant="h5" gutterBottom>
              {status === "paid" ? "Successful payment" : "Payment failed"}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {status === "paid"
                ? "Thank you for completing your Rockobits payment"
                : "We're sorry, your Rockobits payment has failed. Please try again later."}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}

export default RockobitsSuccess;
