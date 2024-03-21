import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import QrList from "../../components/Rockobits/QrList";
import api from "../../api/api";
import { updateUserBalance } from "../../features/authSlice";

function Qr() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [expirationTime, setExpirationTime] = useState("1h");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [qrList, setQrList] = useState([]);
  const [filterState, setFilterState] = useState("1");
  const [errorQrList, setErrorQrList] = useState(null);

  useEffect(() => {
    fetchQrList();
  }, [user.id, filterState]); // Se vuelve a cargar la lista cuando cambia el estado del filtro

  const fetchQrList = async () => {
    try {
      setErrorQrList(null);
      let url = `qr/rockobits?companyId=${user.id}&isEmployee=${
        user.type === 22 ? true : user.type === 23 ? false : null
      }`;

      if (filterState !== null) {
        url += `&state=${filterState}`;
      }

      const response = await api.get(url);

      setQrList(response.data.data);

      const activeExpiredQrs = response.data.data.filter(
        (qr) => qr.state === 1 && new Date(qr.expiration) < new Date()
      );

      if (activeExpiredQrs.length > 0) {
        fetchExpiredFunds();
      }
    } catch (error) {
      if (
        error.response.data.statusCode === 400 &&
        error.response.data.message === "NO_MEMBERSHIP_ACTIVATED"
      ) {
        setQrList([]);
        setErrorQrList("NO MEMBERSHIP ACTIVATE");
      }
    }
  };
  const fetchExpiredFunds = async () => {
    try {
      console.log(qrList);
      const response = await api.get(`/qr/return-expired-funds/${user.id}`);
      const totalReturnedAmount = response.data.data;
      if (totalReturnedAmount > 0) {
        const newBalance = user.balance + totalReturnedAmount;
        dispatch(updateUserBalance(newBalance));
      }

      fetchQrList();
    } catch (error) {
      console.error("Error returning expired funds:", error);
    }
  };

  const handleGenerateQR = async () => {
    try {
      const requestData = {
        amount: parseInt(amount),
        userId: user.id,
        expiration: expirationTime,
        isEmployee: user.type === 22 ? true : user.type === 23 ? false : null,
      };

      const response = await api.post("/qr/generate-rockobits", requestData);
      if (response.status === 201) {
        setErrorMessage("");
        setSuccessMessage("QR generated successfully");
        setAmount("");
        setExpirationTime("1h");

        const newBalance = user.balance - parseInt(amount);
        dispatch(updateUserBalance(newBalance));
        fetchQrList();

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      console.log(error.response.data);
      if (
        error.response.data.statusCode === 400 &&
        error.response.data.message === "NO_MEMBERSHIP_ACTIVATED"
      ) {
        setErrorMessage("NO MEMBERHSIP ACTIVATE");
        return;
      }

      if (
        error.response.data.statusCode === 400 &&
        error.response.data.message === "INSUFFICIENT_FUNDS"
      ) {
        setErrorMessage("INSUFFICIENT FUNDS");
        return;
      }

      setErrorMessage("Error generating QR");
      setSuccessMessage("");
    }
  };

  return (
    <div>
      <div
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          marginTop: "10px",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amount Rockobits"
              variant="outlined"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrorMessage("");
                setSuccessMessage("");
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Expired date</FormLabel>
              <RadioGroup
                row
                aria-label="expiration-time"
                name="expiration-time"
                value={expirationTime}
                onChange={(e) => {
                  setExpirationTime(e.target.value);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
              >
                <FormControlLabel
                  value="1m"
                  control={<Radio />}
                  label="1 Minute"
                />
                <FormControlLabel
                  value="1h"
                  control={<Radio />}
                  label="1 Hour"
                />
                <FormControlLabel
                  value="3h"
                  control={<Radio />}
                  label="3 Hours"
                />
                <FormControlLabel
                  value="1d"
                  control={<Radio />}
                  label="1 Day"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleGenerateQR}
              sx={{
                backgroundColor: "#F79303",
                color: "white",
                "&:hover": {
                  backgroundColor: "#E98B05",
                },
              }}
            >
              Generate QR
            </Button>
          </Grid>
        </Grid>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {successMessage && (
          <div style={{ color: "green" }}>{successMessage}</div>
        )}
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      </div>
      <div>
        <Divider />
        <h2 className="text-3xl text-center">Qr Codes</h2>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="filter-state"
            name="filter-state"
            value={filterState}
            onChange={(e) => {
              setFilterState(
                e.target.value === "null" ? null : parseInt(e.target.value)
              );
            }}
          >
            <FormControlLabel value="1" control={<Radio />} label="Active" />
            <FormControlLabel value="0" control={<Radio />} label="Inactive" />
            <FormControlLabel value="2" control={<Radio />} label="Consumed" />
            <FormControlLabel value="3" control={<Radio />} label="Expired" />
            <FormControlLabel value="null" control={<Radio />} label="All" />
          </RadioGroup>
        </FormControl>
      </div>
      <QrList
        qrList={qrList}
        setQrList={setQrList}
        fetchQrList={fetchQrList}
        errorQrList={errorQrList}
        user={user}
        dispatch={dispatch}
      />
    </div>
  );
}

export default Qr;
