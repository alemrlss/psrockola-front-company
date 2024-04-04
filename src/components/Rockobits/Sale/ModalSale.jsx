/* eslint-disable react/prop-types */
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";

function ModalSale({
  isModalOpen,
  handleCloseModal,
  userData,
  quantity,
  transferRockobits,
  errorModal,
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
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          pt: "16px",
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

      {errorModal && (
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography
            variant="body2"
            color="error"
            sx={{
              color: "#F44336",
              fontWeight: "bold",
              mb: 1,
            }}
          >
            {errorModal}
          </Typography>
          <Button
            onClick={() => {
              handleCloseModal();
              window.location.href = "/rockobits/buy";
            }}
            variant="contained"
            sx={{
              bgcolor: "#06DA30",
              color: "white",
              "&:hover": {
                bgcolor: "#06DA30",
              },
            }}
          >
            Buy Rockobits
          </Button>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default ModalSale;
