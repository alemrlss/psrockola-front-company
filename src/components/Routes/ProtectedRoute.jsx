import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ allowEmployee }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user.type === 23) {
    // Si el usuario es una empresa, permite el acceso a la ruta protegida
    return <Outlet />;
  }

  if (allowEmployee && user.type === 22) {
    // Si el acceso a la ruta está permitido para empleados, y el usuario es un empleado, permite el acceso
    return <Outlet />;
  }

  if (user.type === 22 && user.enableCurrentPlaylist) {
    return <Outlet />;
  }

  // Si el usuario no es una empresa y el acceso no está permitido para empleados, redirige a Unauthorized
  return <Navigate to="/unauthorized" />;
}
