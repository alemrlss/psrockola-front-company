import { useState } from "react";
import { Button, Typography } from "@mui/material";
import api from "../../api/api";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [stage, setStage] = useState("forgot"); // 'forgot', 'verify', 'reset'
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setMessage("Verification code sent to your email.");
      setStage("verify");
    } catch (error) {
      setMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/verify-code", { email, code });
      setMessage("Code verified successfully.");
      setStage("reset");
    } catch (error) {
      setMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        code,
        newPassword,
      });
      setMessage("Password reset successfully.");
      setStage("success");
    } catch (error) {
      setMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    // Redirigir al usuario a la página de inicio de sesión
    // Implementa tu lógica de redireccionamiento aquí
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        {stage === "forgot" && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <Typography variant="h6">
              Forgot Your Password? only companys
            </Typography>
            <TextField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              label="Email"
              fullWidth
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Send Request"
              )}
            </Button>
          </form>
        )}
        {stage === "verify" && (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <Typography variant="h6">Enter Verification Code</Typography>
            <TextField
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              label="Verification Code"
              fullWidth
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>
        )}
        {stage === "reset" && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <Typography variant="h6">Reset Your Password</Typography>
            <TextField
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              label="New Password"
              fullWidth
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        )}
        {stage === "success" && (
          <div>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="primary"
              fullWidth
            >
              Go to Login
            </Button>
          </div>
        )}
        {message && <Typography className="mt-4">{message}</Typography>}
      </div>
    </div>
  );
}

export default ForgotPassword;
