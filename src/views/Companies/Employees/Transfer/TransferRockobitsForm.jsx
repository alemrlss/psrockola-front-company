import { useEffect, useState, useRef } from "react";
import api from "../../../../api/api";
import { Button, TextField, Autocomplete } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { updateUserBalance } from "../../../../features/authSlice";
import Sound from "../../../../../public/audio/Coin.wav";

function TransferRockobitsForm() {
  const audioRef = useRef(null);

  const [employeeId, setEmployeeId] = useState(null);
  const [amount, setAmount] = useState("");
  const [transferResult, setTransferResult] = useState("");
  const [employees, setEmployees] = useState([]);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const response = await api.get(`employee/employees/${user.id}`);
        setEmployees(response.data.data.employees);
      } catch (error) {
        console.error("Error al obtener las membresías:", error);
      }
    };

    getEmployees();
  }, [user.id]);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleTransfer = async () => {
    if (!employeeId) {
      setTransferResult("Please select an employee");
      return;
    }

    try {
      const body = {
        employee_id: employeeId.id,
        company_id: user.id,
        amount: parseInt(amount),
      };

      const response = await api.post(
        "rockobits/transferCompanyToEmployee",
        body
      );

      if (response.status === 201) {
        setTransferResult(`${amount} Rockobits transferred successfully`);
        setAmount("");
        setEmployeeId(null);
        const newBalance = user.balance - parseInt(amount);
        dispatch(updateUserBalance(newBalance));
        playSound();
      } else {
        setTransferResult("Error transferring rockobits");
      }
    } catch (error) {
      console.error("Error al transferir rockobits:", error);
      setTransferResult("Error al transferir rockobits");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mt-8">Transfer Rockobits</h2>
      <form className="flex flex-col space-y-4">
        <Autocomplete
          options={employees}
          getOptionLabel={(option) => `${option.name} ${option.lastName}` }
          value={employeeId}
          onChange={(event, newValue) => setEmployeeId(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Employee"
              variant="outlined"
            />
          )}
        />
        <TextField
          type="number"
          label="Amount"
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button variant="contained" onClick={handleTransfer}>
          Transfer Rockobits
        </Button>

        {transferResult && (
          <p
            className={
              transferResult.includes("Error")
                ? "text-red-500"
                : "text-green-500"
            }
          >
            {transferResult}
          </p>
        )}
      </form>
      <audio ref={audioRef} src={Sound} />
    </div>
  );
}

export default TransferRockobitsForm;
