import axios from "axios";


// develop: http://localhost:5000/api
// production: https://psrockola-backend-develop.onrender.com/api


const apiFormData = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default apiFormData;
