import { Box, Typography, Modal, Button } from "@mui/material";

function ModalEditUser({ openModal, handleCloseModal, user }) {
  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="user-settings-modal"
      aria-describedby="user-settings-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" id="modal-modal-title" align="center">
          Edit User Settings
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }} align="center">
          {user.name}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }} align="center">
          {user.email}
        </Typography>

        <Typography id="modal-modal-description" sx={{ mt: 2 }} align="center">
          {user.balance}
        </Typography>
        <Button onClick={handleCloseModal} sx={{ mt: 2 }}>
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
}

export default ModalEditUser;
