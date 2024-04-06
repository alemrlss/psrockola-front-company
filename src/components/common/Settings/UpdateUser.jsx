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
import api from "../../../api/api";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../features/authSlice";

function UpdateUser({ user }) {
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

  const handleSubmitEmployee = async () => {
    console.log("Para empleados");
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
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            size="small"
            fullWidth
            disabled={user.type === 22}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            size="small"
            disabled={user.type === 22}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            fullWidth
            size="small"
            disabled={user.type === 22}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            size="small"
            fullWidth
            disabled={user.type === 22}
          />
        </Grid>
        <Grid item xs={6}>
          {user.type === 23 ? (
            <TextField
              label="Postal Code"
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
        {user.type === 22 ? null : (
          <Button
            onClick={
              user.type === 23 ? handleSubmitCompany : handleSubmitEmployee
            }
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        )}
      </Grid>
    </Box>
  );
}

export default UpdateUser;
