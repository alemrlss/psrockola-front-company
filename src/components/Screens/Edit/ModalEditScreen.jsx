import {
  Box,
  Button,
  Modal,
  Tab,
  Tabs,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

function ModalEditScreen({
  isEditModalOpen,
  handleEditModalClose,
  screen,
  handleEditNameScreen,
  handleEditPasswordScreen,
  isEditingScreen,
  setScreen,
  error,
  setError,
  setPassword,
  setConfirmPassword,
}) {
  const { t } = useTranslation();
  // Estado para controlar la pestaña activa
  const [activeTab, setActiveTab] = useState(0);

  // Estado para controlar la visibilidad de las contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Manejador de cambio de pestañas
  const handleTabChange = (event, newValue) => {
    setError("");
    setActiveTab(newValue);
  };

  // Manejador para cambiar la visibilidad de la contraseña
  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Modal open={isEditModalOpen} onClose={handleEditModalClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{ mb: 2 }}
        >
          <Tab label={t("view_screens_edit_name")} />
          <Tab label={t("view_screens_edit_change_password")} />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <TextField
              label={t("view_screens_edit_name_name")}
              variant="outlined"
              fullWidth
              value={screen.name}
              onChange={(e) => setScreen({ ...screen, name: e.target.value })}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              disabled={isEditingScreen}
              onClick={() => {
                handleEditNameScreen(screen);
              }}
              sx={{ mt: 2 }}
            >
              {isEditingScreen ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t("view_screens_edit_button_save")
              )}
            </Button>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <TextField
              label={t("view_screens_edit_password")}
              variant="outlined"
              fullWidth
              type={showPassword ? "text" : "password"}
              onChange={(e) => {
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
              label={t("view_screens_edit_password_confirm")}
              variant="outlined"
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
              onChange={(e) => {
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
              disabled={isEditingScreen}
              onClick={() => handleEditPasswordScreen()}
              sx={{ mt: 2 }}
            >
              {isEditingScreen ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Save changes"
              )}
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export default ModalEditScreen;
