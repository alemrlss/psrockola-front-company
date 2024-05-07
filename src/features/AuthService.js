/* eslint-disable no-useless-catch */
import api from "../api/api";

// features/auth/authService.js
const authService = {
  async login(credentials) {
    try {
      const response = await api.post("auth/login/companies", {
        email: credentials.email,
        password: credentials.password,
      });

      if (response.status === 201) {
        console.log(response.data.user.photo);
        return {
          user: {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            type: response.data.user.type,
            balance: response.data.user.balance,
            wallet: response.data.user.wallet,
            membership: response.data.user.membership,
            address: response.data.user.address,
            postalCode: response.data.user.postalCode,
            phone: response.data.user.phone,
            photo: response.data.user.photo,
            language: response.data.user.language,
          },
          token: response.data.token,
          tokenExpiration: response.data.tokenExpiration,
        };
      } else {
        throw new Error("Error during login");
      }
    } catch (error) {
      console.log(error.response.data);
      if (error.response && error.response.data) {
        if (error.response.data.message === "PASSWORD_INCORRECT") {
          throw new Error("Password incorrect");
        } else if (error.response.data.message === "USER_NOT_FOUND") {
          throw new Error("Company not found");
        } else if (error.response.data.message === "USER_IS_NOT_ACTIVE") {
          throw new Error("Company not active");
        } else {
          throw new Error("Connection error, try again later");
        }
      } else {
        throw new Error("Connection error, try again later");
      }
    }
  },
  async loginEmployee(credentials) {
    try {
      // Realiza una solicitud al backend para iniciar sesión
      const response = await api.post("auth/login-employee", {
        email: credentials.email,
        password: credentials.password,
      });

      if (response.status === 201) {
        return {
          user: {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            type: response.data.user.type,
            balance: response.data.user.balance,
            wallet: response.data.user.wallet,
            membership: null,
            enableCurrentPlaylist: response.data.user.enableCurrentPlaylist,
            companyId: response.data.user.companyId,
            address: response.data.user.address,
            phone: response.data.user.phone,
            language: response.data.user.language,
          },
          token: response.data.token,
          tokenExpiration: response.data.tokenExpiration,
        };
      } else {
        throw new Error("Error during login");
      }
    } catch (error) {
      console.log(error.response.data);
      if (error.response && error.response.data) {
        if (error.response.data.message === "PASSWORD_INCORRECT") {
          throw new Error("Password incorrect");
        } else if (error.response.data.message === "EMPLOYEE_NOT_FOUND") {
          throw new Error("Employee not found");
        } else {
          throw new Error("Connection error, try again later");
        }
      } else {
        throw new Error("Connection error, try again later");
      }
    }
  },
  async loginDistributor(credentials) {
    try {
      // Realiza una solicitud al backend para iniciar sesión
      const response = await api.post("auth/login-distributor", {
        email: credentials.email,
        password: credentials.password,
      });

      if (response.status === 201) {
        return {
          user: {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            type: response.data.user.type,
            balance: response.data.user.balance,
            wallet: response.data.user.wallet,
            membership: null,
            enableCurrentPlaylist: response.data.user.enableCurrentPlaylist,
            companyId: response.data.user.companyId,
            address: response.data.user.address,
            phone: response.data.user.phone,
            language: response.data.user.language,
          },
          token: response.data.token,
          tokenExpiration: response.data.tokenExpiration,
        };
      } else {
        throw new Error("Error during login");
      }
    } catch (error) {
      console.log(error.response.data);
      if (error.response && error.response.data) {
        if (error.response.data.message === "PASSWORD_INCORRECT") {
          throw new Error("Password incorrect");
        } else if (error.response.data.message === "EMPLOYEE_NOT_FOUND") {
          throw new Error("Employee not found");
        } else {
          throw new Error("Connection error, try again later");
        }
      } else {
        throw new Error("Connection error, try again later");
      }
    }
  },
};

export default authService;
