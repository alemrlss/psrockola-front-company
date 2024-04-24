import { useState } from "react";
import { Box, Button, Modal, Tabs, Tab, Typography } from "@mui/material";
import RockobitsTransactionsEmployee from "./RockobitsTransactionsEmployee/RockobitsTransactionsEmployee";
import QrTransactionsEmployee from "./QrTransactionsEmployee/QrTransactionsEmployee";

function ModalTransactionsEmployee({
  isModalOpen,
  handleCloseModal,
  selectedEmployee,
}) {
  // Define el estado para la pestaña activa
  const [activeTab, setActiveTab] = useState(0);

  // Maneja el cambio de pestañas
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
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
          width: "80%",
          maxWidth: "1200px",
          maxHeight: "80%",
          height: "80%",
          overflow: "auto",
        }}
      >
        {/* Botón para cerrar el modal */}
        <Button
          onClick={handleCloseModal}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          X
        </Button>

        {/* Título */}
        <Box
          sx={{
            textAlign: "center",
            marginY: "10px",
            fontSize: "26px",
          }}
        >
          <Typography variant="h4" gutter bottom>
            Transactions of{" "}
            <span className="font-bold">
              {" "}
              {selectedEmployee && selectedEmployee.name}
            </span>
          </Typography>
        </Box>

        {/* Barra de pestañas */}
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Rockobits" />
          <Tab label="QR" />
        </Tabs>

        {/* Contenido de cada pestaña */}
        {activeTab === 0 && (
          <RockobitsTransactionsEmployee selectedEmployee={selectedEmployee} />
        )}

        {activeTab === 1 && (
          <QrTransactionsEmployee selectedEmployee={selectedEmployee} />
        )}
      </Box>
    </Modal>
  );
}

export default ModalTransactionsEmployee;
