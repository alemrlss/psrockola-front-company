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
import { useSelector } from "react-redux";
import QrList from "../../components/Rockobits/QrList";
import api from "../../api/api";

function Qr() {
  const idCompany = useSelector((state) => state.auth.user.id);
  const [amount, setAmount] = useState("");
  const [expirationTime, setExpirationTime] = useState("1h");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [qrList, setQrList] = useState([]);
  const [filterState, setFilterState] = useState(null);

  useEffect(() => {
    fetchQrList();
  }, [idCompany, filterState]); // Se vuelve a cargar la lista cuando cambia el estado del filtro

  const fetchQrList = async () => {
    try {
      let url = `qr/rockobits?companyId=${idCompany}`;

      if (filterState !== null) {
        url += `&state=${filterState}`;
      }

      const response = await api.get(url);
      setQrList(response.data.data);
    } catch (error) {
      console.error("Error fetching QR list:", error);
    }
  };

  const handleGenerateQR = async () => {
    try {
      const requestData = {
        amount: parseInt(amount),
        companyId: idCompany,
        expiration: expirationTime,
      };

      const response = await api.post("/qr/generate-rockobits", requestData);

      setSuccessMessage("QR generated successfully");
      setErrorMessage("");
      setAmount("");
      setExpirationTime("1h");

      fetchQrList();
    } catch (error) {
      setErrorMessage("Error generating QR");
      setSuccessMessage("");
      console.error("Error generating QR:", error);
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
            <FormControlLabel value="null" control={<Radio />} label="All" />
            <FormControlLabel value="1" control={<Radio />} label="Active" />
            <FormControlLabel value="0" control={<Radio />} label="Inactive" />
            <FormControlLabel value="2" control={<Radio />} label="Consumed" />
          </RadioGroup>
        </FormControl>
      </div>
      <QrList qrList={qrList} setQrList={setQrList} fetchQrList={fetchQrList} />
    </div>
  );
}

export default Qr;
