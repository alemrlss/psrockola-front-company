import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import { loginCompany } from "../../features/authSlice";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Tooltip from "@mui/material/Tooltip";
import BusinessIcon from "@mui/icons-material/Business";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch({ type: "auth/clearError" });
  }, []); // Ejecutar solo cuando el componente se monta

  const dispatch = useDispatch();
  const goTo = useNavigate();
  const auth = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    setError("");
    dispatch({ type: "auth/clearError" }); // Limpiar el error al cambiar el formulario
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    dispatch({ type: "auth/clearError" }); // Limpiar el error al cambiar el formulario

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please complete all fields.");
      return;
    }

    if (!validateEmail(formData.email) || formData.password.length < 8) {
      setError("Invalid email or password.");
      return;
    }

    dispatch(loginCompany(formData))
      .then((result) => {
        if (result.payload && result.payload.token) {
          goTo("/dashboard");
        }
      })
      .catch((error) => {
        // Manejar errores de inicio de sesión
        console.log(error);
        console.log("test");
      });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div
      style={{ position: "relative", height: "100vh" }}
      className="bg-[#FECE88]"
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100%" }}
      >
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <form
            onSubmit={handleSubmit}
            className="bg-white border rounded-xl p-4 py-8"
          >
            <Typography variant="h4" align="center" gutterBottom>
              Log in{" "}
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              Sign in as a company{" "}
            </Typography>
            <BusinessIcon
              style={{ fontSize: 50, margin: "auto", display: "block" }}
            />
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              variant="outlined"
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              size="small"
            />
            <TextField
              id="password"
              name="password"
              onChange={handleInputChange}
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              size="small"
              type="password"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                marginTop: "12px",
                backgroundColor: "#F79303",
                "&:hover": {
                  backgroundColor: "#F79303",
                },
              }}
              disabled={!!error || !!auth.error} // Desactivar el botón si hay un error en alguno de los estados
            >
              Log in
            </Button>
            {auth.status === "failed" && (
              <Typography
                variant="body2"
                sx={{ marginTop: "12px", fontWeight: "bold", color: "red" }}
              >
                {auth.error}
              </Typography>
            )}
            {error && (
              <Typography
                variant="body2"
                color="error"
                gutterBottom
                sx={{ marginTop: "12px", fontWeight: "bold" }}
              >
                {error}
              </Typography>
            )}
          </form>
          <Link to={"/forgot-password"}> Forgot Password? </Link>
        </Grid>
      </Grid>
      <Tooltip title="Go to employee panel" arrow>
        <Avatar
          sx={{
            position: "absolute",
            top: "16px",
            right: "16px",
            backgroundColor: "#555CB3",
            color: "white",
            width: 58,
            height: 58,
          }}
          component={Link}
          to="/login-employee"
        >
          <AccountCircleIcon style={{ width: "100%", height: "100%" }} />
        </Avatar>
      </Tooltip>
    </div>
  );
}

export default Login;
