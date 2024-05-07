import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import { loginEmployee } from "../../features/authSlice";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { HouseOutlined } from "@mui/icons-material";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Nuevo estado de carga

  const dispatch = useDispatch();
  const goTo = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch({ type: "auth/clearError" });
  }, []); // Ejecutar solo cuando el componente se monta

  const handleInputChange = (e) => {
    setError("");
    dispatch({ type: "auth/clearError" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please complete all fields.");
      return;
    }

    if (!validateEmail(formData.email) || formData.password.length < 8) {
      setError("Invalid email or password.");
      return;
    }

    setLoading(true); // Establece el estado de carga en verdadero antes de la petición

    try {
      const result = await dispatch(loginEmployee(formData));
      if (result.payload && result.payload.token) {
        goTo("/employees/dashboard");
      }
    } catch (error) {
      // Manejar errores de inicio de sesión
    } finally {
      setLoading(false); // Establece el estado de carga en falso después de la petición
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div
      style={{ position: "relative", height: "100vh" }}
      className="bg-[#979DDA]"
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100%" }}
      >
        <Grid item xs={12} sm={8} md={6} lg={4}>
        <div className="flex  justify-between">
            <Tooltip title="Go to company panel" arrow>
              <Avatar
                sx={{
                  color: "white",
                  backgroundColor: "#F79303",
                  width: 58,
                  height: 58,
                }}
                component={Link}
                to="/login"
              >
                <StorefrontIcon style={{ width: "80%", height: "80%" }} />
              </Avatar>
            </Tooltip>
            <Tooltip title="Go to distributor panel" arrow>
              <Avatar
                sx={{
                  color: "white",
                  backgroundColor: "#F79303",
                  width: 58,
                  height: 58,
                }}
                component={Link}
                to="/login-distributor"
              >
                <HouseOutlined style={{ width: "80%", height: "80%" }} />
              </Avatar>
            </Tooltip>
          </div>
          <form
            onSubmit={handleSubmit}
            className="bg-white border rounded-xl p-4 py-8"
          >
            <Typography variant="h4" align="center" gutterBottom>
              Log in
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              Sign in as a employee{" "}
            </Typography>
            <SupervisorAccountIcon
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
              size="small"
              margin="normal"
              type="password"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                marginTop: "12px",
                backgroundColor: "#555CB3",
                "&:hover": {
                  backgroundColor: "#555CB3",
                },
              }}
              disabled={loading} // Desactivar el botón mientras se realiza la petición
            >
              {loading ? "Loading..." : "Log in"}
            </Button>
            {auth.status === "failed" && (
              <Typography
                variant="body2"
                color="error"
                style={{ marginTop: "16px" }}
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
        </Grid>
      </Grid>
    </div>
  );
}

export default Login;
