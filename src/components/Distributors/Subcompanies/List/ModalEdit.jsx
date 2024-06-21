import { useState } from "react";
import {
  Modal,
  TextField,
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import api from "../../../../api/api";
import { CloudUpload, PhotoCamera } from "@mui/icons-material";
import apiFormData from "../../../../api/apiFormData";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function ModalEditWithTabs({
  editModalOpen,
  handleCloseEditModal,
  editedSubcompany,
  handleInputChange,
  handleSaveChanges,
  loadingState,
  handleChangePassword,
  setPreviewImage,
  setPhotoFile,
  previewImage,
  photoFile,
  setSubcompanies,
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);

      setPreviewImage(previewURL);
      setPhotoFile(file);
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

    console.log(editedSubcompany);
    try {
      const response = await apiFormData.patch(
        `/subcompany/update-photo/${editedSubcompany.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSubcompanies((prevSubcompanies) => {
        const updatedSubcompanies = prevSubcompanies.map((subcompany) => {
          if (subcompany.id === editedSubcompany.id) {
            return {
              ...subcompany,
              logo: response.data.data.logo,
            };
          }

          return subcompany;
        });

        return updatedSubcompanies;
      });

      setError("");
      setPreviewImage(null);
      setPhotoFile(null);
      handleCloseEditModal();
    } catch (error) {
      console.error("Error al guardar la foto de perfil:", error);
      setError("Ocurrió un error al guardar la foto.");
    }
  };

  const handleTabChange = (event, newIndex) => {
    setErrorMessage(""); // Clear error message when changing tabs
    setTabIndex(newIndex);
    setPhotoFile(null); // Clear photo file when changing tabs
    setPreviewImage(null); // Clear preview image when changing tabs
  };

  const handlePasswordChange = () => {
    if (newPassword === confirmPassword) {
      handleChangePassword(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setErrorMessage(""); // Clear error message on success
    } else {
      setErrorMessage("Passwords do not match!");
    }
  };

  console.log(editedSubcompany);
  return (
    <Modal
      open={editModalOpen}
      onClose={handleCloseEditModal}
      aria-labelledby="edit-modal-title"
      aria-describedby="edit-modal-description"
    >
      <div className="w-2/4 bg-white p-4 mx-auto mt-24">
        <h2 id="edit-modal-title" className="text-2xl font-bold mb-4">
          Edit Subcompany
        </h2>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab label="Edit Info" {...a11yProps(0)} />
          <Tab label="Change Password" {...a11yProps(1)} />
          <Tab label="Change Photo" {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          <TextField
            label="Name"
            name="name"
            value={editedSubcompany.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            value={editedSubcompany.email}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Phone"
            name="phone"
            value={editedSubcompany.phone}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Address"
            name="address"
            value={editedSubcompany.address}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSaveChanges}
              variant="contained"
              color="primary"
              disabled={loadingState}
            >
              {loadingState ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              onClick={handleCloseEditModal}
              variant="contained"
              color="secondary"
              disabled={loadingState}
              sx={{ marginLeft: 2 }}
            >
              Close
            </Button>
          </div>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrorMessage(""); // Clear error message when typing
            }}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrorMessage(""); // Clear error message when typing
            }}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          {errorMessage && (
            <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
              {errorMessage}
            </Typography>
          )}
          <div className="flex justify-end mt-4">
            <Button
              onClick={handlePasswordChange}
              variant="contained"
              color="primary"
              disabled={loadingState}
            >
              {loadingState ? "Saving..." : "Change Password"}
            </Button>
            <Button
              onClick={handleCloseEditModal}
              variant="contained"
              color="secondary"
              disabled={loadingState}
              sx={{ marginLeft: 2 }}
            >
              Close
            </Button>
          </div>
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Change Profile Photo
            </Typography>

            <Avatar
              src={previewImage || editedSubcompany.logo}
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
              Upload{" "}
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
              Change
            </Button>

            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
          </Box>
        </TabPanel>
      </div>
    </Modal>
  );
}

export default ModalEditWithTabs;
