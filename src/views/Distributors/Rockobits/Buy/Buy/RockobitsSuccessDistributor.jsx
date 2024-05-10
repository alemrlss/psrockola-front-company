import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUserBalance } from "../../../../../features/authSlice";
import api from "../../../../../api/api";
import { Box, Typography } from "@mui/material";

function RockobitsSuccessDistributor() {
  // Referencia al elemento de audio para controlar la reproducción del sonido
  const audioRef = useRef(null);

  // Obtener la sesión de la URL
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");

  // Estado para almacenar el estado del pago
  const [status, setStatus] = useState(null);

  // Obtener el usuario del estado global
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Función para reproducir el sonido
  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  // Efecto para manejar la petición a la API
  useEffect(() => {
    // Función para manejar el éxito de la petición

    if (sessionId) {
      const handleSuccess = async () => {
        try {
          const response = await api.post(
            `stripe/checkout-session-subscription`,
            {
              sessionId: sessionId,
            }
          );

          const data = response.data;
          setStatus(data.payment_status);

          if (data.payment_status === "paid") {
            // Reproducir el sonido

            // Actualizar el saldo del usuario
            const walletResponse = await api.get(
              `wallet/${user.wallet.id}/amount`
            );
            const walletData = walletResponse.data;
            dispatch(
              updateUserBalance(parseInt(walletData.data.decryptedAmount))
            );
            playSound();
          }
        } catch (error) {
          console.error("Error en la petición a la API:", error);
        }
      };

      handleSuccess();
    }
  }, [sessionId, dispatch, user.wallet.id]);

  // Renderizar la UI
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="transparent"
    >
      {/* Elemento de audio con referencia */}
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

export default RockobitsSuccessDistributor;
