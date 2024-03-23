import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../api/api";
import { updateUserBalance } from "../../../features/authSlice";
import apiFormData from "../../../api/apiFormData";
import ModalSale from "../../../components/Rockobits/Sale/ModalSale";
import {
  TextField,
  Button,
  Typography,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Box,
} from "@mui/material";

function RockobitsSale() {
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transferFile, setTransferFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleEmailChange = (event) => {
    setError("");
    setEmail(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setError("");
    setQuantity(event.target.value);
  };

  const handlePaymentMethodChange = (event) => {
    setError("");
    setPaymentMethod(event.target.value);
  };

  const handletransferFileChange = (event) => {
    setError("");
    setTransferFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (quantity <= 0) {
      setError("The quantity must be greater than 0");
      return;
    }

    if (!paymentMethod) {
      setError("You must select a payment method");
      return;
    }

    if (paymentMethod === "transfer" && !transferFile) {
      setError("You must upload the bank transfer file");
      return;
    }

    if (!user.id) {
      setError("Could not get user id");
      return;
    }
    try {
      const response = await api.get(`user/email/${email}`);
      if (response.status === 200) {
        setUserData(response.data.data);
        setIsModalOpen(true);
      } else {
        console.error("Error obtaining customer data:", response.data);
      }
    } catch (error) {
      console.error("Error", error);

      if (error.response.status === 404) {
        setError("Client not found");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmail("");
    setQuantity(0);
    setPaymentMethod("");
    setTransferFile(null);
  };

  const transferRockobits = async () => {
    try {
      let formData = new FormData();

      const transferData = {
        client_id: userData.id,
        company_id: user.id,
        amount: parseInt(quantity),
        type: user.type,
      };

      Object.entries(transferData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (paymentMethod === "transfer") {
        formData.append("paymentMethod", "transfer");
        if (!transferFile) {
          setError("Debes subir el archivo de transferencia bancaria");
          return;
        }

        formData.append("voucher", transferFile);
      }

      const response = await apiFormData.post(
        "rockobits/transferToClient",
        formData
      );

      if (response.status === 201) {
        console.log("Transferencia exitosa:", response.data);
        setIsModalOpen(false);
        setEmail("");
        setQuantity(0);
        setPaymentMethod("");
        setTransferFile(null);

        const newBalance = user.balance - parseInt(quantity);

        dispatch(updateUserBalance(newBalance));
      } else {
        console.error("Error en la transferencia:", response.data);
      }
    } catch (error) {
      console.error("Error al transferir Rockobits:", error);
    }
  };

  return (
    <Box maxWidth="md" mx="auto" mt={2} p={6} borderRadius={4} boxShadow={3}>
      <Typography variant="h4" align="center" gutterBottom>
        Sale Rockobits
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          id="email"
          label="Email Client"
          type="email"
          value={email}
          onChange={handleEmailChange}
          fullWidth
          required
          variant="outlined"
          margin="normal"
        />
        <TextField
          id="quantity"
          label="Quantity Rockobits"
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          fullWidth
          required
          variant="outlined"
          margin="normal"
        />
        <FormControl component="fieldset" margin="normal" required>
          <FormLabel component="legend">Payment Method:</FormLabel>
          <RadioGroup
            aria-label="paymentMethod"
            name="paymentMethod"
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
          >
            <FormControlLabel value="cash" control={<Radio />} label="Cash" />
            <FormControlLabel
              value="transfer"
              control={<Radio />}
              label="Wire transfer"
            />
          </RadioGroup>
        </FormControl>
        {paymentMethod === "transfer" && (
          <TextField
            id="transferFile"
            label="Upload voucher of bank transfer"
            type="file"
            onChange={handletransferFileChange}
            fullWidth
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            backgroundColor: "#F79303",
            color: "white",
            "&:hover": {
              backgroundColor: "#E98B05",
            },
          }}
        >
          Next
        </Button>
      </form>
      {error && (
        <Typography variant="body2" color="error" mt={2}>
          {error}
        </Typography>
      )}
      <ModalSale
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        userData={userData}
        quantity={quantity}
        transferRockobits={transferRockobits}
      />
    </Box>
  );
}

export default RockobitsSale;
