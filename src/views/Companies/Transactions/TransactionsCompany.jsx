import { useState } from "react";
import { Tabs, Tab, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import PayTransaction from "../../../components/Transactions/Pay/PayTransaction";
import QrTransaction from "../../../components/Transactions/Qr/QrTransaction";
import TransactionsRockobits from "../../../components/Transactions/Rockobits/RockobitTransaction";
import TransactionRockobitsEmployee from "../../../components/Transactions/Rockobits/RockobitTransactionEmployee";

function TransactionsCompany() {
  // Estado para controlar la pestaña seleccionada
  const [selectedTab, setSelectedTab] = useState(0);
  const user = useSelector((state) => state.auth.user);

  // Manejador de cambio de pestaña
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Determinar si el usuario es empleado (user.type === 22)
  const isEmployee = user.type === 22;

  return (
    <div>
      {/* Barra de pestañas */}
      <Paper elevation={0}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          centered
          indicatorColor="primary"
          textColor="primary"
        >
          {/* Mostrar las pestañas basadas en el tipo de usuario */}
          {!isEmployee && <Tab label="Pay" />}{" "}
          {/* Mostrar solo si no es empleado */}
          <Tab label="Rockobits" />
          <Tab label="Qrs" />
        </Tabs>
      </Paper>

      {/* Contenido según la pestaña seleccionada */}
      {selectedTab === 0 &&
        (isEmployee ? <TransactionRockobitsEmployee /> : <PayTransaction />)}
      {selectedTab === (isEmployee ? 1 : 2) && <QrTransaction />}
      {selectedTab === (isEmployee ? null : 1) && <TransactionsRockobits />}
    </div>
  );
}

export default TransactionsCompany;
