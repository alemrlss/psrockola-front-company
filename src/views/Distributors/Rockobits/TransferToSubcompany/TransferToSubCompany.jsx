import { useEffect, useState } from "react";
import { Autocomplete, FormControl, Button, TextField } from "@mui/material";
import api from "../../../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { updateUserBalance } from "../../../../features/authSlice";

function TransferToSubCompany() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [subCompanies, setSubCompanies] = useState([]);
  const [selectedSubCompany, setSelectedSubCompany] = useState(null);
  const [amount, setAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchSubCompanies = async () => {
      try {
        const response = await api.get("subcompany/distributor/" + user.id);
        setSubCompanies(response.data);
      } catch (error) {
        console.error("There was an error fetching the subcompanies!", error);
      }
    };

    fetchSubCompanies();
  }, [user.id]);

  const handleTransfer = async () => {
    try {
      // Preparar los datos para enviar al servidor
      const transferData = {
        distributor_id: user.id,
        subcompany_id: selectedSubCompany.id,
        amount: parseInt(amount),
      };

      // Realizar la solicitud POST al endpoint
      const response = await api.post(
        "rockobits/transferDistributorToSubcompany",
        transferData
      );

      // Verificar si la transferencia fue exitosa
      if (response.status === 201) {
        console.log(
          `Transferencia exitosa de ${amount} desde el distribuidor ${user.id} a la subcompany ${selectedSubCompany.id}`
        );

        const newBalance = user.balance - parseInt(amount);
        dispatch(updateUserBalance(newBalance));

        setSuccessMessage("¡Transferencia exitosa!");
        setErrorMessage("");
        setAmount("");
        setSelectedSubCompany(null);
      } else {
        console.error("Hubo un error durante la transferencia");
        setErrorMessage("Hubo un error durante la transferencia");
        setSuccessMessage("");
      }
    } catch (error) {
      if (error.response.data.message === "INSUFFICIENT_FUNDS") {
        setErrorMessage("Fondos insuficientes");
        setSuccessMessage("");
        return;
      }

      console.error("Hubo un error durante la transferencia", error);
      setErrorMessage("Hubo un error durante la transferencia");
      setSuccessMessage("");
    }
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  return (
    <div className="p-4">
      <FormControl fullWidth>
        <Autocomplete
          options={subCompanies}
          getOptionLabel={(option) => option.name}
          value={selectedSubCompany}
          onChange={(event, newValue) => {
            setSelectedSubCompany(newValue);
            setErrorMessage("");
            setSuccessMessage("");}}
          renderInput={(params) => (
            <TextField {...params} label="Seleccionar Subcompany" />
          )}
        />
      </FormControl>

      <FormControl fullWidth style={{ marginTop: 16 }}>
        <TextField
          label="Monto"
          type="number"
          value={amount}
          onChange={handleAmountChange}
        />
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleTransfer}
        style={{ marginTop: 16 }}
      >
        Transferir
      </Button>

      {successMessage && (
        <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>
      )}

      {errorMessage && (
        <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
      )}
    </div>
  );
}

export default TransferToSubCompany;
