import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Avatar,
} from "@mui/material";
import { Visibility, VisibilityOff, CloudUpload } from "@mui/icons-material";
import axios from "../../../api/api";
import api from "../../../api/api";
import apiFormData from "../../../api/apiFormData";
import { useTranslation } from "react-i18next";

function ModalEditEmployee({
  editModalOpen,
  handleEditModalClose,
  editedEmployee,
  setEditedEmployee,
  setEmployees,
  employees,
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [previewImage, setPreviewImage] = useState(null);
  const [photoFile, setPhotoFile] = useState(null); // Almacena el archivo de foto seleccionado

  const [error, setError] = useState("");

  const handleTabChange = (event, newValue) => {
    setError("");
    setPassword("");
    setConfirmPassword("");
    setActiveTab(newValue);
    setPreviewImage(null);
    setPhotoFile(null);
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
      await axios.patch(`/employee/change-password/${editedEmployee.id}`, {
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);

      setPreviewImage(previewURL);
      setPhotoFile(file);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await api.patch(
        `/employee/${editedEmployee.id}`,
        {
          name: editedEmployee.name,
          lastName: editedEmployee.lastName,
          phone: editedEmployee.phone,
          address: editedEmployee.address,
          email: editedEmployee.email,
        }
      );

      setEmployees((prevEmployees) => {
        const index = prevEmployees.findIndex(
          (emp) => emp.id === editedEmployee.id
        );

        const updatedEmployee = {
          ...response.data.data,
          balance: editedEmployee.balance,
        };

        const updatedEmployees = [...prevEmployees];
        updatedEmployees[index] = updatedEmployee;
        return updatedEmployees;
      });

      handleEditModalClose();
    } catch (error) {
      console.error("Error al editar empleado:", error);
    }
  };

  const handleSavePhoto = async () => {
    if (!photoFile) {
      setError("Debes seleccionar una foto.");
      return;
    }

    console.log(photoFile);

    const formData = new FormData();
    formData.append("photo", photoFile);

    try {
      const response = await api.patch(
        `/employee/update-photo/${editedEmployee.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      console.log(employees);

      setEmployees((prevEmployees) => {
        const index = prevEmployees.findIndex(
          (emp) => emp.id === editedEmployee.id
        );

        const updatedEmployee = {
          ...editedEmployee,
          picture: response.data.picture,
        };

        const updatedEmployees = [...prevEmployees];
        updatedEmployees[index] = updatedEmployee;
        return updatedEmployees;
      });
      console.log(employees);
      setError("");
      setPreviewImage(null);
      handleEditModalClose();
    } catch (error) {
      console.error("Error al guardar la foto de perfil:", error);
      setError("Ocurrió un error al guardar la foto.");
    }
  };

  return (
    <Modal
      open={editModalOpen}
      onClose={() => {
        handleEditModalClose();
        setError("");
        setPassword("");
        setConfirmPassword("");
        setPreviewImage(null);
        setPhotoFile(null);
      }}
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
          <Tab label={t("view_employees_list_edit_tab_edit")} />
          <Tab label={t("view_employees_list_edit_tab_password")} />
          <Tab label={t("view_employees_list_edit_tab_photo")} />
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
            <TextField
              fullWidth
              id="name"
              label={t("view_employees_list_edit_tab_edit_name")}
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
              label={t("view_employees_list_edit_tab_edit_lastname")}
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
              label={t("view_employees_list_edit_tab_edit_phone")}
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
              label={t("view_employees_list_edit_tab_edit_address")}
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
              label={t("view_employees_list_edit_tab_edit_email")}
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
              {t("view_employees_list_edit_tab_edit_button")}
            </Button>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ mt: 2 }}>
            <Box>
              <TextField
                label={t("view_employees_list_edit_tab_password_password")}
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
                label={t("view_employees_list_edit_tab_password_confirm_password")}
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
                {t("view_employees_list_edit_tab_password_button")}
              </Button>
              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}
            </Box>{" "}
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t("view_employees_list_edit_tab_photo_title")}
            </Typography>

            <Avatar
              src={previewImage || editedEmployee.picture}
              alt="Foto de perfil"
              sx={{ width: 100, height: 100, mb: 2, margin: "auto" }}
            />

            <Button
              variant="outlined"
              component="label"
              color="primary"
              startIcon={<CloudUpload />}
              sx={{
                width: "100%",
                borderRadius: 10,
                padding: "8px 16px",
                marginTop: 2,
                marginBottom: 2,
                "&:hover": {
                  backgroundColor: "rgba(33, 150, 243, 0.08)",
                },
              }}
            >
              {t("view_employees_list_edit_tab_photo_upload")}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, width: "100%" }}
              onClick={handleSavePhoto}
            >
              {t("view_employees_list_edit_tab_photo_button")}
            </Button>

            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export default ModalEditEmployee;
