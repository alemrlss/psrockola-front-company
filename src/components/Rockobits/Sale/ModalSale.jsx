/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

function ModalSale({
  isModalOpen,
  handleCloseModal,
  userData,
  quantity,
  transferRockobits,
}) {
  return (
    <Dialog open={isModalOpen} onClose={handleCloseModal}>
      <DialogTitle>Client Information</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          <strong>Name:</strong> {userData && userData.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Email:</strong> {userData && userData.email}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Transaction amount:</strong> {quantity}
        </Typography>
        {/* Agregar más información del cliente aquí si es necesario */}
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <Button
          onClick={transferRockobits}
          variant="contained"
          color="primary"
          sx={{
            bgcolor: "#F79303",
            color: "white",
            "&:hover": {
              bgcolor: "#E98B05",
            },
          }}
        >
          Sale
        </Button>
        <Button
          onClick={handleCloseModal}
          variant="contained"
          color="error"
          sx={{
            bgcolor: "#D20103",
            color: "white",
            "&:hover": {
              bgcolor: "#B30000",
            },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalSale;
