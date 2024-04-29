import { useEffect, useState, useRef } from "react";
import api from "../../../api/api";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { updateUserBalance } from "../../../features/authSlice";
import Sound from "../../../../public/audio/Coin.wav";

function TransferRockobitsForm() {
  const audioRef = useRef(null);

  const [employeeId, setEmployeeId] = useState("Select Employee");
  const [amount, setAmount] = useState("");
  const [transferResult, setTransferResult] = useState("");
  const [employees, setEmployees] = useState([]);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      const getEmployees = async () => {
        const response = await api.get(`employee/employees/${user.id}`);
        setEmployees(response.data.data.employees);
      };

      getEmployees();
    } catch (error) {
      console.error("Error al obtener las membresías:", error);
    }
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleTransfer = async () => {
    try {
      const body = {
        employee_id: employeeId,
        company_id: user.id,
        amount: parseInt(amount),
      };

      const response = await api.post(
        "rockobits/transferCompanyToEmployee",
        body
      );

      if (response.status === 201) {
        setTransferResult(`${amount} Rockobits transfered successfully`);
        setAmount("");
        setEmployeeId("Select Employee");
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
        <Select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          label="Select Employee"
        >
          <MenuItem disabled value="">
            -- Select Employee --
          </MenuItem>
          {employees.map((employee) => (
            <MenuItem key={employee.id} value={employee.id}>
              {employee.name}
            </MenuItem>
          ))}
        </Select>
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
