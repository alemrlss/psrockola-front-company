// api.js
import axios from "axios";

// develop: http://localhost:5000/api
// production: https://psrockola-backend-develop.onrender.com/api
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Reemplaza con la URL de tu servidor NestJS
  headers: {
    "Content-Type": "application/json",
    // Puedes agregar otros encabezados aquí según tus necesidades
  },
});

export default api;
