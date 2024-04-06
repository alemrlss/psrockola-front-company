import {
  Box,
  Typography,
  Modal,
  Button,
  Tab,
  Tabs,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import UpdateUser from "./Settings/UpdateUser";
import ChangePassword from "./Settings/ChangePassword";
import CloseIcon from "@mui/icons-material/Close";

function ModalEditUser({ openModal, handleCloseModal, user }) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUploadPhoto = () => {
    // Lógica para actualizar la foto de perfil del usuario
  };

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="user-settings-modal"
      aria-describedby="user-settings-modal-description"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            width: 600, // Ancho fijo del modal
            height: 400, // Altura fija del modal
            bgcolor: "white",
            boxShadow: 24,
            p: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <IconButton onClick={handleCloseModal}>
              <CloseIcon
                sx={{
                  color: "red",
                  border: "1px solid red",
                  borderRadius: "50%",
                }}
              />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              aria-label="User Settings Tabs"
              sx={{ mb: 2 }}
            >
              <Tab label="Update user" />
              {<Tab label="Change password" />}
              <Tab label="Update profile photo" variant="contained" />
            </Tabs>

            {tabValue === 0 && <UpdateUser user={user} />}

            {tabValue === 1 && <ChangePassword user={user} />}

            {tabValue === 2 && (
              <Box>
                <Typography variant="h6">Update photo</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default ModalEditUser;
