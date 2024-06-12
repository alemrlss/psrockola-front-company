import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ allowedRoles }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  // Si el usuario no está autenticado, redirige a la página de inicio de sesión
  if (user) {
    if (!isAuthenticated) {
      if (user.type === 22) {
        return <Navigate to="/login-employee" />;
      }
      if (user.type === 23) {
        return <Navigate to="/login" />;
      }
      if (user.type === 25) {
        return <Navigate to="/login-distributor" />;
      }
      if (user.type === 24) {
        return <Navigate to="/login-subcompany" />;
      }
    }
  } else {
    // AQUI ENTRA CUANDO EXPIRA LA SESION Y EL USUARIO RECARGA PAGINA LO LLEVA AL LOGIN NO HAY FORMA DE LLEVARLO PERSONALIZADO
    return <Navigate to="/login" />;
  }

  // Verifica si el rol del usuario está en la lista de roles permitidos
  if (user.type) {
    if (allowedRoles.includes(user.type)) {
      return <Outlet />;
    }
  } else {
    return <Navigate to="/unauthorized" />;
  }

  // Si el usuario no tiene un rol permitido, redirige a la página de acceso no autorizado
  return <Navigate to="/unauthorized" />;
}
