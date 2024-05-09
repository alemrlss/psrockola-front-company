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

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<PublicRoute />}>
              <Route index element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login-employee" element={<LoginEmployee />} />
              <Route path="/login-distributor" element={<LoginDistributor />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
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
                <Route path="rockobits/buy" element={<RockobitsBuy />}></Route>
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
                <Route path="subscriptions/cancel" element={<Cancel />}></Route>
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
                <Route path="subscriptions/cancel" element={<Cancel />}></Route>
              </Route>
            </Route>
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route
              path="*"
              element={
                <h2 className="flex justify-center text-4xl">
                  Te has perdido? Pagina para cuando un usuario tipee algo
                  diferente a employees, companies o distributors. Recomiendo
                  poner un boton de volver a inicio, o en su defecto un boton de
                  volver atras.
                </h2>
              }
            />
          </Routes>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
