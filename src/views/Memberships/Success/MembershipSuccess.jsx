import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../api/api";
import { useDispatch } from "react-redux";
import { updateUserMembership } from "../../../features/authSlice";
import { Box, Typography } from "@mui/material";

function MembershipsSuccess() {
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");
  const [status, setStatus] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        const response = await api.post(
          "stripe/checkout-session-subscription",
          {
            sessionId,
          }
        );
        const data = await response.data;

        setStatus(data.payment_status);
        if (data.payment_status === "paid") {
          dispatch(
            updateUserMembership({
              name: data.metadata.membership_name,
              type: parseInt(data.metadata.membership_type),
              expiration: data.metadata.membership_expiration,
            })
          );
        }
      } catch (error) {
        console.error("Error en la petición al backend:", error);
        // Manejo de errores según sea necesario
      }
    };

    if (sessionId) {
      handleSuccess();
    }
  }, [sessionId]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bgcolor="#E6FFFA"
        p={4}
        borderRadius={8}
        boxShadow={3}
        textAlign="center"
      >
        {status && (
          <div>
            <Typography
              variant="h4"
              color="primary"
              gutterBottom
              sx={{
                fontWeight: 600,
              }}
            >
              {status === "paid"
                ? "Successful Membership Payment"
                : "Membership Payment Failed"}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {status === "paid"
                ? "Thank you for completing your payment! If you have any questions, please do not hesitate to contact us."
                : "We're sorry, your payment has failed. Please try again later or contact support if the problem persists."}
            </Typography>
          </div>
        )}
      </Box>
    </Box>
  );
}

export default MembershipsSuccess;
