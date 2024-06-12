import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./views/Login/Login";
import Layout from "./components/Layout/Layout";
import PublicRoute from "./components/Routes/PublicRoute";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import { AuthProvider } from "./auth/AuthProvider";
import { UserProvider } from "./contexts/UserContext";
import Cancel from "./views/Companies/Memberships/Cancel/Cancel";
import Screens from "./views/Companies/Screens/Screens";
import LoginEmployee from "./views/LoginEmployee/LoginEmployee";
import Unauthorized from "./components/Unauthorized/Unauthorized";
import MembershipsSuccess from "./views/Companies/Memberships/Success/MembershipSuccess";
import ForgotPasswordPage from "./views/ForgotPassword/ForgotPassword";
import LoginDistributor from "./views/LoginDistributor/LoginDistributor";
import DashboardDistributor from "./views/Distributors/Dashboard/Dashboard";
import DashboardCompany from "./views/Companies/Dashboard/Dashboard";
import DashboardSubcompanies from "./views/Subcompanies/Dashboard/Dashboard";
import CreateEmployees from "./views/Companies/Employees/Create/CreateEmployees";
import ListEmployees from "./views/Companies/Employees/List/ListEmployees";
import TransferRockobitsForm from "./views/Companies/Employees/Transfer/TransferRockobitsForm";
import DashboardEmployee from "./views/Employees/Dashboard/Dashboard";
import GetMemberships from "./views/Companies/Memberships/Get/GetMemberships";
import TransactionsCompany from "./views/Companies/Transactions/TransactionsCompany";
import TransactionsEmployee from "./views/Employees/Transactions/TransactionsEmployee";
import CurrentPlaysEmployee from "./views/Employees/CurrentPlays/CurrentPlaysEmployee";
import CurrentPlaysCompany from "./views/Companies/CurrentPlays/CurrentPlaysCompany";
import RockobitsBuy from "./views/Companies/Rockobits/Buy/RockobitsBuy";
import RockobitsSuccess from "./views/Companies/Rockobits/Buy/RockobitsSuccess";
import QrCompany from "./views/Companies/Rockobits/Qr/QrCompany";
import RockobitsSaleCompany from "./views/Companies/Rockobits/Sale/RockobitsSaleCompany";
import QrEmployee from "./views/Employees/Rockobits/Qr/QrEmployee";
import RockobitsSaleEmployee from "./views/Employees/Rockobits/Sale/RockobitsSaleEmployee";
import GetMembershipDistributors from "./views/Distributors/Memberships/GetMembershipsDistributor";
import RockobitsBuyDistributor from "./views/Distributors/Rockobits/Buy/Buy/RockobitsBuyDistributor";
import RockobitsSuccessDistributor from "./views/Distributors/Rockobits/Buy/Buy/RockobitsSuccessDistributor";
import MembershipsSuccessDistributor from "./views/Distributors/Memberships/Success/MembershipSuccessDistributor";
import CancelDistributor from "./views/Distributors/Memberships/Cancel/CancelDistributor";
import CreateSubcompanies from "./views/Distributors/Subcompanies/Create/CreateSubcompanies";
import ListSubcompanies from "./views/Distributors/Subcompanies/List/ListSubcompanies";
import LoginSubcompany from "./views/LoginSubcompany/LoginSubcompany";
import ScreenSubcompany from "./views/Subcompanies/Screen/ScreenSubcompany";
import TransferToSubCompany from "./views/Distributors/Rockobits/TransferToSubcompany/TransferToSubCompany";
import RockobitsSubcompanySale from "./views/Subcompanies/Rockobits/Sale/RockobitsSubcompanySale";
import Transactions from "./views/Distributors/Transactions/Transactions";
import TransactionsSubcompany from "./views/Subcompanies/Transactions/TransactionsSubcompany";
import QrSubcompany from "./views/Subcompanies/Rockobits/Qr/QrSubcompany";
import api from "./api/api";
import { useState } from "react";

