import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./views/Login/Login";
import Dashboard from "./views/Dashboard/Dashboard";
import Layout from "./components/Layout/Layout";
import Stripe from "./views/Stripe/Stripe";
import Success from "./views/Memberships/Success/Success";
import PublicRoute from "./components/Routes/PublicRoute";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import { AuthProvider } from "./auth/AuthProvider";
import { UserProvider } from "./contexts/UserContext";
import Cancel from "./views/Memberships/Cancel/Cancel";
import ListEmployees from "./views/Employees/List/ListEmployees";
import CreateEmployees from "./views/Employees/Create/CreateEmployees";
import Screens from "./views/Screens/Screens";
import Rockobits from "./views/Rockobits/Rockobits";
import TransferRockobitsForm from "./views/Employees/Transfer/TransferRockobitsForm";
import LoginEmployee from "./views/LoginEmployee/LoginEmployee";
import RockobitsSuccess from "./views/Rockobits/RockobitsSuccess";
import RockobitsSale from "./views/Rockobits/RockobitsSale";
import Unauthorized from "./components/Unauthorized/Unauthorized";
import Qr from "./views/Rockobits/Qr";
import Transactions from "./views/Transactions/Transactions";

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
            </Route>
            {/* Rutas protegidas */}
            <Route path="/" element={<ProtectedRoute allowEmployee={true} />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />}></Route>
                <Route
                  path="/rockobits/sale"
                  element={<RockobitsSale />}
                ></Route>
                <Route
                  path="/rockobits/success"
                  element={<RockobitsSuccess />}
                ></Route>
                <Route path="/rockobits/qr" element={<Qr />}></Route>

                <Route path="/transactions" element={<Transactions />}></Route>

                <Route path="/unauthorized" element={<Unauthorized />} />
              </Route>
            </Route>

            <Route path="/" element={<ProtectedRoute allowEmployee={false} />}>
              <Route element={<Layout />}>
                <Route path="/screens" element={<Screens />}></Route>
                <Route
                  path="/employees/create"
                  element={<CreateEmployees />}
                ></Route>
                <Route
                  path="/employees/list"
                  element={<ListEmployees />}
                ></Route>
                <Route
                  path="/employees/transfer"
                  element={<TransferRockobitsForm />}
                ></Route>
                <Route path="/subscriptions/get" element={<Stripe />}></Route>
                <Route
                  path="/subscriptions/cancel"
                  element={<Cancel />}
                ></Route>
                <Route path="/success" element={<Success />}></Route>
                <Route path="/rockobits/buy" element={<Rockobits />}></Route>
                <Route path="/unauthorized" element={<Unauthorized />} />

                <Route path="*" element={<Navigate to="/" />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
