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
import { HouseOutlined } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Nuevo estado de carga
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default to English

  const dispatch = useDispatch();
  const goTo = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const userLanguages = navigator.languages;
    const supportedLanguages = ["es", "en", "pt"];

    const foundLanguage = userLanguages.find((language) =>
      supportedLanguages.includes(language.split("-")[0])
    );

    if (foundLanguage) {
      setSelectedLanguage(foundLanguage.split("-")[0]);
    }
  }, []);

  useEffect(() => {
    dispatch({ type: "auth/clearError" });
  }, [dispatch]);

  const handleInputChange = (e) => {
    setError("");
    dispatch({ type: "auth/clearError" }); // Limpiar el error al cambiar el formulario
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    dispatch({ type: "auth/clearError" }); // Limpiar el error al cambiar el formulario

    if (!formData.email.trim() || !formData.password.trim()) {
      setError(translations[selectedLanguage].completeFields);
      return;
    }

    if (!validateEmail(formData.email) || formData.password.length < 8) {
      setError(translations[selectedLanguage].invalidEmailOrPassword);
      return;
    }

    setLoading(true); // Establece el estado de carga en verdadero antes de la petición

    try {
      const result = await dispatch(loginCompany(formData));
      if (result.payload && result.payload.token) {
        goTo("/companies/dashboard");
      }
    } catch (error) {
      // Manejar errores de inicio de sesión
      console.log(error);
    } finally {
      setLoading(false); // Establece el estado de carga en falso después de la petición
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const translations = {
    en: {
      login: "Log in",
      signIn: "Sign in as a company",
      email: "Email",
      password: "Password",
      submit: "Log in",
      loading: "Loading...",
      completeFields: "Please complete all fields.",
      invalidEmailOrPassword: "Invalid email or password.",
      forgotPassword: "Forgot Password?",
      employeePanel: "Go to employee panel",
      distributorPanel: "Go to distributor panel"
    },
    es: {
      login: "Iniciar sesión",
      signIn: "Iniciar sesión como empresa",
      email: "Correo electrónico",
      password: "Contraseña",
      submit: "Iniciar sesión",
      loading: "Cargando...",
      completeFields: "Por favor, complete todos los campos.",
      invalidEmailOrPassword: "Correo electrónico o contraseña inválidos.",
      forgotPassword: "¿Olvidó su contraseña?",
      employeePanel: "Ir al panel de empleados",
      distributorPanel: "Ir al panel de distribuidores"
    },
    pt: {
      login: "Entrar",
      signIn: "Entrar como empresa",
      email: "E-mail",
      password: "Senha",
      submit: "Entrar",
      loading: "Carregando...",
      completeFields: "Por favor, preencha todos os campos.",
      invalidEmailOrPassword: "E-mail ou senha inválidos.",
      forgotPassword: "Esqueceu a senha?",
      employeePanel: "Ir para o painel do funcionário",
      distributorPanel: "Ir para o painel do distribuidor"
    },
  };

  const currentTranslations = translations[selectedLanguage];

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
          <div className="flex justify-between">
            <Tooltip title={currentTranslations.employeePanel} arrow>
              <Avatar
                sx={{
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
            <Tooltip title={currentTranslations.distributorPanel} arrow>
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
              {currentTranslations.login}
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              {currentTranslations.signIn}
            </Typography>
            <BusinessIcon
              style={{ fontSize: 50, margin: "auto", display: "block" }}
            />
            <TextField
              id="email"
              name="email"
              type="email"
              label={currentTranslations.email}
              variant="outlined"
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              size="small"
            />
            <Box sx={{ position: "relative", mb: 2 }}>
              <TextField
                id="password"
                name="password"
                onChange={handleInputChange}
                label={currentTranslations.password}
                variant="outlined"
                fullWidth
                margin="normal"
                size="small"
                type={showPassword ? "text" : "password"}
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>
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
              disabled={loading} // Desactivar el botón mientras se realiza la petición
            >
              {loading ? currentTranslations.loading : currentTranslations.submit}
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
          <Link to={"/forgot-password"}>{currentTranslations.forgotPassword}</Link>
        </Grid>
      </Grid>
    </div>
  );
}

export default Login;