function App() {
  const [sessionExpired, setSessionExpired] = useState(false);

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token"); // Elimina el token del localStorage
        localStorage.removeItem("user"); // Elimina el usuario del localStorage
        localStorage.removeItem("tokenExpiration"); // Elimina el tiempo de expiración del localStorage
        setSessionExpired(true);
      }
      return Promise.reject(error);
    }
  );

  return (
    <>
      <AuthProvider>
        <UserProvider>
          <Router>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<PublicRoute />}>
                <Route index element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login-employee" element={<LoginEmployee />} />
                <Route
                  path="/login-distributor"
                  element={<LoginDistributor />}
                />
                <Route path="/login-subcompany" element={<LoginSubcompany />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
              </Route>

              {/* Rutas protegidas para companies */}
              <Route
                path="/companies"
                element={<ProtectedRoute allowedRoles={[23]} />}
              >
                <Route element={<Layout />}>
                  <Route path="dashboard" element={<DashboardCompany />} />
                  <Route
                    path="rockobits/sale"
                    element={<RockobitsSaleCompany />}
                  ></Route>
                  <Route
                    path="rockobits/buy"
                    element={<RockobitsBuy />}
                  ></Route>
                  <Route
                    path="rockobits/success"
                    element={<RockobitsSuccess />}
                  ></Route>
                  <Route path="rockobits/qr" element={<QrCompany />}></Route>
                  <Route
                    path="transactions"
                    element={<TransactionsCompany />}
                  ></Route>{" "}
                  <Route path="screens" element={<Screens />}></Route>
                  <Route
                    path="employees/create"
                    element={<CreateEmployees />}
                  ></Route>
                  <Route
                    path="employees/list"
                    element={<ListEmployees />}
                  ></Route>
                  <Route
                    path="employees/transfer"
                    element={<TransferRockobitsForm />}
                  ></Route>
                  <Route
                    path="subscriptions/get"
                    element={<GetMemberships />}
                  ></Route>
                  <Route
                    path="subscriptions/cancel"
                    element={<Cancel />}
                  ></Route>
                  <Route
                    path="subscriptions/success"
                    element={<MembershipsSuccess />}
                  ></Route>
                  <Route
                    path="currentplays"
                    element={<CurrentPlaysCompany />}
                  ></Route>
                  <Route
                    path="*"
                    element={<Navigate to="/companies/dashboard" />}
                  />{" "}
                </Route>
              </Route>

              {/* Rutas protegidas para employees */}
              <Route
                path="/employees"
                element={<ProtectedRoute allowedRoles={[22]} />}
              >
                <Route element={<Layout />}>
                  <Route path="dashboard" element={<DashboardEmployee />} />
                  <Route
                    path="rockobits/sale"
                    element={<RockobitsSaleEmployee />}
                  ></Route>
                  <Route
                    path="rockobits/success"
                    element={<RockobitsSuccess />}
                  ></Route>
                  <Route path="rockobits/qr" element={<QrEmployee />}></Route>
                  <Route
                    path="transactions"
                    element={<TransactionsEmployee />}
                  ></Route>
                  <Route
                    path="currentplays"
                    element={<CurrentPlaysEmployee />}
                  ></Route>
                  <Route
                    path="*"
                    element={<Navigate to="/employees/dashboard" />}
                  />
                </Route>
              </Route>

              {/* Rutas protegidas para distributors */}
              <Route
                path="/distributors"
                element={<ProtectedRoute allowedRoles={[25]} />}
              >
                <Route element={<Layout />}>
                  <Route path="dashboard" element={<DashboardDistributor />} />

                  <Route
                    path="*"
                    element={<Navigate to="/distributors/dashboard" />}
                  />
                  <Route
                    path="subscriptions/get"
                    element={<GetMembershipDistributors />}
                  ></Route>
                  <Route
                    path="subscriptions/cancel"
                    element={<CancelDistributor />}
                  ></Route>
                  <Route
                    path="subscriptions/success"
                    element={<MembershipsSuccessDistributor />}
                  ></Route>
                  <Route
                    path="rockobits/buy"
                    element={<RockobitsBuyDistributor />}
                  ></Route>
                  <Route
                    path="rockobits/transfer"
                    element={<TransferToSubCompany />}
                  ></Route>
                  <Route
                    path="rockobits/success"
                    element={<RockobitsSuccessDistributor />}
                  ></Route>
                  <Route
                    path="subcompanies/create-subcompany"
                    element={<CreateSubcompanies />}
                  ></Route>

                  <Route
                    path="subcompanies/list-subcompanies"
                    element={<ListSubcompanies />}
                  ></Route>
                  <Route path="transactions" element={<Transactions />}></Route>
                </Route>
              </Route>

              <Route
                path="/subcompanies"
                element={<ProtectedRoute allowedRoles={[24]} />}
              >
                <Route element={<Layout />}>
                  <Route path="dashboard" element={<DashboardSubcompanies />} />
                  <Route path="screens" element={<ScreenSubcompany />} />
                  <Route
                    path="rockobits/sale"
                    element={<RockobitsSubcompanySale />}
                  />
                  <Route path="rockobits/qr" element={<QrSubcompany />}></Route>
                  <Route
                    path="transactions"
                    element={<TransactionsSubcompany />}
                  ></Route>
                  <Route
                    path="*"
                    element={<Navigate to="/subcompanies/dashboard" />}
                  />{" "}
                </Route>
              </Route>

              <Route path="unauthorized" element={<Unauthorized />} />
              <Route
                path="*"
                element={
                  <h2 className="flex justify-center text-4xl">
                    Te has perdido? Pagina para cuando un usuario tipee algo
                    diferente a employees, companies o distributors. Recomiendo
                    poner un boton de volver a inicio, o en su defecto un boton
                    de volver atras.
                  </h2>
                }
              />
            </Routes>
          </Router>
        </UserProvider>
      </AuthProvider>
      {sessionExpired && (
        <div
          className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-red-500 text-lg mb-4">Tu sesion ha expirado, por favor inicia sesion de nuevo</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Ir al Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
