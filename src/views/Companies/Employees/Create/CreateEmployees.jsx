import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import api from "../../../../api/api";
import { useSelector } from "react-redux";
import { CloudUpload } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

function CreateEmployees() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    photo: null,
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [limitEmployees, setLimitEmployees] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const response = await api.get(`employee/employees/${user.id}`);
        setLimitEmployees(response.data.data.employeeLimit);
      } catch (error) {
        console.error("Error al obtener las membresías:", error);
      }
    };

    getEmployees();
  }, [user.id]);

  const handleChange = (e) => {
    setMessage(null);
    if (e.target.name === "photo") {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user.id) {
      console.error("No se ha podido obtener el id del usuario");
      setLoading(false);
      return;
    }

    if (
      formData.name === "" ||
      formData.lastName === "" ||
      formData.email === "" ||
      formData.password === "" ||
      formData.address === "" ||
      formData.phone === ""
    ) {
      setMessage({
        type: "error",
        content: "Por favor, rellena todos los campos.",
      });
      setLoading(false);
      return;
    }

    const formDataInstance = new FormData();
    formDataInstance.append("name", formData.name);
    formDataInstance.append("lastName", formData.lastName);
    formDataInstance.append("email", formData.email);
    formDataInstance.append("password", formData.password);
    formDataInstance.append("address", formData.address);
    formDataInstance.append("phone", formData.phone);
    formDataInstance.append("userId", user.id);

    if (formData.photo) {
      formDataInstance.append("photo", formData.photo);
    }

    try {
      await api.post("/employee/create", formDataInstance, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({ type: "success", content: "Empleado creado con éxito." });
      setFormData({
        name: "",
        lastName: "",
        email: "",
        password: "",
        address: "",
        phone: "",
        photo: null,
      });

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error al crear el empleado:", error);

      if (error.response.data.message === "EMPLOYEES_LIMIT_REACHED") {
        setMessage({
          type: "error",
          content: "You have reached the employee limit.",
        });
        return;
      }
      if (error.response.data.message === "COMPANY_MEMBERSHIP_EXPIRED") {
        setMessage({
          type: "error",
          content: "Membership Expired.",
        });
        return;
      }

      setMessage({
        type: "error",
        content: "Error al crear el empleado. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-md shadow-lg">
      <h2 className="font-bold">
        {t("view_employees_create_limit")}: {limitEmployees}
      </h2>
      <h2 className="text-2xl font-bold mb-6 text-center">
        {t("view_employees_create_title")}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <TextField
          label={t("view_employees_create_name")}
          name="name"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          value={formData.name}
        />
        <TextField
          label={t("view_employees_create_lastname")}
          name="lastName"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          value={formData.lastName}
        />
        <TextField
          label={t("view_employees_create_email")}
          name="email"
          type="email"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          value={formData.email}
        />
        <div style={{ position: "relative", width: "100%", gridColumn: "span 2" }}>
          <TextField
            label={t("view_employees_create_password")}
            name="password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            onChange={handleChange}
            value={formData.password}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
        </div>
        <TextField
          label={t("view_employees_create_address")}
          name="address"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          value={formData.address}
        />
        <TextField
          label={t("view_employees_create_phone")}
          name="phone"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          value={formData.phone}
        />
        <Button
          variant="outlined"
          component="label"
          color="primary"
          startIcon={<CloudUpload />}
          sx={{
            borderRadius: 1,
            padding: "8px 6px",
            width: "100%",
            marginTop: 2,
            "&:hover": {
              backgroundColor: "rgba(33, 150, 243, 0.08)",
            },
            gridColumn: "span 2",
          }}
        >
          {t("view_employees_create_photo")}
          <input
            type="file"
            accept="image/*"
            name="photo"
            hidden
            onChange={handleChange}
          />
        </Button>
        <div className="col-span-2 flex justify-center">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="flex">
                <CircularProgress size={24} color="inherit" />
                <span className="ml-2">
                  {t("view_employees_create_loading")}
                </span>
              </div>
            ) : (
              t("view_employees_create_button")
            )}
          </Button>
        </div>
      </form>
      {message && (
        <div
          className={`${
            message.type === "success" ? "text-green-600" : "text-red-600"
          } p-2 mt-2 rounded font-bold`}
        >
          {message.content}
        </div>
      )}
    </div>
  );
}

export default CreateEmployees;
