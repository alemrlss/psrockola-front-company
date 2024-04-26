import { useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../../../api/api";

function ModalEditEmployee({
  editModalOpen,
  handleEditModalClose,
  editedEmployee,
  setEditedEmployee,
  setEmployees,
}) {
  const [activeTab, setActiveTab] = useState(0);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const handleTabChange = (event, newValue) => {
    setError("");
    setPassword("");
    setConfirmPassword("");
    setActiveTab(newValue);
  };

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChangePassword = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length === 0 || confirmPassword.length === 0) {
      setError("Password can't be empty");
      return;
    }

    try {
      await api.patch(`/employee/change-password/${editedEmployee.id}`, {
        newPassword: password,
      });
      handleEditModalClose();
      setError("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError("An error occurred");
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handleEdit = async () => {
    try {
      // Realiza la solicitud PATCH al servidor para editar el empleado
      const response = await api.patch(`/employee/${editedEmployee.id}`, {
        name: editedEmployee.name,
        lastName: editedEmployee.lastName,
        phone: editedEmployee.phone,
        address: editedEmployee.address,
        email: editedEmployee.email,
      });

      // Actualiza el estado de los empleados con los datos editados
      setEmployees((prevEmployees) => {
        // Encuentra el índice del empleado editado en el array employees
        const index = prevEmployees.findIndex(
          (emp) => emp.id === editedEmployee.id
        );

        // Crea un nuevo objeto de empleado con los datos actualizados
        const updatedEmployee = {
          ...response.data.data,
          balance: editedEmployee.balance, // Mantén el balance existente
        };

        // Crea una nueva matriz de empleados con el empleado actualizado
        const updatedEmployees = [...prevEmployees];
        updatedEmployees[index] = updatedEmployee;
        return updatedEmployees;
      });

      handleEditModalClose(); // Cierra el modal de edición
    } catch (error) {
      console.error("Error al editar empleado:", error);
    }
  };

  return (
    <Modal
      open={editModalOpen}
      onClose={handleEditModalClose}
      aria-labelledby="edit-employee-modal"
      aria-describedby="edit-employee-modal-description"
      width="400"
      height="400"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
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
        }}
      >
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Edit User" />
          <Tab label="Change Password" />
        </Tabs>

        {activeTab === 0 && (
          <Box
            component="form"
            sx={{ mt: 2 }}
            onSubmit={(e) => {
              e.preventDefault();
              handleEdit();
            }}
          >
            {/* Formulario de edición de usuario */}
            <TextField
              fullWidth
              id="name"
              label="Name"
              variant="outlined"
              value={editedEmployee.name}
              onChange={(e) =>
                setEditedEmployee({ ...editedEmployee, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="lastname"
              label="Lastname"
              variant="outlined"
              value={editedEmployee.lastName}
              onChange={(e) =>
                setEditedEmployee({
                  ...editedEmployee,
                  lastName: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="phone"
              label="Phone"
              variant="outlined"
              value={editedEmployee.phone}
              onChange={(e) =>
                setEditedEmployee({
                  ...editedEmployee,
                  phone: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="address"
              label="Address"
              variant="outlined"
              value={editedEmployee.address}
              onChange={(e) =>
                setEditedEmployee({
                  ...editedEmployee,
                  address: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="email"
              label="Email"
              variant="outlined"
              value={editedEmployee.email}
              onChange={(e) =>
                setEditedEmployee({
                  ...editedEmployee,
                  email: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />
            <Button fullWidth variant="contained" color="primary" type="submit">
              Save
            </Button>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ mt: 2 }}>
            <Box>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type={showPassword ? "text" : "password"}
                onChange={(e) => {
                  setError("");

                  setPassword(e.target.value);
                }}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleToggleShowPassword}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
              />
              <TextField
                label="Confirm Password"
                variant="outlined"
                fullWidth
                type={showConfirmPassword ? "text" : "password"}
                onChange={(e) => {
                  setError("");

                  setConfirmPassword(e.target.value);
                }}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleToggleShowConfirmPassword}>
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleChangePassword}
              >
                Save changes
              </Button>
              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}
            </Box>{" "}
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export default ModalEditEmployee;
