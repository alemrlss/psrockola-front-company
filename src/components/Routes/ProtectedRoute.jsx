import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ allowedRoles }) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user);

    // Si el usuario no está autenticado, redirige a la página de inicio de sesión
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Verifica si el rol del usuario está en la lista de roles permitidos
    if (allowedRoles.includes(user.type)) {
        return <Outlet />;
    }

    // Si el usuario no tiene un rol permitido, redirige a la página de acceso no autorizado
    return <Navigate to="/unauthorized" />;
}
