import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../api/api";
import { useSelector } from "react-redux";

function CreateEmployees() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    photo: null, // Inicializa el campo de foto a null
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const handleChange = (e) => {
    setMessage(null);
    if (e.target.name === "photo") {
      // Si el campo es de tipo archivo, actualiza solo el campo de foto en formData
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      // Actualiza otros campos de texto
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

    // Verifica que los campos requeridos estén completos
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

    // Crea una instancia de FormData
    const formDataInstance = new FormData();

    // Agrega los campos de datos al formDataInstance
    formDataInstance.append("name", formData.name);
    formDataInstance.append("lastName", formData.lastName);
    formDataInstance.append("email", formData.email);
    formDataInstance.append("password", formData.password);
    formDataInstance.append("address", formData.address);
    formDataInstance.append("phone", formData.phone);
    formDataInstance.append("userId", user.id);

    // Si hay una foto de perfil seleccionada, agrégala al FormData
    if (formData.photo) {
      formDataInstance.append("photo", formData.photo);
    }

    try {
      // Realiza la solicitud para crear el empleado con formData
      const response = await api.post("/employee/create", formDataInstance, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Muestra un mensaje de éxito
      setMessage({ type: "success", content: "Empleado creado con éxito." });

      // Restablece el formulario
      setFormData({
        name: "",
        lastName: "",
        email: "",
        password: "",
        address: "",
        phone: "",
        photo: null, // Si hay un campo de archivo, asegúrate de restablecerlo
      });

      // Elimina el mensaje después de 3 segundos
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error al crear el empleado:", error);
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
      <h2 className="text-2xl font-bold mb-6 text-center">Crear Empleado</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <TextField
          label="Nombre"
          name="name"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          value={formData.name}
        />
        <TextField
          label="Apellido"
          name="lastName"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          value={formData.lastName}
        />
        <TextField
          label="Correo Electrónico"
          name="email"
          type="email"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          value={formData.email}
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          value={formData.password}
        />
        <TextField
          label="Dirección"
          name="address"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          value={formData.address}
        />
        <TextField
          label="Teléfono"
          name="phone"
          variant="outlined"
          fullWidth
          onChange={handleChange}
          value={formData.phone}
        />
        {/* Añade un input de tipo file para permitir seleccionar una foto de perfil */}
        <TextField
          label="Foto de Perfil"
          name="photo"
          type="file"
          variant="outlined"
          fullWidth
          onChange={handleChange}
        />
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
                <span className="ml-2">Creando Empleado...</span>
              </div>
            ) : (
              "Crear Empleado"
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
