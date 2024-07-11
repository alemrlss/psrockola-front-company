/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import api from "../../../../api/api";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../../features/authSlice";
import { useTranslation } from "react-i18next";

function UpdateUserCompany({ user }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    address: user.address || "",
    postalCode: user.postalCode || "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmitCompany = async () => {
    setLoading(true); // Iniciar la carga

    try {
      const response = await api.patch(`/user/${user.id}`, formData);
      const updatedUser = {
        ...user,
        email: response.data.data.email,
        name: response.data.data.name,
        phone: response.data.data.phone,
        address: response.data.data.address,
        postalCode: response.data.data.postalCode,
      }; // Suponiendo que la respuesta devuelve el usuario actualizado

      // Actualizar el estado en Redux
      dispatch(updateUser(updatedUser));
      setSuccessMessage("User updated successfully");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000); // Ocultar el mensaje de éxito después de 3 segundos
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false); // Finalizar la carga
    }
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
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label={t("settings_update_user_name")}
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label={t("settings_update_user_email")}
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label={t("settings_update_user_phone")}
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label={t("settings_update_user_address")}
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          {user.type === 23 ? (
            <TextField
            label={t("settings_update_user_postalCode")}
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
          ) : null}
        </Grid>
        <Grid item sx={6}>
          {successMessage && (
            <Alert severity="success" sx={{ marginLeft: 1 }}>
              {successMessage}
            </Alert>
          )}
        </Grid>
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 2,
        }}
      >
        <Button
          onClick={handleSubmitCompany}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : t("settings_update_user_save")}{" "}
        </Button>
      </Grid>
    </Box>
  );
}

export default UpdateUserCompany;
