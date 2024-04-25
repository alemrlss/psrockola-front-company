import {
  Box,
  Button,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { CircularProgress } from "@mui/material";

function ModalCreateScreen({
  isCreateModalOpen,
  handleCreateModalClose,
  screen,
  setScreen,
  handleCreateScreen,
  isCreatingScreen,
  error,
}) {
  return (
    <Modal open={isCreateModalOpen} onClose={handleCreateModalClose}>
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
        <Box mt={4} sx={{ textAlign: "center" }}>
          <Paper elevation={3} sx={{ padding: 3, display: "inline-block" }}>
            <Typography variant="h4" gutterBottom>
              Create Screen
            </Typography>
            <TextField
              label="Name Screen"
              variant="outlined"
              fullWidth
              value={screen.name}
              onChange={(e) => setScreen({ ...screen, name: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Password Screen"
              variant="outlined"
              fullWidth
              value={screen.password}
              onChange={(e) =>
                setScreen({ ...screen, password: e.target.value })
              }
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateScreen}
              sx={{ mt: 2 }}
              disabled={isCreatingScreen} // Desactivar el botón cuando está en proceso
            >
              {isCreatingScreen ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create"
              )}
            </Button>

            {error && (
              <Typography variant="body1" sx={{ color: "red", mt: 2 }}>
                {error}
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Modal>
  );
}

export default ModalCreateScreen;
