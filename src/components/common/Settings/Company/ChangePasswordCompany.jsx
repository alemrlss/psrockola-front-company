/* eslint-disable react/prop-types */
import { Box, Button, TextField, Divider, Grid, Alert } from "@mui/material";
import { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import api from "../../../../api/api";

function ChangePasswordCompany({ user }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword === confirmPassword) {
      try {
        setLoading(true);
        setError(null); // Limpiar errores previos

        const response = await api.patch(`/auth/change-password/${user.id}`, {
          password: currentPassword,
          newPassword: newPassword,
        });

        console.log(response.data);

        setSuccessMessage(`Password changed successfully`); // Mostrar mensaje de éxito
        setConfirmPassword("");
        setCurrentPassword("");
        setNewPassword("");
        setLoading(false);

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } catch (error) {
        console.log(error);
        setLoading(false);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          if (error.response.data.message === "PASSWORD_INCORRECT") {
            setError("Current password is incorrect");
          }
        } else {
          setError("An unexpected error occurred"); // Error genérico
        }

        setTimeout(() => {
          setError("");
        }, 3000);
      }
    } else {
      setError("Passwords do not match!");

      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleCurrentPasswordChange = (event) => {
    setError("");
    setSuccessMessage("");
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setError("");
    setSuccessMessage("");
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setError("");
    setSuccessMessage("");
    setConfirmPassword(event.target.value);
  };

  return (
    <Box
      sx={{
        border: 1,
        padding: 2,
        borderRadius: 2,
        borderColor: "grey.500",
        boxShadow: 1,
        width: "100%",
      }}
    >
      <Box sx={{ position: "relative", mb: 2 }}>
        <TextField
          type={showCurrentPassword ? "text" : "password"}
          label="Current Password"
          fullWidth
          value={currentPassword}
          onChange={handleCurrentPasswordChange}
          sx={{ mb: 2 }}
          size="small"
        />
        <IconButton
          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2, borderColor: "grey.500" }} />

      <Box sx={{ position: "relative", mb: 2 }}>
        <TextField
          type={showNewPassword ? "text" : "password"}
          label="New Password"
          fullWidth
          value={newPassword}
          onChange={handleNewPasswordChange}
          sx={{ mb: 2 }}
          size="small"
        />
        <IconButton
          onClick={() => setShowNewPassword(!showNewPassword)}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {showNewPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </Box>

      <Box sx={{ position: "relative", mb: 2 }}>
        <TextField
          size="small"
          type={showConfirmPassword ? "text" : "password"}
          label="Confirm New Password"
          fullWidth
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          sx={{ mb: 2 }}
        />
        <IconButton
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </Box>

      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Change"}
          </Button>
        </Grid>
        <Grid item>
          {error && (
            <Alert severity="error" sx={{ mb: 0 }}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 0 }}>
              {successMessage}
            </Alert>
          )}
        </Grid>
      </Grid> 
    </Box>
  );
}

export default ChangePasswordCompany;
